import { r as __toESM } from "../_runtime.mjs";
import { t as FOUNDER } from "./covers-C3ZiEN96.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CWkTyF61.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as BookOpen, G as CircleCheckBig, I as Highlighter, L as Heart, Z as Briefcase, _ as Quote, b as Pause, et as BookLock, i as Users, nt as ArrowRight, v as Play } from "../_libs/lucide-react.mjs";
import { i as SiteHeader, n as MARQUEE_ITEMS, r as STATS, t as BRAND } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as founder_default } from "./founder-BSeFcUPd.mjs";
import { l as SERVICES } from "./site-content-Cpl4DOVi.mjs";
import { t as EbookCard } from "./ebook-card-BEDteOYv.mjs";
import { t as ebooksQuery } from "./routes-CRNMPnCo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CW9CcQcw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarqueeBar() {
	const [paused, setPaused] = (0, import_react.useState)(false);
	const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden bg-ink text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-marquee flex w-max whitespace-nowrap py-2.5",
			style: { animationPlayState: paused ? "paused" : "running" },
			children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				className: "mx-8 inline-flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-primary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
						className: "size-4 text-primary",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.text }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "•"
					})
				]
			}, `${item.text}-${i}`))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setPaused((p) => !p),
			"aria-label": paused ? "Reprendre le défilement" : "Mettre en pause le défilement",
			className: "absolute right-3 top-1/2 -translate-y-1/2 rounded-sm bg-white/10 p-1.5 text-white/80 transition-colors hover:text-white",
			children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
				className: "size-3.5",
				"aria-hidden": true
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
				className: "size-3.5",
				"aria-hidden": true
			})
		})]
	});
}
var EXPERTISES = [
	{
		icon: BookOpen,
		title: "Ebooks",
		items: [
			"Extraits gratuits",
			"Lecture 100 % en ligne",
			"Progression enregistrée",
			"Bibliothèque personnelle"
		]
	},
	{
		icon: Heart,
		title: "Coaching parental",
		items: [
			"Éducation parentale",
			"Bien-être mental",
			"Résilience émotionnelle",
			"Leadership personnel"
		]
	},
	{
		icon: Users,
		title: "Ateliers collectifs",
		items: [
			"Familles",
			"Femmes",
			"Adolescents",
			"Compétences de vie"
		]
	},
	{
		icon: Briefcase,
		title: "Entreprises",
		items: [
			"Innovation sociale",
			"Dispositifs d'impact",
			"Conférences",
			"Formations"
		]
	}
];
function Index() {
	const { data: ebooks } = useSuspenseQuery(ebooksQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarqueeBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "relative overflow-hidden bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hero-eyebrow",
								children: "Your life coaching · Abidjan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-6xl",
								children: [
									"Coaching de vie",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"pour ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "construire votre autonomie"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg",
								children: [BRAND.promise, " Extrait gratuit sur chaque livre, coaching et ateliers sur mesure."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "cta",
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/ebooks",
										children: ["Explorer les ebooks", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
											className: "size-4",
											"aria-hidden": true
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/services",
										children: "Découvrir nos services"
									})
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: founder_default,
								alt: `Portrait de ${FOUNDER.name}, fondatrice de ${BRAND.name}`,
								width: 1024,
								height: 1280,
								className: "aspect-4/5 w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute -bottom-4 -left-4 hidden bg-primary px-6 py-4 text-white md:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl font-extrabold",
									children: "16 ans"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold uppercase tracking-[0.16em]",
									children: "D'expérience en Afrique"
								})]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl",
										children: "Quelques réalisations"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mx-auto mt-3 max-w-xl text-muted-foreground",
										children: "Découvrez quelques-uns de nos ebooks — chaque fiche s'ouvre sur un premier chapitre offert."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "section-bar",
										"aria-hidden": true
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
								children: ebooks.slice(0, 3).map((ebook) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EbookCard, {
									slug: ebook.slug,
									title: ebook.title,
									subtitle: ebook.subtitle,
									category: ebook.category,
									priceLabel: ebook.price_label,
									coverKey: ebook.cover_key
								}, ebook.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-12 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/ebooks",
										children: "Plus de réalisations"
									})
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-secondary py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-6xl px-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid items-center gap-10 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl",
									children: [
										"Votre coaching de vie",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"en Côte d'Ivoire"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-4 mb-6 block h-0.5 w-14 bg-primary",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed text-muted-foreground",
									children: "Help Life Building vous accompagne de A à Z : ebooks, coaching parental, bien-être mental et émotionnel, ateliers pour les familles, les femmes et les adolescents, et formations pour les entreprises."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 leading-relaxed text-muted-foreground",
									children: "Un accompagnement ancré dans l'innovation sociale et la participation communautaire, comme levier d'autonomie, de résilience et de développement durable."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 text-sm font-bold uppercase tracking-[0.12em] text-primary",
									children: "Vous avez un projet ?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "mt-4",
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/services",
										children: "Découvrir nos services"
									})
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-px bg-border sm:grid-cols-2",
								children: EXPERTISES.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(block.icon, {
											className: "size-7 text-primary",
											"aria-hidden": true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-4 text-sm font-extrabold uppercase tracking-[0.1em]",
											children: block.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-3 space-y-1.5 text-sm text-muted-foreground",
											children: block.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
										})
									]
								}, block.title))
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-ink py-20 text-ink-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl",
								children: "Pourquoi nous choisir ?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "section-bar",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-6 max-w-2xl text-ink-muted",
								children: "16 années à concevoir et évaluer des programmes d'apprentissage socio-émotionnels en Afrique — et une capacité reconnue à fédérer les acteurs et structurer des dispositifs d'impact."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-12 grid gap-8 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureDark, {
										icon: BookLock,
										title: "Lecture en ligne",
										children: "Aucun fichier à télécharger : le texte reste sur le site, dans votre espace lecteur."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureDark, {
										icon: Highlighter,
										title: "Progression suivie",
										children: "Votre place est enregistrée automatiquement, d'un appareil à l'autre."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureDark, {
										icon: CircleCheckBig,
										title: "Extrait gratuit",
										children: "Le premier chapitre de chaque livre est lisible immédiatement, sans compte."
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-6xl px-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid items-center gap-12 md:grid-cols-[280px_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center md:text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-7xl font-extrabold leading-none text-primary md:text-8xl",
										children: "16"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm font-bold uppercase tracking-[0.16em]",
										children: "années d'expérience"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-muted-foreground",
										children: "Innovation sociale, recherche et développement — en Afrique, sur le terrain."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-y-8 border-y border-border py-8 sm:grid-cols-4 sm:divide-x sm:divide-border",
								children: STATS.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2 text-center sm:px-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-3xl font-extrabold text-foreground md:text-4xl",
										children: stat.value
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground",
										children: stat.label
									})]
								}, stat.label))
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-t border-border py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[320px_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: founder_default,
							alt: `Portrait de ${FOUNDER.name}`,
							width: 1024,
							height: 1280,
							className: "aspect-4/5 w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "section-eyebrow",
								children: ["Fondatrice de ", BRAND.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-3 font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl",
								children: ["Bonjour, je suis ", FOUNDER.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-4 mb-6 block h-0.5 w-14 bg-primary",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-2xl leading-relaxed text-muted-foreground",
								children: FOUNDER.bio
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex max-w-2xl items-start gap-3 border-l-2 border-primary pl-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, {
									className: "mt-0.5 size-5 shrink-0 text-primary",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "italic text-foreground/80",
									children: [
										"« ",
										FOUNDER.tagline,
										" »"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "mt-8",
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/a-propos",
									children: ["Découvrir son histoire", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
										className: "size-4",
										"aria-hidden": true
									})]
								})
							})
						] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-secondary py-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-extrabold uppercase tracking-tight",
								children: "Ils nous font confiance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "section-bar",
								"aria-hidden": true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid gap-6 sm:grid-cols-3",
							children: SERVICES.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/services",
								className: "group border border-border bg-white p-8 text-center transition-colors hover:border-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(service.icon, {
										className: "mx-auto size-8 text-primary",
										"aria-hidden": true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 font-display text-lg font-bold uppercase tracking-tight",
										children: service.titre
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: service.description
									})
								]
							}, service.id))
						})]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function FeatureDark({ icon: Icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "mx-auto size-8 text-primary",
			"aria-hidden": true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-4 font-display text-lg font-bold uppercase tracking-tight",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-ink-muted",
			children
		})
	] });
}
//#endregion
export { Index as component };
