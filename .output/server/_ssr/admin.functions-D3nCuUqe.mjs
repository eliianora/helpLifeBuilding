import { a as requireSupabaseAuth } from "./auth-middleware-BoaO0enN.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DtYZ27hI.mjs";
import { l as stringType, n as booleanType, o as numberType, r as enumType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-D3nCuUqe.js
var getAdminStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4fec70c92c2624b017310f557d52373f6e45b4f5283a3272a864213d4d65e68d"));
var adminListEbooks = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1228b86c52c7ddb466a7a79757e5609b9a5cd0e04ac59cb1b7cc5f51c9e62458"));
var ebookInput = objectType({
	id: stringType().uuid().optional(),
	title: stringType().min(2).max(180),
	slug: stringType().max(120).optional(),
	subtitle: stringType().max(240).optional().nullable(),
	description: stringType().max(8e3).optional().default(""),
	category: stringType().max(80).optional().nullable(),
	category_id: stringType().uuid().optional().nullable(),
	cover_key: stringType().max(80).optional().nullable(),
	fichier_url: stringType().max(500).optional().nullable().refine((value) => !value || !/^https?:\/\//i.test(value) && !value.includes(".."), { message: "Le PDF doit être un chemin Storage privé." }),
	price_label: stringType().max(40).optional().default("4 500 FCFA"),
	price_amount: numberType().min(0).max(1e8).optional().default(4500),
	pages: numberType().int().min(1).max(2e3).optional().default(80),
	reading_minutes: numberType().int().min(1).max(5e3).optional().default(90),
	position: numberType().int().min(0).max(999).optional().default(0),
	published: booleanType().optional().default(false)
});
var adminSaveEbook = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => ebookInput.parse(data)).handler(createSsrRpc("778d165b8444fdcd064f531e8b4039249dc9df76a51964c74d0f8ff157b8e6cc"));
var adminDeleteEbook = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("ec94ca86f48e05851912f26742e6b5fc8963374b9e8c98e883eabd0988ae3f17"));
var adminListChapters = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ ebookId: stringType().uuid() }).parse(data)).handler(createSsrRpc("225b59bc2aecbf1437ce37287604c696595e6c76779b9b39de5287c00a83ffd1"));
var chapterInput = objectType({
	id: stringType().uuid().optional(),
	ebook_id: stringType().uuid(),
	title: stringType().min(2).max(200),
	position: numberType().int().min(1).max(500),
	is_preview: booleanType().optional().default(false),
	content: stringType().max(2e5).optional().default("")
});
var adminSaveChapter = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => chapterInput.parse(data)).handler(createSsrRpc("50c00dc0d06465e7e7bba5124133276d72b028ac4d41a9f1e044cf926e3f4376"));
var adminDeleteChapter = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("22696331aeaef913c54b108dac606e0e0c3ac83c60830ca664ab4ebe013f05ff"));
var adminListReaders = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("220d8858e112739a8c538c5d63644cc8220e64eb8e4ef787aacf6f8a987bc7ce"));
var adminSetRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({
	userId: stringType().uuid(),
	role: enumType(["admin", "client"])
}).parse(data)).handler(createSsrRpc("154da85bc7e5915df5164155bbb68a97441082079312d44aab513dabc82f59c3"));
var adminGrantEbookAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({
	userId: stringType().uuid(),
	ebookId: stringType().uuid()
}).parse(data)).handler(createSsrRpc("eb926b593a423c338e07f0c2113a5a22a029df6ebf8362e7f79e9b69d6af4b6f"));
var adminRevokeEbookAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({
	userId: stringType().uuid(),
	ebookId: stringType().uuid()
}).parse(data)).handler(createSsrRpc("d382d5d6f6d3feb0f2e6a698afee2948bfba3953d643ccead481714e06b09eef"));
/** Upload PDF admin : validation magic bytes côté serveur. */
var adminUploadEbookPdf = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({
	fileName: stringType().min(1).max(180),
	base64: stringType().min(20).max(7e7),
	slugHint: stringType().max(120).optional()
}).parse(data)).handler(createSsrRpc("9ac09a081b26143213bedb025de3dbea793a3f4dd263fd595eb080cece2ca914"));
//#endregion
export { adminListEbooks as a, adminSaveChapter as c, adminUploadEbookPdf as d, getAdminStats as f, adminListChapters as i, adminSaveEbook as l, adminDeleteEbook as n, adminListReaders as o, adminGrantEbookAccess as r, adminRevokeEbookAccess as s, adminDeleteChapter as t, adminSetRole as u };
