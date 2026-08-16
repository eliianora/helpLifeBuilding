import { a as requireSupabaseAuth, r as forbidden } from "./auth-middleware-BoaO0enN.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as nullType, c as recordType, d as unknownType, i as literalType, l as stringType, n as booleanType, o as numberType, r as enumType, s as objectType, t as arrayType, u as unionType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-legacy.functions-DCCU_wRb.js
var resourceSchema = enumType([
	"auteurs",
	"categoriesEbooks",
	"categoriesProjets",
	"services",
	"projets",
	"langages",
	"bandeInfo",
	"paiements",
	"paniers",
	"rendezVous"
]);
var shortText = stringType().trim().max(255);
var longText = stringType().max(8e3);
var softUrl = stringType().max(1e3);
var uuidOrEmpty = unionType([
	stringType().uuid(),
	literalType(""),
	nullType()
]);
var RESOURCES = {
	auteurs: {
		table: "auteurs",
		fields: ["nom", "prenom"],
		order: "created_at",
		ascending: false,
		schema: objectType({
			nom: shortText.min(1),
			prenom: shortText.optional().nullable()
		})
	},
	categoriesEbooks: {
		table: "categorie_eb",
		fields: ["nom"],
		order: "nom",
		schema: objectType({ nom: shortText.min(1).max(100) })
	},
	categoriesProjets: {
		table: "categorie_pro",
		fields: ["nom"],
		order: "nom",
		schema: objectType({ nom: shortText.min(1).max(100) })
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
			"langages_ids"
		],
		order: "ordre",
		schema: objectType({
			titre: shortText.min(1),
			description: longText.optional().nullable(),
			prix: numberType().min(0).max(1e8).optional().nullable(),
			unite: shortText.max(50).optional().nullable(),
			icone: shortText.max(50).optional().nullable(),
			couleur: shortText.max(100).optional().nullable(),
			features: unknownType().optional().nullable(),
			populaire: booleanType().optional(),
			ordre: numberType().int().min(0).max(999).optional(),
			actif: booleanType().optional(),
			langages_ids: arrayType(stringType().uuid()).max(50).optional().nullable()
		})
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
			"visible"
		],
		order: "ordre",
		schema: objectType({
			icon: shortText.max(80).optional().nullable(),
			titre: shortText.min(1),
			description: longText.optional().nullable(),
			categorie_pro_id: uuidOrEmpty.optional(),
			langages_ids: arrayType(stringType().uuid()).max(50).optional().nullable(),
			statut: enumType([
				"brouillon",
				"publie",
				"archive"
			]).optional(),
			ordre: numberType().int().min(0).max(999).optional(),
			visible: booleanType().optional()
		})
	},
	langages: {
		table: "langages",
		fields: ["nom"],
		order: "nom",
		schema: objectType({ nom: shortText.min(1).max(100) })
	},
	bandeInfo: {
		table: "bande_info",
		fields: [
			"type",
			"contenu",
			"media_url",
			"lien",
			"actif",
			"ordre"
		],
		order: "ordre",
		schema: objectType({
			type: enumType([
				"text",
				"image",
				"video"
			]).optional(),
			contenu: longText.min(1),
			media_url: softUrl.optional().nullable(),
			lien: softUrl.optional().nullable(),
			actif: booleanType().optional(),
			ordre: numberType().int().min(0).max(999).optional()
		})
	},
	paiements: {
		table: "paiement",
		fields: ["statut"],
		order: "date_paiement",
		ascending: false,
		schema: objectType({ statut: enumType([
			"paid",
			"pending",
			"failed",
			"refunded"
		]) })
	},
	paniers: {
		table: "panier",
		fields: [],
		order: "ajoute_le",
		ascending: false,
		readOnly: true,
		schema: objectType({})
	},
	rendezVous: {
		table: "rendez_vous",
		fields: ["statut", "notes_admin"],
		order: "date_rdv",
		ascending: false,
		schema: objectType({
			statut: enumType([
				"en_attente",
				"confirme",
				"termine",
				"annule"
			]),
			notes_admin: longText.optional().nullable()
		})
	}
};
async function requireAdmin(context) {
	const { data, error } = await context.supabase.from("profiles").select("role").eq("id", context.userId).maybeSingle();
	if (error) throw new Error("Impossible de vérifier le rôle administrateur.");
	if (data?.role !== "admin") throw forbidden("Accès réservé aux administrateurs.");
}
async function getWriter(client) {
	if (processModule.env.SUPABASE_SERVICE_ROLE_KEY && processModule.env.SUPABASE_URL) {
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		return supabaseAdmin;
	}
	return client;
}
function sanitizeValues(resource, raw) {
	const config = RESOURCES[resource];
	const filtered = Object.fromEntries(Object.entries(raw).filter(([key]) => config.fields.includes(key)));
	const parsed = config.schema.partial().parse(filtered);
	return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, value === "" ? null : value]));
}
var adminLegacyList_createServerFn_handler = createServerRpc({
	id: "0b43dc51df4e9e857d19107173a415ebb92772bbe93b205ebe80afdf8c5aba70",
	name: "adminLegacyList",
	filename: "src/lib/admin-legacy.functions.ts"
}, (opts) => adminLegacyList.__executeServer(opts));
var adminLegacyList = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ resource: resourceSchema }).parse(input)).handler(adminLegacyList_createServerFn_handler, async ({ data, context }) => {
	await requireAdmin(context);
	const config = RESOURCES[data.resource];
	const { data: rows, error } = await (await getWriter(context.supabase)).from(config.table).select("*").order(config.order, { ascending: config.ascending ?? true }).limit(250);
	if (error) throw new Error(error.message);
	return rows ?? [];
});
var adminLegacySave_createServerFn_handler = createServerRpc({
	id: "fbd065e975a006c717ceb513d69196b88232d76cbd1933824849769fc0915c58",
	name: "adminLegacySave",
	filename: "src/lib/admin-legacy.functions.ts"
}, (opts) => adminLegacySave.__executeServer(opts));
var adminLegacySave = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	resource: resourceSchema,
	id: stringType().uuid().optional(),
	values: recordType(unknownType())
}).parse(input)).handler(adminLegacySave_createServerFn_handler, async ({ data, context }) => {
	await requireAdmin(context);
	const config = RESOURCES[data.resource];
	if (config.readOnly) throw new Error("Cette ressource est en lecture seule.");
	const values = sanitizeValues(data.resource, data.values);
	if (!Object.keys(values).length) throw new Error("Aucune donnée valide à enregistrer.");
	const db = await getWriter(context.supabase);
	if (data.id) {
		const { data: updated, error } = await db.from(config.table).update(values).eq("id", data.id).select("id").single();
		if (error) throw new Error(error.message);
		return updated;
	}
	const { data: created, error } = await db.from(config.table).insert(values).select("id").single();
	if (error) throw new Error(error.message);
	return created;
});
var adminLegacyDelete_createServerFn_handler = createServerRpc({
	id: "e73c03f9111753cb481c22be957e9d3ebdb8a7f5e221d415a0d91ae08f27b2d9",
	name: "adminLegacyDelete",
	filename: "src/lib/admin-legacy.functions.ts"
}, (opts) => adminLegacyDelete.__executeServer(opts));
var adminLegacyDelete = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	resource: resourceSchema,
	id: stringType().uuid()
}).parse(input)).handler(adminLegacyDelete_createServerFn_handler, async ({ data, context }) => {
	await requireAdmin(context);
	const config = RESOURCES[data.resource];
	if (config.readOnly) throw new Error("Cette ressource est en lecture seule.");
	const { data: deleted, error } = await (await getWriter(context.supabase)).from(config.table).delete().eq("id", data.id).select("id").single();
	if (error) throw new Error(error.message);
	return deleted;
});
//#endregion
export { adminLegacyDelete_createServerFn_handler, adminLegacyList_createServerFn_handler, adminLegacySave_createServerFn_handler };
