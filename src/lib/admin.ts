import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "client";

async function roleFromTable(
  client: SupabaseClient<Database>,
  table: "profiles" | "users",
  userId: string,
): Promise<{ role: AppRole | null; error: Error | null }> {
  const { data, error } = await client
    .from(table)
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (error) return { role: null, error: new Error(error.message) };
  if (!data) return { role: null, error: null };
  const role = "role" in data ? String(data.role ?? "") : "";
  if (!role) return { role: null, error: null };
  return { role: role === "admin" ? "admin" : "client", error: null };
}

export async function fetchUserRole(
  userId: string,
  client: SupabaseClient<Database> = supabase,
): Promise<AppRole> {
  // Source de vérité unique : profiles.role (voir supabase-security-production.sql)
  const profile = await roleFromTable(client, "profiles", userId);
  if (profile.error) throw profile.error;
  return profile.role === "admin" ? "admin" : "client";
}

export async function resolvePostLoginPath(userId: string, preferred?: string) {
  if (preferred && preferred.startsWith("/") && !preferred.startsWith("//"))
    return preferred;
  const role = await fetchUserRole(userId);
  return role === "admin" ? "/admin" : "/bibliotheque";
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
