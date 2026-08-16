import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Y as Check, nt as ArrowRight } from "../_libs/lucide-react.mjs";
import { i as SiteHeader } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as PageBanner } from "./page-banner-kacNVSs9.mjs";
import { a as GARANTIES, d as formatFcfa, l as SERVICES, o as PACKS } from "./site-content-Cpl4DOVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-CoUAgeGN.js
var import_jsx_runtime = require_jsx_runtime();
function ServicesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBanner, {
				kicker: "Expertise",
				title: "Nos services",
				subtitle: "Un accompagnement professionnel, en individuel ou en groupe, pour transformer vos idées en résultats."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-5 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-7 md:grid-cols-3",
						children: SERVICES.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `premium-card relative p-7 ${service.populaire ? "ring-2 ring-primary" : ""}`,
							children: [
								service.populaire ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground",
									children: "Populaire"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-md`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(service.icon, {
										className: "size-7",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-6 font-display text-2xl font-semibold",
									children: service.titre
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: service.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-6 space-y-3 text-sm",
									children: service.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "mt-0.5 size-4 shrink-0 text-brand",
											"aria-hidden": true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: feature
										})]
									}, feature))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-7 flex items-center justify-between border-t border-border/60 pt-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-xl font-semibold",
										children: [service.prix ? formatFcfa(service.prix) : service.unite, service.prix ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-normal text-muted-foreground",
											children: ["/", service.unite]
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/rdv",
										className: "inline-flex items-center gap-1.5 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:bg-brand-strong",
										children: ["Réserver", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
											className: "size-4",
											"aria-hidden": true
										})]
									})]
								})
							]
						}, service.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-24 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-extrabold uppercase tracking-tight",
								children: "Nos packs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "section-bar",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-muted-foreground",
								children: "Des offres groupées pour un meilleur rapport qualité-prix."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-7 md:grid-cols-3",
						children: PACKS.map((pack) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `premium-card relative p-7 ${pack.popular ? "ring-2 ring-gold" : ""}`,
							children: [
								pack.popular ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white",
									children: "Meilleure offre"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl font-semibold",
									children: pack.nom
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: pack.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 font-display text-3xl font-semibold text-brand-strong",
									children: formatFcfa(pack.prix)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-6 space-y-3 text-sm",
									children: pack.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "mt-0.5 size-4 shrink-0 text-brand",
											"aria-hidden": true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: feature
										})]
									}, feature))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/rdv",
									className: `mt-7 flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${pack.popular ? "bg-primary text-white hover:bg-brand-strong" : "bg-secondary text-foreground hover:bg-muted"}`,
									children: "Choisir ce pack"
								})
							]
						}, pack.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative mt-24 bg-ink px-8 py-14 text-ink-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "relative text-center font-display text-3xl font-extrabold uppercase tracking-tight",
								children: "Nos garanties"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "section-bar",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative mt-10 grid gap-8 md:grid-cols-3",
								children: GARANTIES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex size-14 items-center justify-center rounded-2xl bg-white/10 text-gold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(g.icon, {
												className: "size-7",
												"aria-hidden": true
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-4 font-display text-xl font-semibold",
											children: g.titre
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-ink-muted",
											children: g.texte
										})
									]
								}, g.titre))
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
export { ServicesPage as component };
