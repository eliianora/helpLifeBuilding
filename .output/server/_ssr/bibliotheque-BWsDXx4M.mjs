import { n as coverFor } from "./covers-C3ZiEN96.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CWkTyF61.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as SiteHeader } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as PageBanner } from "./page-banner-kacNVSs9.mjs";
import { o as useServerFn, r as getMyLibrary, t as Progress } from "./progress-bPK1miZt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bibliotheque-BWsDXx4M.js
var import_jsx_runtime = require_jsx_runtime();
function LibraryPage() {
	const fetchLibrary = useServerFn(getMyLibrary);
	const { data, isLoading, error } = useQuery({
		queryKey: ["library"],
		queryFn: () => fetchLibrary()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBanner, {
				kicker: "Espace lecteur",
				title: "Ma bibliothèque",
				subtitle: "Reprenez exactement là où vous vous êtes arrêtée."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-5 py-16",
				children: [
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10 text-muted-foreground",
						children: "Chargement…"
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10 text-destructive",
						children: "La bibliothèque n'a pas pu être chargée."
					}) : null,
					data && data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 rounded-xl border border-dashed border-border p-10 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl",
								children: "Votre bibliothèque est vide"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Choisissez un livre, lisez l'extrait, puis ajoutez-le ici pour le lire en entier."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "mt-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/ebooks",
									children: "Parcourir les livres"
								})
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 space-y-5",
						children: data?.map(({ ebook, progress }) => ebook ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5 rounded-xl border border-border/70 bg-card p-5 sm:flex-row sm:items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: coverFor(ebook.cover_key),
									alt: `Couverture du livre ${ebook.title}`,
									loading: "lazy",
									width: 800,
									height: 1200,
									className: "h-36 w-24 shrink-0 rounded-md object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-xl",
											children: ebook.title
										}),
										ebook.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: ebook.subtitle
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 max-w-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress?.percent ?? 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-xs text-muted-foreground",
												children: progress ? `${progress.percent}% lu — chapitre ${progress.chapter_position}` : "Pas encore commencé"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/lecture/$slug",
										params: { slug: ebook.slug },
										children: progress ? "Reprendre" : "Commencer"
									})
								})
							]
						}, ebook.id) : null)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { LibraryPage as component };
