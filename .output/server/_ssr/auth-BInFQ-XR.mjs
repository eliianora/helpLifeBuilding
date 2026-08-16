import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BInFQ-XR.js
var $$splitComponentImporter = () => import("./auth-BvvWtMzY.mjs");
var Route = createFileRoute("/auth")({
	validateSearch: (search) => ({ redirect: typeof search.redirect === "string" && search.redirect.startsWith("/") ? search.redirect : void 0 }),
	head: () => ({ meta: [
		{ title: "Connexion — Prisca Brou" },
		{
			name: "description",
			content: "Connectez-vous pour accéder à votre bibliothèque et reprendre votre lecture en ligne."
		},
		{
			property: "og:title",
			content: "Connexion — Prisca Brou"
		},
		{
			property: "og:description",
			content: "Accédez à votre bibliothèque de lecture en ligne."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
