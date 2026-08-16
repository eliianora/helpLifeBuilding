import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { optionalSupabaseAuth } from "@/lib/supabase-optional-auth";
import { badRequest, forbidden, gone } from "@/lib/http-errors";

const slugInput = (data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data);

const PUBLIC_EBOOK_COLUMNS =
  "id, slug, title, subtitle, description, cover_key, price_label, pages, reading_minutes, category";

/** Library ownership + reading progress for the public fiche (works without login). */
export const getEbookAccessStatus = createServerFn({ method: "GET" })
  .middleware([optionalSupabaseAuth])
  .validator(slugInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (!supabase || !userId) return { hasAccess: false as const, progress: null };

    const { data: ebook } = await supabase
      .from("ebooks")
      .select("id")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!ebook) return { hasAccess: false as const, progress: null };

    const { data: entry } = await supabase
      .from("library_entries")
      .select("id")
      .eq("user_id", userId)
      .eq("ebook_id", ebook.id)
      .maybeSingle();
    if (!entry) return { hasAccess: false as const, progress: null };

    const { data: progress } = await supabase
      .from("reading_progress")
      .select("chapter_position, percent")
      .eq("user_id", userId)
      .eq("ebook_id", ebook.id)
      .maybeSingle();

    return { hasAccess: true as const, progress: progress ?? null };
  });

export const getMyLibrary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: entries, error } = await supabase
      .from("library_entries")
      .select(
        "ebook_id, created_at, ebooks(id, slug, title, subtitle, cover_key, pages, reading_minutes)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const { data: progress } = await supabase
      .from("reading_progress")
      .select("ebook_id, chapter_position, percent, updated_at")
      .eq("user_id", userId);

    return (entries ?? []).map((entry) => ({
      ebook: entry.ebooks,
      progress: (progress ?? []).find((p) => p.ebook_id === entry.ebook_id) ?? null,
    }));
  });

/**
 * Ancien auto-ajout gratuit — désactivé en production.
 * L'accès ne vient que d'un paiement vérifié ou d'une attribution admin.
 */
export const addToLibrary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(slugInput)
  .handler(async () => {
    throw gone(
      "L'accès gratuit automatique est désactivé. Le livre s'ouvre après paiement vérifié ou attribution par un administrateur.",
    );
  });

function isPrivateStoragePath(path: string) {
  return Boolean(path) && !/^https?:\/\//i.test(path) && !path.includes("..");
}

async function createPrivatePdfUrl(path: string, userClient: { storage: { from: (b: string) => { createSignedUrl: (p: string, s: number) => Promise<{ data: { signedUrl: string } | null; error: { message: string } | null }> } } }) {
  if (!isPrivateStoragePath(path)) {
    throw forbidden("Ce PDF n'est pas stocké de façon sécurisée.");
  }
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error: signedError } = await supabaseAdmin.storage
      .from("ebooks")
      .createSignedUrl(path, 15 * 60);
    if (signedError) throw signedError;
    return signed.signedUrl;
  } catch {
    const { data: signed, error: signedError } = await userClient.storage
      .from("ebooks")
      .createSignedUrl(path, 15 * 60);
    if (signedError || !signed?.signedUrl) {
      throw new Error("Le PDF existe, mais son accès sécurisé n'est pas configuré.");
    }
    return signed.signedUrl;
  }
}

/** Full book content. Requires library_entries ownership. */
export const getReaderBook = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(slugInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: ebook, error } = await supabase
      .from("ebooks")
      .select("id, slug, title, subtitle, cover_key, fichier_url, pages")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!ebook) return null;

    const { data: entry } = await supabase
      .from("library_entries")
      .select("id")
      .eq("user_id", userId)
      .eq("ebook_id", ebook.id)
      .maybeSingle();

    const safeEbook = {
      id: ebook.id,
      slug: ebook.slug,
      title: ebook.title,
      subtitle: ebook.subtitle,
      cover_key: ebook.cover_key,
      pages: ebook.pages,
    };

    if (!entry) {
      return {
        ebook: safeEbook,
        hasAccess: false as const,
        chapters: [],
        pdfUrl: null,
        progress: null,
        email: null,
      };
    }

    let pdfUrl: string | null = null;
    if (ebook.fichier_url) {
      pdfUrl = await createPrivatePdfUrl(ebook.fichier_url, supabase);
    }

    const { data: chapters } = await supabase
      .from("chapters")
      .select("position, title, content")
      .eq("ebook_id", ebook.id)
      .order("position", { ascending: true });

    const { data: progress } = await supabase
      .from("reading_progress")
      .select("chapter_position, percent")
      .eq("user_id", userId)
      .eq("ebook_id", ebook.id)
      .maybeSingle();

    return {
      ebook: safeEbook,
      hasAccess: true as const,
      chapters: chapters ?? [],
      pdfUrl,
      progress: progress ?? null,
      email: (context.claims.email as string | undefined) ?? null,
    };
  });

export const saveProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        slug: z.string().min(1).max(120),
        chapterPosition: z.number().int().min(1).max(500),
        percent: z.number().int().min(0).max(100),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: ebook } = await supabase
      .from("ebooks")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!ebook) throw badRequest("Ce livre est introuvable.");

    const { data: entry } = await supabase
      .from("library_entries")
      .select("id")
      .eq("user_id", userId)
      .eq("ebook_id", ebook.id)
      .maybeSingle();
    if (!entry) throw forbidden("Ce livre n'est pas dans votre bibliothèque.");

    const { error } = await supabase.from("reading_progress").upsert(
      {
        user_id: userId,
        ebook_id: ebook.id,
        chapter_position: data.chapterPosition,
        percent: data.percent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,ebook_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export { PUBLIC_EBOOK_COLUMNS };
