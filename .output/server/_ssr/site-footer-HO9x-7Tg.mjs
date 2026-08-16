import { t as FOUNDER } from "./covers-C3ZiEN96.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as SiteLogo } from "./site-logo-DVSES6xW.mjs";
import { A as Linkedin, B as Facebook, E as Mail, F as Instagram, T as MapPin, n as Youtube, y as Phone } from "../_libs/lucide-react.mjs";
import { t as BRAND } from "./site-header-CKKobd7D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-footer-HO9x-7Tg.js
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		title: "Lecture",
		links: [{
			label: "Tous les ebooks",
			to: "/ebooks"
		}, {
			label: "Ma bibliothèque",
			to: "/bibliotheque"
		}]
	},
	{
		title: "La maison",
		links: [
			{
				label: "La fondatrice",
				to: "/a-propos"
			},
			{
				label: "Services",
				to: "/services"
			},
			{
				label: "Portfolio",
				to: "/portfolio"
			},
			{
				label: "Créer un compte",
				to: "/auth"
			}
		]
	},
	{
		title: "Échanger",
		links: [{
			label: "Prendre rendez-vous",
			to: "/rdv"
		}, {
			label: "Communauté",
			to: "/communaute"
		}]
	}
];
var SOCIALS = [
	Facebook,
	Instagram,
	Linkedin,
	Youtube
];
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-0 bg-ink text-ink-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-white/10 bg-primary py-10 text-center text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl font-extrabold uppercase tracking-tight md:text-3xl",
					children: "Parlons de vos projets"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-xl text-sm text-white/85",
					children: "Coaching parental, bien-être mental, ateliers et ebooks à Abidjan — un premier échange pour clarifier ce dont vous avez besoin."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/rdv",
					className: "mt-6 inline-flex bg-ink px-8 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-black",
					children: "Nous contacter"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-sm bg-white px-3 py-2 inline-flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, { height: 40 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-sm text-sm leading-relaxed text-ink-muted",
						children: BRAND.promise
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3 text-sm text-ink-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `mailto:${BRAND.email}`,
								className: "flex items-center gap-3 transition-colors hover:text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
									className: "size-4 text-primary",
									"aria-hidden": true
								}), BRAND.email]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${BRAND.phone.replace(/\s/g, "")}`,
								className: "flex items-center gap-3 transition-colors hover:text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
									className: "size-4 text-primary",
									"aria-hidden": true
								}), BRAND.phone]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									className: "size-4 text-primary",
									"aria-hidden": true
								}), BRAND.city]
							})
						]
					})
				] }), COLUMNS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-extrabold uppercase tracking-[0.12em]",
						children: column.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-3 mb-4 block h-0.5 w-8 bg-primary",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2.5 text-sm",
						children: column.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: "text-ink-muted transition-colors hover:text-primary",
							children: link.label
						}) }, link.label))
					})
				] }, column.title))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-ink-muted md:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					BRAND.name,
					" — textes de ",
					FOUNDER.name,
					"."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: SOCIALS.map((Icon, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 items-center justify-center rounded-sm bg-white/10 transition-colors hover:bg-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-4",
							"aria-hidden": true
						})
					}, i))
				})]
			})]
		})]
	});
}
//#endregion
export { SiteFooter as t };
