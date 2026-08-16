import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { i as SiteHeader } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as PageBanner } from "./page-banner-kacNVSs9.mjs";
import { t as EbookCard } from "./ebook-card-BEDteOYv.mjs";
import { t as ebooksQuery } from "./ebooks.index-DRLIMACr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ebooks.index-Bq3FcU2Y.js
var import_jsx_runtime = require_jsx_runtime();
function EbooksIndex() {
	const { data: ebooks } = useSuspenseQuery(ebooksQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBanner, {
				kicker: "Catalogue",
				title: "Les livres",
				subtitle: "Chaque fiche contient un extrait gratuit du premier chapitre. La suite se lit en ligne, dans votre bibliothèque."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-6xl px-5 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
					children: ebooks.map((ebook) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EbookCard, {
						slug: ebook.slug,
						title: ebook.title,
						subtitle: ebook.subtitle,
						category: ebook.category,
						priceLabel: ebook.price_label,
						coverKey: ebook.cover_key
					}, ebook.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { EbooksIndex as component };
