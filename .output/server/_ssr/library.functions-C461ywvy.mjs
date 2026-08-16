import { a as requireSupabaseAuth, i as gone, n as badRequest, r as forbidden } from "./auth-middleware-BoaO0enN.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { l as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { t as optionalSupabaseAuth } from "./supabase-optional-auth-vWvPV78I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library.functions-C461ywvy.js
var slugInput = (data) => objectType({ slug: stringType().min(1).max(120) }).parse(data);
/** Library ownership + reading progress for the public fiche (works without login). */
var getEbookAccessStatus_createServerFn_handler = createServerRpc({
	id: "e9d0d497275f40cbdbaf891fe4ccc73afce640cf85627325eb80764883085592",
	name: "getEbookAccessStatus",
	filename: "src/lib/library.functions.ts"
}, (opts) => getEbookAccessStatus.__executeServer(opts));
var getEbookAccessStatus = createServerFn({ method: "GET" }).middleware([optionalSupabaseAuth]).validator(slugInput).handler(getEbookAccessStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	if (!supabase || !userId) return {
		hasAccess: false,
		progress: null
	};
	const { data: ebook } = await supabase.from("ebooks").select("id").eq("slug", data.slug).eq("published", true).maybeSingle();
	if (!ebook) return {
		hasAccess: false,
		progress: null
	};
	const { data: entry } = await supabase.from("library_entries").select("id").eq("user_id", userId).eq("ebook_id", ebook.id).maybeSingle();
	if (!entry) return {
		hasAccess: false,
		progress: null
	};
	const { data: progress } = await supabase.from("reading_progress").select("chapter_position, percent").eq("user_id", userId).eq("ebook_id", ebook.id).maybeSingle();
	return {
		hasAccess: true,
		progress: progress ?? null
	};
});
var getMyLibrary_createServerFn_handler = createServerRpc({
	id: "b5e807a74f28b703bba47f834af9ee52d003bd70bea8fd37d1b9059d859a6144",
	name: "getMyLibrary",
	filename: "src/lib/library.functions.ts"
}, (opts) => getMyLibrary.__executeServer(opts));
var getMyLibrary = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyLibrary_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: entries, error } = await supabase.from("library_entries").select("ebook_id, created_at, ebooks(id, slug, title, subtitle, cover_key, pages, reading_minutes)").eq("user_id", userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	const { data: progress } = await supabase.from("reading_progress").select("ebook_id, chapter_position, percent, updated_at").eq("user_id", userId);
	return (entries ?? []).map((entry) => ({
		ebook: entry.ebooks,
		progress: (progress ?? []).find((p) => p.ebook_id === entry.ebook_id) ?? null
	}));
});
var addToLibrary_createServerFn_handler = createServerRpc({
	id: "a04496c84775fb383d5f59ee960d8150b69698e6db09dea5a6748fc54fb1d415",
	name: "addToLibrary",
	filename: "src/lib/library.functions.ts"
}, (opts) => addToLibrary.__executeServer(opts));
var addToLibrary = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator(slugInput).handler(addToLibrary_createServerFn_handler, async () => {
	throw gone("L'accès gratuit automatique est désactivé. Le livre s'ouvre après paiement vérifié ou attribution par un administrateur.");
});
function isPrivateStoragePath(path) {
	return Boolean(path) && !/^https?:\/\//i.test(path) && !path.includes("..");
}
async function createPrivatePdfUrl(path, userClient) {
	if (!isPrivateStoragePath(path)) throw forbidden("Ce PDF n'est pas stocké de façon sécurisée.");
	try {
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		const { data: signed, error: signedError } = await supabaseAdmin.storage.from("ebooks").createSignedUrl(path, 900);
		if (signedError) throw signedError;
		return signed.signedUrl;
	} catch {
		const { data: signed, error: signedError } = await userClient.storage.from("ebooks").createSignedUrl(path, 900);
		if (signedError || !signed?.signedUrl) throw new Error("Le PDF existe, mais son accès sécurisé n'est pas configuré.");
		return signed.signedUrl;
	}
}
/** Full book content. Requires library_entries ownership. */
var getReaderBook_createServerFn_handler = createServerRpc({
	id: "f3956786d29dbafe3c8a4d5571425c6f999aaac0254ea4e3fc86f8347b44ecbb",
	name: "getReaderBook",
	filename: "src/lib/library.functions.ts"
}, (opts) => getReaderBook.__executeServer(opts));
var getReaderBook = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(slugInput).handler(getReaderBook_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: ebook, error } = await supabase.from("ebooks").select("id, slug, title, subtitle, cover_key, fichier_url, pages").eq("slug", data.slug).eq("published", true).maybeSingle();
	if (error) throw new Error(error.message);
	if (!ebook) return null;
	const { data: entry } = await supabase.from("library_entries").select("id").eq("user_id", userId).eq("ebook_id", ebook.id).maybeSingle();
	const safeEbook = {
		id: ebook.id,
		slug: ebook.slug,
		title: ebook.title,
		subtitle: ebook.subtitle,
		cover_key: ebook.cover_key,
		pages: ebook.pages
	};
	if (!entry) return {
		ebook: safeEbook,
		hasAccess: false,
		chapters: [],
		pdfUrl: null,
		progress: null,
		email: null
	};
	let pdfUrl = null;
	if (ebook.fichier_url) pdfUrl = await createPrivatePdfUrl(ebook.fichier_url, supabase);
	const { data: chapters } = await supabase.from("chapters").select("position, title, content").eq("ebook_id", ebook.id).order("position", { ascending: true });
	const { data: progress } = await supabase.from("reading_progress").select("chapter_position, percent").eq("user_id", userId).eq("ebook_id", ebook.id).maybeSingle();
	return {
		ebook: safeEbook,
		hasAccess: true,
		chapters: chapters ?? [],
		pdfUrl,
		progress: progress ?? null,
		email: context.claims.email ?? null
	};
});
var saveProgress_createServerFn_handler = createServerRpc({
	id: "fe3f553ed0790b17c1eeeac99cc336e1e15dadbaf0c7839ed6f1ab23f9ffab09",
	name: "saveProgress",
	filename: "src/lib/library.functions.ts"
}, (opts) => saveProgress.__executeServer(opts));
var saveProgress = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({
	slug: stringType().min(1).max(120),
	chapterPosition: numberType().int().min(1).max(500),
	percent: numberType().int().min(0).max(100)
}).parse(data)).handler(saveProgress_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: ebook } = await supabase.from("ebooks").select("id").eq("slug", data.slug).maybeSingle();
	if (!ebook) throw badRequest("Ce livre est introuvable.");
	const { data: entry } = await supabase.from("library_entries").select("id").eq("user_id", userId).eq("ebook_id", ebook.id).maybeSingle();
	if (!entry) throw forbidden("Ce livre n'est pas dans votre bibliothèque.");
	const { error } = await supabase.from("reading_progress").upsert({
		user_id: userId,
		ebook_id: ebook.id,
		chapter_position: data.chapterPosition,
		percent: data.percent,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "user_id,ebook_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { addToLibrary_createServerFn_handler, getEbookAccessStatus_createServerFn_handler, getMyLibrary_createServerFn_handler, getReaderBook_createServerFn_handler, saveProgress_createServerFn_handler };
