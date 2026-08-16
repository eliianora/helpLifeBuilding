import { n as getSupabasePublicEnv } from "./ssr.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as getRequest } from "./request-response-BEPp1C2k.mjs";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-optional-auth-vWvPV78I.js
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
/** Attaches user context when a bearer token is present; otherwise continues anonymously. */
var optionalSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const { url, key } = getSupabasePublicEnv();
	const context = {
		supabase: null,
		userId: null
	};
	if (!url || !key) return next({ context });
	const authHeader = getRequest()?.headers?.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) return next({ context });
	const token = authHeader.replace("Bearer ", "");
	if (!token || token.split(".").length !== 3) return next({ context });
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
	if (error || !data?.claims?.sub) return next({ context });
	context.supabase = supabase;
	context.userId = data.claims.sub;
	return next({ context });
});
//#endregion
export { optionalSupabaseAuth as t };
