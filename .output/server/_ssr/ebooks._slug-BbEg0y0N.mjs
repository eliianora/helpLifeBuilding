import { r as __toESM } from "../_runtime.mjs";
import { n as coverFor, t as FOUNDER } from "./covers-C3ZiEN96.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CWkTyF61.mjs";
import { i as useQuery, n as queryOptions, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as BookOpen, I as Highlighter, U as Clock, Y as Check, c as TrendingUp, d as Sparkles, et as BookLock, h as Share2, j as Library, k as Lock, m as ShieldCheck, rt as ArrowLeft, z as FileText } from "../_libs/lucide-react.mjs";
import { a as useSession, i as SiteHeader, t as BRAND } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as PageBanner } from "./page-banner-kacNVSs9.mjs";
import { n as getEbookAccessStatus, o as useServerFn, t as Progress } from "./progress-bPK1miZt.mjs";
import { n as bookQuery, t as Route } from "./ebooks._slug-rFUtL_kQ.mjs";
import { t as EbookCard } from "./ebook-card-BEDteOYv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ebooks._slug-BbEg0y0N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var accessQuery = (slug) => queryOptions({
	queryKey: ["ebook-access", slug],
	queryFn: () => getEbookAccessStatus({ data: { slug } })
});
function EbookDetail() {
	const { slug } = Route.useParams();
	const { data } = useSuspenseQuery(bookQuery(slug));
	const { user, loading: sessionLoading } = useSession();
	const fetchAccess = useServerFn(getEbookAccessStatus);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const { data: access, isLoading: accessLoading } = useQuery({
		...accessQuery(slug),
		queryFn: () => fetchAccess({ data: { slug } }),
		enabled: !!user
	});
	async function handleShare() {
		const url = window.location.href;
		try {
			if (navigator.share) await navigator.share({
				title: data?.ebook.title,
				url
			});
			else {
				await navigator.clipboard.writeText(url);
				setCopied(true);
				setTimeout(() => setCopied(false), 2e3);
			}
		} catch {}
	}
	if (!data) return null;
	const { ebook, toc, sample, related } = data;
	const previewCount = toc.filter((c) => c.is_preview).length;
	const lockedCount = toc.filter((c) => !c.is_preview).length;
	const hasAccess = access?.hasAccess ?? false;
	const progress = access?.progress ?? null;
	const readingHours = ebook.reading_minutes >= 60 ? `~${Math.round(ebook.reading_minutes / 60)} h` : `~${ebook.reading_minutes} min`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBanner, {
				kicker: ebook.category ?? "Ebook",
				title: ebook.title,
				subtitle: ebook.subtitle ?? void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-5 py-10 md:py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/ebooks",
						className: "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
							className: "size-4",
							"aria-hidden": true
						}), "Retour au catalogue"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-10 md:grid-cols-[0.65fr_1.35fr] md:items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: coverFor(ebook.cover_key),
								alt: `Couverture du livre ${ebook.title}`,
								width: 800,
								height: 1200,
								className: "aspect-2/3 w-full object-cover"
							}), previewCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm backdrop-blur",
								children: "Extrait gratuit"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [ebook.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground",
									children: ebook.category
								}) : null, previewCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
											className: "size-4 text-brand-strong",
											"aria-hidden": true
										}),
										previewCount,
										" chapitre",
										previewCount > 1 ? "s" : "",
										" offert",
										previewCount > 1 ? "s" : ""
									]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-[2.5rem]",
								children: ebook.title
							}),
							ebook.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-lg text-muted-foreground",
								children: ebook.subtitle
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-sm text-muted-foreground",
								children: [
									"Par",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/a-propos",
										className: "font-medium text-foreground underline-offset-4 hover:underline",
										children: FOUNDER.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2 text-border",
										children: "·"
									}),
									FOUNDER.role
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
												className: "size-4",
												"aria-hidden": true
											}),
											" ",
											ebook.pages,
											" pages"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												className: "size-4",
												"aria-hidden": true
											}),
											" ",
											readingHours,
											" de lecture"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookLock, {
											className: "size-4",
											"aria-hidden": true
										}), " Lecture en ligne"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 leading-relaxed text-muted-foreground",
								children: ebook.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PurchasePanel, {
								slug,
								priceLabel: ebook.price_label,
								sessionLoading,
								accessLoading: !!user && accessLoading,
								user,
								hasAccess,
								progress
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
											className: "size-4 text-brand-strong",
											"aria-hidden": true
										}), "Accès permanent"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
											className: "size-4 text-brand-strong",
											"aria-hidden": true
										}), "Progression synchronisée"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleShare,
										className: "inline-flex items-center gap-2 transition-colors hover:text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
											className: "size-4",
											"aria-hidden": true
										}), copied ? "Lien copié !" : "Partager"]
									})
								]
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14 rounded-xl border border-border/70 bg-secondary/30 p-6 md:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl tracking-tight",
							children: "Ce que vous obtenez"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								{
									icon: BookOpen,
									title: "Lecture intégrale",
									text: `${toc.length} chapitre${toc.length > 1 ? "s" : ""} à lire dans le lecteur en ligne.`
								},
								{
									icon: Highlighter,
									title: "Extrait avant achat",
									text: "Lisez les chapitres gratuits sans créer de compte."
								},
								{
									icon: Library,
									title: "Bibliothèque personnelle",
									text: "Retrouvez tous vos livres et reprenez où vous vous êtes arrêtée."
								},
								{
									icon: ShieldCheck,
									title: "Sans téléchargement",
									text: "Le contenu reste sur le site — aucun fichier à copier ou partager."
								}
							].map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4 text-brand-strong",
										"aria-hidden": true
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-sm text-muted-foreground",
									children: text
								})] })]
							}, title))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-16 grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							id: "extrait",
							className: "scroll-mt-24",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										className: "size-5 text-brand-strong",
										"aria-hidden": true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-2xl tracking-tight",
										children: "Extrait gratuit"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: sample.length === 0 ? "L'aperçu de ce livre sera bientôt disponible." : previewCount === 1 ? "Le premier chapitre, en intégralité, sans compte." : `${previewCount} chapitres en intégralité, sans compte.`
								}),
								sample.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground",
									children: "Revenez bientôt pour découvrir un extrait de ce titre."
								}) : sample.map((chapter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "mt-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-display text-xl",
										children: [
											chapter.position,
											". ",
											chapter.title
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "prose-reader mt-4 space-y-5 text-foreground/90",
										onContextMenu: (e) => e.preventDefault(),
										children: chapter.content.split("\n\n").map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, index))
									})]
								}, chapter.position)),
								lockedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaywallCta, {
									slug,
									lockedCount,
									priceLabel: ebook.price_label,
									sessionLoading,
									user,
									hasAccess
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "lg:sticky lg:top-24 lg:self-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/70 bg-card p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg",
										children: "Sommaire"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											previewCount,
											" gratuit",
											previewCount > 1 ? "s" : "",
											" · ",
											lockedCount,
											" réservé",
											lockedCount > 1 ? "s" : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
										className: "mt-4 space-y-3 text-sm",
										children: toc.map((chapter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [chapter.is_preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												className: "mt-0.5 size-4 shrink-0 text-brand-strong",
												"aria-hidden": true
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
												className: "mt-0.5 size-4 shrink-0 text-muted-foreground",
												"aria-hidden": true
											}), chapter.is_preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: "#extrait",
												className: "transition-colors hover:text-brand-strong",
												children: [chapter.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-1.5 text-xs uppercase tracking-wide text-brand-strong",
													children: "gratuit"
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: chapter.title
											})]
										}, chapter.position))
									})
								]
							})
						})]
					}),
					related.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-20 border-t border-border/60 pt-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
								className: "size-5 text-brand-strong",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl tracking-tight",
								children: "Vous aimerez aussi"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
							children: related.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EbookCard, {
								slug: item.slug,
								title: item.title,
								subtitle: item.subtitle,
								category: item.category,
								priceLabel: item.price_label,
								coverKey: item.cover_key
							}, item.slug))
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function PurchasePanel({ slug, priceLabel, sessionLoading, accessLoading, user, hasAccess, progress }) {
	const showSkeleton = sessionLoading || accessLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8 rounded-xl border border-border/70 bg-secondary/40 p-5 md:p-6",
		children: hasAccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "inline-flex items-center gap-2 text-sm font-medium text-brand-strong",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-4",
					"aria-hidden": true
				}), "Ce livre est dans votre bibliothèque"]
			}),
			progress && progress.percent > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Votre progression" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [progress.percent, "%"] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: progress.percent,
						className: "mt-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1.5 text-xs text-muted-foreground",
						children: [
							"Chapitre ",
							progress.chapter_position,
							" — reprise automatique"
						]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "cta",
					size: "lg",
					className: "cta-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/lecture/$slug",
						params: { slug },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
							className: "size-4",
							"aria-hidden": true
						}), progress && progress.percent > 0 ? "Continuer la lecture" : "Commencer la lecture"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bibliotheque",
						children: "Ma bibliothèque"
					})
				})]
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: priceLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Accès permanent au lecteur en ligne, sans fichier téléchargeable."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground",
				children: [
					"Paiement sécurisé bientôt disponible. Pour obtenir l’accès maintenant, contactez",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "font-semibold text-primary underline",
						href: `mailto:${BRAND.email}`,
						children: BRAND.email
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-3",
				children: [showSkeleton ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 w-48 animate-pulse rounded-md bg-muted" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "cta",
					size: "lg",
					className: "cta-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `mailto:${BRAND.email}?subject=${encodeURIComponent(`Accès ebook — ${slug}`)}`,
						children: "Demander l’accès"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "cta",
					size: "lg",
					className: "cta-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { redirect: `/ebooks/${slug}` },
						children: "Créer un compte pour lire"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { redirect: `/ebooks/${slug}` },
						children: "Se connecter"
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#extrait",
						children: "Lire l'extrait gratuit"
					})
				})]
			}),
			!user && !showSkeleton ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Pas encore convaincu(e) ? Lisez l'extrait ci-dessous, sans inscription."
			}) : null
		] })
	});
}
function PaywallCta({ slug, lockedCount, priceLabel, sessionLoading, user, hasAccess }) {
	if (hasAccess) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 rounded-xl border border-dashed border-border p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
				className: "mx-auto size-5 text-brand-strong",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-xl",
				children: "La suite vous attend dans le lecteur"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "cta",
				className: "cta-glow mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lecture/$slug",
					params: { slug },
					children: "Ouvrir le livre complet"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 rounded-xl border border-dashed border-border bg-gradient-to-b from-transparent to-secondary/30 p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
				className: "mx-auto size-5 text-muted-foreground",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-display text-xl",
				children: [
					lockedCount,
					" chapitre",
					lockedCount > 1 ? "s" : "",
					" de plus vous attend",
					lockedCount > 1 ? "ent" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"L’accès complet s’ouvre après paiement vérifié ou attribution par un administrateur (",
					priceLabel,
					")."
				]
			}),
			sessionLoading ? null : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "cta",
				className: "cta-glow mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `mailto:${BRAND.email}?subject=${encodeURIComponent(`Accès ebook — ${slug}`)}`,
					children: ["Demander l’accès — ", priceLabel]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "cta",
				className: "cta-glow mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					search: { redirect: `/ebooks/${slug}` },
					children: "Se connecter pour continuer"
				})
			})
		]
	});
}
//#endregion
export { EbookDetail as component };
