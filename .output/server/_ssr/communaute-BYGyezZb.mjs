import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { L as Heart, S as MessageCircle, X as Calendar, g as Send, s as Trophy } from "../_libs/lucide-react.mjs";
import { a as useSession, i as SiteHeader } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as PageBanner } from "./page-banner-kacNVSs9.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as COMMUNITY_POSTS, r as COMMUNITY_STATS, t as COMMUNITY_EVENTS, u as TOP_MEMBERS } from "./site-content-Cpl4DOVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/communaute-BYGyezZb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommunautePage() {
	const { user } = useSession();
	const [draft, setDraft] = (0, import_react.useState)("");
	const [liked, setLiked] = (0, import_react.useState)({});
	function publish() {
		if (!draft.trim()) return;
		setDraft("");
		toast.success("Merci ! Votre message est en attente de validation.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBanner, {
				kicker: "Ensemble",
				title: "Notre communauté",
				subtitle: "Échangez, apprenez et avancez ensemble, entre lectrices et lecteurs de la maison."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-5 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
					children: COMMUNITY_STATS.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-panel p-5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-primary inline-flex size-11 items-center justify-center rounded-2xl text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(stat.icon, {
									className: "size-5",
									"aria-hidden": true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-2xl font-semibold",
								children: stat.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: stat.label
							})
						]
					}, stat.label))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 grid gap-8 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "premium-card p-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-2xl",
									"aria-hidden": true,
									children: user ? "🙂" : "👤"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: draft,
										onChange: (event) => setDraft(event.target.value),
										rows: 3,
										placeholder: "Partagez une lecture, une question, une victoire…",
										className: "w-full resize-none rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand/40"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: user ? "Vous publiez sous votre compte." : "Connectez-vous pour publier sous votre nom."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: publish,
											disabled: !draft.trim(),
											className: "bg-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
												className: "size-4",
												"aria-hidden": true
											}), "Publier"]
										})]
									})]
								})]
							})
						}), COMMUNITY_POSTS.map((post) => {
							const isLiked = liked[post.id];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "premium-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-12 items-center justify-center rounded-full bg-secondary text-2xl",
											"aria-hidden": true,
											children: post.avatar
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: post.auteur
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												post.role,
												" • ",
												post.date
											]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 leading-relaxed text-muted-foreground",
										children: post.contenu
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex items-center gap-5 border-t border-border/60 pt-4 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setLiked((prev) => ({
												...prev,
												[post.id]: !prev[post.id]
											})),
											className: `inline-flex items-center gap-2 font-semibold transition-colors ${isLiked ? "text-brand-strong" : "text-muted-foreground hover:text-brand-strong"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
												className: `size-4 ${isLiked ? "fill-current" : ""}`,
												"aria-hidden": true
											}), post.likes + (isLiked ? 1 : 0)]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-2 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
													className: "size-4",
													"aria-hidden": true
												}),
												post.commentaires,
												" commentaires"
											]
										})]
									})
								]
							}, post.id);
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "premium-card p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "flex items-center gap-2 font-display text-lg font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
										className: "size-4 text-brand",
										"aria-hidden": true
									}), "Prochains rendez-vous"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-4 space-y-4",
									children: COMMUNITY_EVENTS.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded-2xl bg-secondary/70 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: event.titre
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs text-muted-foreground",
											children: [
												event.date,
												" • ",
												event.participants,
												" inscrits"
											]
										})]
									}, event.titre))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/rdv",
									className: "bg-primary mt-5 flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md",
									children: "Réserver ma place"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "premium-card p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "flex items-center gap-2 font-display text-lg font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
									className: "size-4 text-gold",
									"aria-hidden": true
								}), "Membres les plus actifs"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-3",
								children: TOP_MEMBERS.map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-5 text-sm font-bold text-muted-foreground",
											children: index + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-9 items-center justify-center rounded-full bg-secondary text-lg",
											"aria-hidden": true,
											children: member.avatar
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 text-sm font-medium",
											children: member.nom
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-semibold text-brand-strong",
											children: [member.points, " pts"]
										})
									]
								}, member.nom))
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { CommunautePage as component };
