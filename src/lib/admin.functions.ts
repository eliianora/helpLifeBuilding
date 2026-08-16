import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { fetchUserRole, slugify } from "@/lib/admin";
import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type AuthCtx = {
  supabase: SupabaseClient<Database>;
  userId: string;
};

async function assertAdmin(context: AuthCtx) {
  const role = await fetchUserRole(context.userId, context.supabase);
  if (role !== "admin") {
    const { forbidden } = await import("@/lib/http-errors");
    throw forbidden("Accès réservé aux administrateurs.");
  }
}

async function writer(userClient: SupabaseClient<Database>) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL) {
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    return supabaseAdmin as unknown as SupabaseClient<Database>;
  }
  return userClient;
}

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const [ebooks, chapters, library, profiles] = await Promise.all([
      db.from("ebooks").select("id", { count: "exact", head: true }),
      db.from("chapters").select("id", { count: "exact", head: true }),
      db.from("library_entries").select("id", { count: "exact", head: true }),
      db.from("profiles").select("id", { count: "exact", head: true }),
    ]);
    const failed = [ebooks, chapters, library, profiles].find(
      (result) => result.error,
    );
    if (failed?.error) throw new Error(failed.error.message);
    return {
      ebooks: ebooks.count ?? 0,
      chapters: chapters.count ?? 0,
      lecteurs: profiles.count ?? 0,
      bibliotheque: library.count ?? 0,
    };
  });

export const adminListEbooks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const { data, error } = await db
      .from("ebooks")
      .select(
        "id, slug, title, subtitle, category, categorie_eb_id, price_label, prix, pages, published, position, cover_key, fichier_url, reading_minutes, description",
      )
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const ebookInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2).max(180),
  slug: z.string().max(120).optional(),
  subtitle: z.string().max(240).optional().nullable(),
  description: z.string().max(8000).optional().default(""),
  category: z.string().max(80).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  cover_key: z.string().max(80).optional().nullable(),
  fichier_url: z
    .string()
    .max(500)
    .optional()
    .nullable()
    .refine((value) => !value || (!/^https?:\/\//i.test(value) && !value.includes("..")), {
      message: "Le PDF doit être un chemin Storage privé.",
    }),
  price_label: z.string().max(40).optional().default("4 500 FCFA"),
  price_amount: z.number().min(0).max(100_000_000).optional().default(4500),
  pages: z.number().int().min(1).max(2000).optional().default(80),
  reading_minutes: z.number().int().min(1).max(5000).optional().default(90),
  position: z.number().int().min(0).max(999).optional().default(0),
  published: z.boolean().optional().default(false),
});

export const adminSaveEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => ebookInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const slug = (
      data.slug?.trim() ||
      slugify(data.title) ||
      `livre-${Date.now()}`
    ).slice(0, 120);
    const title = data.title.trim();
    const priceAmount = data.price_amount ?? 4500;
    const published = data.published ?? false;
    const fichierUrl = data.fichier_url?.trim() || null;
    if (fichierUrl && /^https?:\/\//i.test(fichierUrl)) {
      throw new Error("Le PDF doit être un chemin Storage privé (pdfs/...), pas une URL HTTP.");
    }
    if (fichierUrl && (fichierUrl.includes("..") || fichierUrl.startsWith("/"))) {
      throw new Error("Chemin PDF invalide.");
    }
    const payload = {
      title,
      titre: title,
      slug,
      subtitle: data.subtitle?.trim() || null,
      description: data.description ?? "",
      category: data.category?.trim() || null,
      categorie_eb_id: data.category_id || null,
      cover_key: data.cover_key?.trim() || null,
      image_url: data.cover_key?.trim() || null,
      fichier_url: fichierUrl,
      price_label: data.price_label || "4 500 FCFA",
      prix: priceAmount,
      pages: data.pages ?? 80,
      reading_minutes: data.reading_minutes ?? 90,
      position: data.position ?? 0,
      published,
      statut: published ? "publie" : "brouillon",
    } as Record<string, unknown>;
    if (data.id) {
      const { error } = await (db as SupabaseClient)
        .from("ebooks")
        .update(payload as never)
        .eq("id", data.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: data.id, slug };
    }
    const { data: created, error } = await (db as SupabaseClient)
      .from("ebooks")
      .insert(payload as never)
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return created;
  });

export const adminDeleteEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const { data: ebook } = await db
      .from("ebooks")
      .select("fichier_url")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await db
      .from("ebooks")
      .delete()
      .eq("id", data.id)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    if (ebook?.fichier_url && !/^https?:\/\//i.test(ebook.fichier_url)) {
      const { error: storageError } = await db.storage.from("ebooks").remove([ebook.fichier_url]);
      if (storageError) console.warn("[admin] PDF orphelin après suppression:", storageError.message);
    }
    return { ok: true };
  });

export const adminListChapters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z.object({ ebookId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const { data: rows, error } = await db
      .from("chapters")
      .select("id, ebook_id, title, position, is_preview, content")
      .eq("ebook_id", data.ebookId)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const chapterInput = z.object({
  id: z.string().uuid().optional(),
  ebook_id: z.string().uuid(),
  title: z.string().min(2).max(200),
  position: z.number().int().min(1).max(500),
  is_preview: z.boolean().optional().default(false),
  content: z.string().max(200000).optional().default(""),
});

export const adminSaveChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => chapterInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const { data: conflict, error: conflictError } = await db
      .from("chapters")
      .select("id")
      .eq("ebook_id", data.ebook_id)
      .eq("position", data.position)
      .neq("id", data.id ?? "00000000-0000-0000-0000-000000000000")
      .maybeSingle();
    if (conflictError) throw new Error(conflictError.message);
    if (conflict)
      throw new Error(
        `La position ${data.position} est déjà utilisée pour cet ebook.`,
      );
    const payload = {
      ebook_id: data.ebook_id,
      title: data.title.trim(),
      position: data.position,
      is_preview: data.is_preview ?? false,
      content: data.content ?? "",
    };
    if (data.id) {
      const { error } = await db
        .from("chapters")
        .update(payload)
        .eq("id", data.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: created, error } = await db
      .from("chapters")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return created;
  });

export const adminDeleteChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const { error } = await db
      .from("chapters")
      .delete()
      .eq("id", data.id)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListReaders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const { data: profiles, error } = await db
      .from("profiles")
      .select("id, display_name, email, role, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const { data: entries } = await db
      .from("library_entries")
      .select("user_id");
    const counts = (entries ?? []).reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.user_id] = (acc[row.user_id] ?? 0) + 1;
        return acc;
      },
      {},
    );

    return (profiles ?? []).map((profile) => ({
      ...profile,
      livres: counts[profile.id] ?? 0,
    }));
  });

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({ userId: z.string().uuid(), role: z.enum(["admin", "client"]) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId && data.role !== "admin") {
      throw new Error("Vous ne pouvez pas retirer votre propre rôle admin.");
    }
    const db = await writer(context.supabase);
    const { error } = await db
      .from("profiles")
      .update({ role: data.role })
      .eq("id", data.userId)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    // Alignement best-effort de l'ancienne table (non autoritaire)
    await db.from("users").update({ role: data.role }).eq("id", data.userId);
    return { ok: true };
  });

export const adminGrantEbookAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        ebookId: z.string().uuid(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const { error } = await db.from("library_entries").upsert(
      { user_id: data.userId, ebook_id: data.ebookId },
      { onConflict: "user_id,ebook_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminRevokeEbookAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        ebookId: z.string().uuid(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const db = await writer(context.supabase);
    const { error } = await db
      .from("library_entries")
      .delete()
      .eq("user_id", data.userId)
      .eq("ebook_id", data.ebookId)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Upload PDF admin : validation magic bytes côté serveur. */
export const adminUploadEbookPdf = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        fileName: z.string().min(1).max(180),
        base64: z.string().min(20).max(70_000_000),
        slugHint: z.string().max(120).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const raw = Buffer.from(data.base64, "base64");
    if (raw.byteLength > 50 * 1024 * 1024) {
      throw new Error("Le PDF ne doit pas dépasser 50 Mo.");
    }
    const header = raw.subarray(0, 5).toString("utf8");
    if (header !== "%PDF-") {
      throw new Error("Le fichier n'est pas un PDF valide.");
    }
    const base = slugify(data.slugHint || data.fileName.replace(/\.pdf$/i, "")) || "ebook";
    const path = `pdfs/${base}-${crypto.randomUUID()}.pdf`;
    const db = await writer(context.supabase);
    const { error } = await db.storage.from("ebooks").upload(path, raw, {
      contentType: "application/pdf",
      upsert: false,
    });
    if (error) throw new Error(`Échec de l'upload PDF : ${error.message}`);
    return { path };
  });
