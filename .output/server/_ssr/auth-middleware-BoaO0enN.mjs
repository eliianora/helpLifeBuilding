import { n as __exportAll$1 } from "../_runtime.mjs";
import { n as getSupabasePublicEnv } from "./ssr.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as getRequest } from "./request-response-BEPp1C2k.mjs";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-BoaO0enN.js
var auth_middleware_BoaO0enN_exports = /* @__PURE__ */ __exportAll$1({
	a: () => http_errors_exports,
	i: () => gone,
	n: () => badRequest,
	r: () => forbidden,
	t: () => requireSupabaseAuth
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var http_errors_exports = /* @__PURE__ */ __exportAll({
	HttpError: () => HttpError,
	badRequest: () => badRequest,
	forbidden: () => forbidden,
	gone: () => gone,
	unauthorized: () => unauthorized
});
/** Erreurs HTTP typées pour les server functions (évite le 500 générique). */
var HttpError = class extends Error {
	statusCode;
	constructor(statusCode, message) {
		super(message);
		this.name = "HttpError";
		this.statusCode = statusCode;
	}
};
function unauthorized(message = "Connexion requise.") {
	return new HttpError(401, message);
}
function forbidden(message = "Accès refusé.") {
	return new HttpError(403, message);
}
function badRequest(message) {
	return new HttpError(400, message);
}
function gone(message) {
	return new HttpError(410, message);
}
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const { url, key } = getSupabasePublicEnv();
	if (!url || !key) throw unauthorized("Configuration Supabase manquante.");
	const request = getRequest();
	if (!request?.headers) throw unauthorized();
	const authHeader = request.headers.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) throw unauthorized();
	const token = authHeader.replace("Bearer ", "");
	if (!token || token.split(".").length !== 3) throw unauthorized("Jeton invalide.");
	const supabase = createClient(url, key, {
		global: {
			fetch: createSupabaseFetch(key),
			headers: { Authorization: `Bearer ${token}` }
		},
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data, error } = await supabase.auth.getClaims(token);
	if (error || !data?.claims?.sub) throw unauthorized("Session expirée ou invalide.");
	return next({ context: {
		supabase,
		userId: data.claims.sub,
		claims: data.claims
	} });
});
//#endregion
export { requireSupabaseAuth as a, gone as i, badRequest as n, forbidden as r, auth_middleware_BoaO0enN_exports as t };
