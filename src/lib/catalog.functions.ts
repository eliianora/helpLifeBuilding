import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { demoGetEbookBySlug, demoListEbooks, isDemoMode } from "@/lib/demo-catalog";
import { getSupabasePublicEnv } from "@/lib/supabase-env";

function supabaseConfigured() {
  const { url, key } = getSupabasePublicEnv();
  return Boolean(url && key);
}

function publicClient() {
  const { url, key } = getSupabasePublicEnv();
  if (!url || !key) throw new Error("Missing Supabase environment variable(s).");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listEbooks = createServerFn({ method: "GET" }).handler(async () => {
  if (isDemoMode() || !supabaseConfigured()) {
    console.warn("[catalog] Mode démo — Supabase indisponible ou CATALOG_DEMO=1");
    return demoListEbooks();
  }

  try {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("ebooks")
      .select("id, slug, title, subtitle, description, cover_key, price_label, pages, reading_minutes, category")
      .eq("published", true)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  } catch (err) {
    console.warn("[catalog] Supabase inaccessible, bascule sur le catalogue démo:", err);
    return demoListEbooks();
  }
});

export const getEbookBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    if (isDemoMode() || !supabaseConfigured()) {
      return demoGetEbookBySlug(data.slug);
    }

    try {
      const supabase = publicClient();
      const { data: ebook, error } = await supabase
        .from("ebooks")
        .select("id, slug, title, subtitle, description, cover_key, price_label, pages, reading_minutes, category")
        .eq("slug", data.slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!ebook) return demoGetEbookBySlug(data.slug);

      const { data: toc } = await supabase
        .from("chapters")
        .select("position, title, is_preview")
        .eq("ebook_id", ebook.id)
        .order("position", { ascending: true });

      const { data: sample } = await supabase
        .from("chapters")
        .select("position, title, content")
        .eq("ebook_id", ebook.id)
        .eq("is_preview", true)
        .order("position", { ascending: true });

      let relatedQuery = supabase
        .from("ebooks")
        .select("slug, title, subtitle, cover_key, price_label, category")
        .eq("published", true)
        .neq("id", ebook.id)
        .order("position", { ascending: true })
        .limit(3);

      if (ebook.category) {
        relatedQuery = relatedQuery.eq("category", ebook.category);
      }

      const { data: related } = await relatedQuery;

      return { ebook, toc: toc ?? [], sample: sample ?? [], related: related ?? [] };
    } catch (err) {
      console.warn("[catalog] Supabase inaccessible, bascule sur la fiche démo:", err);
      return demoGetEbookBySlug(data.slug);
    }
  });
