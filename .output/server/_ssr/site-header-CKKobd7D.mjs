import { r as __toESM } from "../_runtime.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as supabase } from "./client-DqaBVmPg.mjs";
import { t as fetchUserRole } from "./admin-Bv8g1X24.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as SiteLogo } from "./site-logo-DVSES6xW.mjs";
import { n as cn, t as Button } from "./button-CWkTyF61.mjs";
import { o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { $ as BookOpen, C as Menu, J as ChevronDown, K as ChevronRight, L as Heart, M as LibraryBig, N as LayoutDashboard, O as LogIn, U as Clock, W as Circle, Y as Check, k as Lock, r as X, u as Star, x as PartyPopper, y as Phone } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-header-CKKobd7D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useSession() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
			setSession(next);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		user: session?.user ?? null,
		loading
	};
}
function useAdmin() {
	const { user, loading: sessionLoading } = useSession();
	const [role, setRole] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		if (sessionLoading) return;
		if (!user) {
			setRole(null);
			setLoading(false);
			return;
		}
		setLoading(true);
		fetchUserRole(user.id).then((next) => {
			if (cancelled) return;
			setRole(next);
			setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [user, sessionLoading]);
	return {
		isAdmin: role === "admin",
		role,
		loading: sessionLoading || loading,
		user
	};
}
var BRAND = {
	name: "Help Life Building",
	kicker: "Your life coaching",
	promise: "Coaching de vie, ebooks et ateliers pour le bien-être mental, l'éducation parentale, la résilience et le leadership personnel.",
	email: "coachprisca@gmail.com",
	phone: "+225 07 15 93 93 21",
	city: "Abidjan, Côte d'Ivoire"
};
var MARQUEE_ITEMS = [
	{
		icon: PartyPopper,
		text: "Nouveau — ebooks, coaching parental et ateliers bien-être en ligne",
		to: "/ebooks"
	},
	{
		icon: Heart,
		text: "16 années d'innovation sociale et d'apprentissage socio-émotionnel en Afrique",
		to: "/a-propos"
	},
	{
		icon: BookOpen,
		text: "Chaque livre s'ouvre sur un extrait gratuit, sans compte",
		to: "/ebooks"
	},
	{
		icon: Lock,
		text: "Lecture 100 % en ligne — aucun fichier à télécharger",
		to: "/ebooks"
	},
	{
		icon: Star,
		text: "Entreprises, familles, femmes et adolescents : un accompagnement sur mesure",
		to: "/services"
	}
];
var STATS = [
	{
		icon: Heart,
		value: "16 ans",
		label: "D'expérience en Afrique"
	},
	{
		icon: BookOpen,
		value: "3",
		label: "Ebooks disponibles"
	},
	{
		icon: Star,
		value: "4",
		label: "Publics accompagnés"
	},
	{
		icon: Clock,
		value: "24/7",
		label: "Accès à votre bibliothèque"
	}
];
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var MAIN_NAV = [
	{
		label: "Accueil",
		to: "/"
	},
	{
		label: "Ebooks",
		to: "/ebooks"
	},
	{
		label: "Services",
		to: "/services"
	},
	{
		label: "Rendez-vous",
		to: "/rdv"
	}
];
var MORE_NAV = [
	{
		label: "Fondatrice",
		to: "/a-propos"
	},
	{
		label: "Portfolio",
		to: "/portfolio"
	},
	{
		label: "Communauté",
		to: "/communaute"
	}
];
var NAV = [...MAIN_NAV, ...MORE_NAV];
function SiteHeader() {
	const { user, loading } = useSession();
	const { isAdmin } = useAdmin();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	async function handleSignOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-4 px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, { height: 46 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 text-[13px] font-bold uppercase tracking-[0.08em] lg:flex",
					children: [MAIN_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						activeOptions: { exact: item.to === "/" },
						activeProps: { className: "text-primary" },
						inactiveProps: { className: "text-foreground hover:text-primary" },
						className: "px-3 py-2 transition-colors",
						children: item.label
					}, item.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
						className: "flex items-center gap-1 px-3 py-2 text-foreground transition-colors hover:text-primary",
						children: ["Plus", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
							className: "size-3.5",
							"aria-hidden": true
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
						align: "end",
						className: "w-48 rounded-sm",
						children: MORE_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								className: "text-sm font-semibold uppercase tracking-wide",
								children: item.label
							})
						}, item.label))
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${BRAND.phone.replace(/\s/g, "")}`,
							className: "hidden items-center gap-2 text-sm font-bold text-primary xl:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								className: "size-4",
								"aria-hidden": true
							}), BRAND.phone]
						}),
						loading ? null : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "hidden sm:inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/admin",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, {
										className: "size-4",
										"aria-hidden": true
									}), "Admin"]
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "hidden sm:inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/bibliotheque",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryBig, {
										className: "size-4",
										"aria-hidden": true
									}), "Bibliothèque"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: handleSignOut,
								children: "Déconnexion"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auth",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, {
									className: "size-4",
									"aria-hidden": true
								}), "Connexion"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-10 items-center justify-center text-foreground lg:hidden",
							onClick: () => setOpen((v) => !v),
							"aria-label": open ? "Fermer le menu" : "Ouvrir le menu",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "border-t border-border bg-white px-5 py-4 lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1 text-sm font-bold uppercase tracking-[0.08em]",
				children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					activeOptions: { exact: item.to === "/" },
					activeProps: { className: "text-primary" },
					inactiveProps: { className: "text-foreground" },
					className: "py-2.5",
					children: item.label
				}, item.label)), isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					onClick: () => setOpen(false),
					className: "py-2.5 text-primary",
					children: "Admin"
				}) : null]
			})
		}) : null]
	});
}
//#endregion
export { useSession as a, SiteHeader as i, MARQUEE_ITEMS as n, STATS as r, BRAND as t };
