import { n as coverFor } from "./covers-C3ZiEN96.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ebook-card-BEDteOYv.js
var import_jsx_runtime = require_jsx_runtime();
function EbookCard({ slug, title, subtitle, category, priceLabel, coverKey }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/ebooks/$slug",
		params: { slug },
		className: "group block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: coverFor(coverKey),
				alt: `Couverture du livre ${title}`,
				loading: "lazy",
				width: 800,
				height: 1200,
				className: "aspect-2/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex flex-col justify-end bg-ink/0 p-5 transition-colors duration-300 group-hover:bg-ink/75",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "translate-y-3 text-xs font-bold uppercase tracking-[0.16em] text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
					children: category ?? "Ebook"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "translate-y-3 font-display text-lg font-bold text-white opacity-0 transition-all delay-75 duration-300 group-hover:translate-y-0 group-hover:opacity-100",
					children: title
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-bold leading-snug transition-colors group-hover:text-primary",
					children: title
				}),
				subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: subtitle
				}) : null,
				priceLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pt-1 text-sm font-bold text-primary",
					children: priceLabel
				}) : null
			]
		})]
	});
}
//#endregion
export { EbookCard as t };
