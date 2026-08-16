import { r as __toESM } from "../_runtime.mjs";
import { i as mapAuthError } from "./ssr.mjs";
import { t as supabase } from "./client-DqaBVmPg.mjs";
import { n as resolvePostLoginPath } from "./admin-Bv8g1X24.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./auth.callback-D4Izfi9s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-DBrXCYGJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallback() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const [status, setStatus] = (0, import_react.useState)("Finalisation de la connexion…");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function finish() {
			try {
				if (search.error || search.error_description) throw new Error(search.error_description || search.error);
				const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
				const hashParams = new URLSearchParams(hash);
				const accessToken = hashParams.get("access_token");
				const refreshToken = hashParams.get("refresh_token");
				if (search.code) {
					const { error } = await supabase.auth.exchangeCodeForSession(search.code);
					if (error) throw error;
				} else if (accessToken && refreshToken) {
					const { error } = await supabase.auth.setSession({
						access_token: accessToken,
						refresh_token: refreshToken
					});
					if (error) throw error;
				} else {
					const { data, error } = await supabase.auth.getSession();
					if (error) throw error;
					if (!data.session) throw new Error("Session introuvable après redirection.");
				}
				if (cancelled) return;
				const { data: sessionData } = await supabase.auth.getSession();
				const userId = sessionData.session?.user.id;
				toast.success("Connexion réussie.");
				navigate({
					to: userId ? await resolvePostLoginPath(userId, search.redirect) : "/bibliotheque",
					replace: true
				});
			} catch (error) {
				if (cancelled) return;
				toast.error(mapAuthError(error));
				setStatus("Échec de la connexion");
				navigate({
					to: "/auth",
					replace: true
				});
			}
		}
		finish();
		return () => {
			cancelled = true;
		};
	}, [
		navigate,
		search.code,
		search.error,
		search.error_description,
		search.redirect
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground",
			children: status
		})
	});
}
//#endregion
export { AuthCallback as component };
