import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-D4Izfi9s.js
var $$splitComponentImporter = () => import("./auth.callback-DBrXCYGJ.mjs");
var Route = createFileRoute("/auth/callback")({
	ssr: false,
	validateSearch: (search) => ({
		redirect: typeof search.redirect === "string" && search.redirect.startsWith("/") ? search.redirect : void 0,
		code: typeof search.code === "string" ? search.code : void 0,
		error: typeof search.error === "string" ? search.error : void 0,
		error_description: typeof search.error_description === "string" ? search.error_description : void 0
	}),
	head: () => ({ meta: [{ title: "Connexion — Help Life Building" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
