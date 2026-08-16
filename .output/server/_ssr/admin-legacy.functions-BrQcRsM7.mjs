import { a as requireSupabaseAuth } from "./auth-middleware-BoaO0enN.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DtYZ27hI.mjs";
import { c as recordType, d as unknownType, l as stringType, r as enumType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-legacy.functions-BrQcRsM7.js
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
var adminLegacyList = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ resource: resourceSchema }).parse(input)).handler(createSsrRpc("0b43dc51df4e9e857d19107173a415ebb92772bbe93b205ebe80afdf8c5aba70"));
var adminLegacySave = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	resource: resourceSchema,
	id: stringType().uuid().optional(),
	values: recordType(unknownType())
}).parse(input)).handler(createSsrRpc("fbd065e975a006c717ceb513d69196b88232d76cbd1933824849769fc0915c58"));
var adminLegacyDelete = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	resource: resourceSchema,
	id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("e73c03f9111753cb481c22be957e9d3ebdb8a7f5e221d415a0d91ae08f27b2d9"));
//#endregion
export { adminLegacyList as n, adminLegacySave as r, adminLegacyDelete as t };
