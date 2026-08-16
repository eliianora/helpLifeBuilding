import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { nt as ArrowRight } from "../_libs/lucide-react.mjs";
import { i as SiteHeader } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as PageBanner } from "./page-banner-kacNVSs9.mjs";
import { s as PORTFOLIO } from "./site-content-Cpl4DOVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portfolio-BgQckU37.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PortfolioPage() {
	const categories = (0, import_react.useMemo)(() => ["Tous", ...Array.from(new Set(PORTFOLIO.map((p) => p.categorie)))], []);
	const [selected, setSelected] = (0, import_react.useState)("Tous");
	const projets = PORTFOLIO.filter((p) => selected === "Tous" || p.categorie === selected);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBanner, {
				kicker: "Réalisations",
				title: "Notre portfolio",
				subtitle: "Les projets menés ces dernières années : édition, accompagnement, événements et médias."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-5 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-3",
						children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelected(cat),
							className: `px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${selected === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-primary"}`,
							children: cat
						}, cat))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3",
						children: projets.map((projet) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "premium-card group overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-40 items-center justify-center bg-ink text-6xl transition-transform duration-300 group-hover:scale-105",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									children: projet.emoji
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "premium-badge",
										children: projet.categorie
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 font-display text-xl font-semibold",
										children: projet.titre
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: projet.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex flex-wrap gap-2",
										children: projet.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-lg bg-secondary px-2 py-1 text-xs text-muted-foreground",
											children: tag
										}, tag))
									})
								]
							})]
						}, projet.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "premium-card mt-20 p-10 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-semibold",
								children: "Un projet en tête ?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-3 max-w-xl text-muted-foreground",
								children: "Parlons-en autour d'un premier échange : nous verrons ensemble ce qui est réalisable et dans quel délai."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/rdv",
								className: "mt-6 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:bg-brand-strong",
								children: ["Prendre rendez-vous", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "size-4",
									"aria-hidden": true
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { PortfolioPage as component };
