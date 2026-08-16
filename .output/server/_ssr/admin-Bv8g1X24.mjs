import { t as supabase } from "./client-DqaBVmPg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Bv8g1X24.js
async function roleFromTable(client, table, userId) {
	const { data, error } = await client.from(table).select("role").eq("id", userId).maybeSingle();
	if (error) return {
		role: null,
		error: new Error(error.message)
	};
	if (!data) return {
		role: null,
		error: null
	};
	const role = "role" in data ? String(data.role ?? "") : "";
	if (!role) return {
		role: null,
		error: null
	};
	return {
		role: role === "admin" ? "admin" : "client",
		error: null
	};
}
async function fetchUserRole(userId, client = supabase) {
	const profile = await roleFromTable(client, "profiles", userId);
	if (profile.error) throw profile.error;
	return profile.role === "admin" ? "admin" : "client";
}
async function resolvePostLoginPath(userId, preferred) {
	if (preferred && preferred.startsWith("/") && !preferred.startsWith("//")) return preferred;
	return await fetchUserRole(userId) === "admin" ? "/admin" : "/bibliotheque";
}
function slugify(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
//#endregion
export { resolvePostLoginPath as n, slugify as r, fetchUserRole as t };
