import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { forbidden } from "@/lib/http-errors";

const resourceSchema = z.enum([
  "auteurs",
  "categoriesEbooks",
  "categoriesProjets",
  "services",
  "projets",
  "langages",
  "bandeInfo",
  "paiements",
  "paniers",
  "rendezVous",
]);

export type LegacyAdminResource = z.infer<typeof resourceSchema>;
type JsonValue = string | number | boolean | null | string[];

type ResourceConfig = {
  table: string;
  fields: readonly string[];
  order: string;
  ascending?: boolean;
  readOnly?: boolean;
  schema: z.ZodObject<z.ZodRawShape>;
};

const shortText = z.string().trim().max(255);
const longText = z.string().max(8000);
const softUrl = z.string().max(1000);
const uuidOrEmpty = z.union([z.string().uuid(), z.literal(""), z.null()]);

const RESOURCES: Record<LegacyAdminResource, ResourceConfig> = {
  auteurs: {
    table: "auteurs",
    fields: ["nom", "prenom"],
    order: "created_at",
    ascending: false,
    schema: z.object({
      nom: shortText.min(1),
      prenom: shortText.optional().nullable(),
    }),
  },
  categoriesEbooks: {
    table: "categorie_eb",
    fields: ["nom"],
    order: "nom",
    schema: z.object({ nom: shortText.min(1).max(100) }),
  },
  categoriesProjets: {
    table: "categorie_pro",
    fields: ["nom"],
    order: "nom",
    schema: z.object({ nom: shortText.min(1).max(100) }),
  },
  services: {
    table: "services",
    fields: [
      "titre",
      "description",
      "prix",
      "unite",
      "icone",
      "couleur",
      "features",
      "populaire",
      "ordre",
      "actif",
      "langages_ids",
    ],
    order: "ordre",
    schema: z.object({
      titre: shortText.min(1),
      description: longText.optional().nullable(),
      prix: z.number().min(0).max(100_000_000).optional().nullable(),
      unite: shortText.max(50).optional().nullable(),
      icone: shortText.max(50).optional().nullable(),
      couleur: shortText.max(100).optional().nullable(),
      features: z.unknown().optional().nullable(),
      populaire: z.boolean().optional(),
      ordre: z.number().int().min(0).max(999).optional(),
      actif: z.boolean().optional(),
      langages_ids: z.array(z.string().uuid()).max(50).optional().nullable(),
    }),
  },
  projets: {
    table: "projet",
    fields: [
      "icon",
      "titre",
      "description",
      "categorie_pro_id",
      "langages_ids",
      "statut",
      "ordre",
      "visible",
    ],
    order: "ordre",
    schema: z.object({
      icon: shortText.max(80).optional().nullable(),
      titre: shortText.min(1),
      description: longText.optional().nullable(),
      categorie_pro_id: uuidOrEmpty.optional(),
      langages_ids: z.array(z.string().uuid()).max(50).optional().nullable(),
      statut: z.enum(["brouillon", "publie", "archive"]).optional(),
      ordre: z.number().int().min(0).max(999).optional(),
      visible: z.boolean().optional(),
    }),
  },
  langages: {
    table: "langages",
    fields: ["nom"],
    order: "nom",
    schema: z.object({ nom: shortText.min(1).max(100) }),
  },
  bandeInfo: {
    table: "bande_info",
    fields: ["type", "contenu", "media_url", "lien", "actif", "ordre"],
    order: "ordre",
    schema: z.object({
      type: z.enum(["text", "image", "video"]).optional(),
      contenu: longText.min(1),
      media_url: softUrl.optional().nullable(),
      lien: softUrl.optional().nullable(),
      actif: z.boolean().optional(),
      ordre: z.number().int().min(0).max(999).optional(),
    }),
  },
  paiements: {
    table: "paiement",
    fields: ["statut"],
    order: "date_paiement",
    ascending: false,
    schema: z.object({
      statut: z.enum(["paid", "pending", "failed", "refunded"]),
    }),
  },
  paniers: {
    table: "panier",
    fields: [],
    order: "ajoute_le",
    ascending: false,
    readOnly: true,
    schema: z.object({}),
  },
  rendezVous: {
    table: "rendez_vous",
    fields: ["statut", "notes_admin"],
    order: "date_rdv",
    ascending: false,
    schema: z.object({
      statut: z.enum(["en_attente", "confirme", "termine", "annule"]),
      notes_admin: longText.optional().nullable(),
    }),
  },
};

type AuthContext = {
  supabase: SupabaseClient;
  userId: string;
};

async function requireAdmin(context: AuthContext) {
  const { data, error } = await context.supabase
    .from("profiles")
    .select("role")
    .eq("id", context.userId)
    .maybeSingle();
  if (error) throw new Error("Impossible de vérifier le rôle administrateur.");
  if (data?.role !== "admin") throw forbidden("Accès réservé aux administrateurs.");
}

async function getWriter(client: SupabaseClient): Promise<SupabaseClient> {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return supabaseAdmin;
  }
  return client;
}

function sanitizeValues(resource: LegacyAdminResource, raw: Record<string, unknown>) {
  const config = RESOURCES[resource];
  const filtered = Object.fromEntries(
    Object.entries(raw).filter(([key]) => config.fields.includes(key)),
  );
  const parsed = config.schema.partial().parse(filtered);
  // Empty strings → null for optional FK / URL fields
  return Object.fromEntries(
    Object.entries(parsed).map(([key, value]) => [key, value === "" ? null : value]),
  );
}

export const adminLegacyList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ resource: resourceSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const config = RESOURCES[data.resource];
    const db = await getWriter(context.supabase);
    const { data: rows, error } = await db
      .from(config.table)
      .select("*")
      .order(config.order, { ascending: config.ascending ?? true })
      .limit(250);
    if (error) throw new Error(error.message);
    return (rows ?? []) as Array<Record<string, JsonValue>>;
  });

export const adminLegacySave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        resource: resourceSchema,
        id: z.string().uuid().optional(),
        values: z.record(z.unknown()),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const config = RESOURCES[data.resource];
    if (config.readOnly) throw new Error("Cette ressource est en lecture seule.");

    const values = sanitizeValues(data.resource, data.values);
    if (!Object.keys(values).length) throw new Error("Aucune donnée valide à enregistrer.");

    const db = await getWriter(context.supabase);
    if (data.id) {
      const { data: updated, error } = await db
        .from(config.table)
        .update(values)
        .eq("id", data.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return updated;
    }

    const { data: created, error } = await db.from(config.table).insert(values).select("id").single();
    if (error) throw new Error(error.message);
    return created;
  });

export const adminLegacyDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ resource: resourceSchema, id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const config = RESOURCES[data.resource];
    if (config.readOnly) throw new Error("Cette ressource est en lecture seule.");

    const db = await getWriter(context.supabase);
    const { data: deleted, error } = await db
      .from(config.table)
      .delete()
      .eq("id", data.id)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return deleted;
  });
