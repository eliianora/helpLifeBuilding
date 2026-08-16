import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lecture._slug-DEf99ni7.js
var $$splitComponentImporter = () => import("./lecture._slug-B2AmFRrl.mjs");
var Route = createFileRoute("/_authenticated/lecture/$slug")({
	head: () => ({ meta: [
		{ title: "Lecture en ligne — Prisca Brou" },
		{
			name: "description",
			content: "Lecteur en ligne sécurisé de votre bibliothèque."
		},
		{
			property: "og:title",
			content: "Lecture en ligne — Prisca Brou"
		},
		{
			property: "og:description",
			content: "Lecteur en ligne sécurisé de votre bibliothèque."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
