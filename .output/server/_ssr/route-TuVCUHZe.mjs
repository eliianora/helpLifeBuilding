import { t as supabase } from "./client-DqaBVmPg.mjs";
import { d as Outlet, g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as SiteLogo } from "./site-logo-DVSES6xW.mjs";
import { t as Button } from "./button-CWkTyF61.mjs";
import { $ as BookOpen, D as LogOut, H as Code, N as LayoutDashboard, P as Layers, Q as BookText, R as FolderOpen, V as CreditCard, X as Calendar, Z as Briefcase, f as ShoppingCart, i as Users, l as Tag, w as Megaphone, z as FileText } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-TuVCUHZe.js
var import_jsx_runtime = require_jsx_runtime();
var MENU = [
	{
		label: "Tableau de bord",
		to: "/admin",
		icon: LayoutDashboard,
		exact: true
	},
	{
		label: "Ebooks",
		to: "/admin/ebooks",
		icon: BookOpen,
		exact: false
	},
	{
		label: "Chapitres",
		to: "/admin/chapitres",
		icon: FileText,
		exact: false
	},
	{
		label: "Lecteurs",
		to: "/admin/lecteurs",
		icon: Users,
		exact: false
	},
	{
		label: "Auteurs",
		to: "/admin/auteurs",
		icon: BookText,
		exact: false
	},
	{
		label: "Catégories Ebooks",
		to: "/admin/categories_e",
		icon: Tag,
		exact: false
	},
	{
		label: "Services",
		to: "/admin/services",
		icon: Briefcase,
		exact: false
	},
	{
		label: "Projets",
		to: "/admin/projets",
		icon: FolderOpen,
		exact: false
	},
	{
		label: "Catégories Projet",
		to: "/admin/categories_p",
		icon: Layers,
		exact: false
	},
	{
		label: "Langages",
		to: "/admin/langages",
		icon: Code,
		exact: false
	},
	{
		label: "Bande Info",
		to: "/admin/bande_inf",
		icon: Megaphone,
		exact: false
	},
	{
		label: "Paiements",
		to: "/admin/paiements",
		icon: CreditCard,
		exact: false
	},
	{
		label: "Paniers",
		to: "/admin/paniers",
		icon: ShoppingCart,
		exact: false
	},
	{
		label: "Rendez-vous",
		to: "/admin/rdv",
		icon: Calendar,
		exact: false
	}
];
function AdminLayout() {
	const navigate = useNavigate();
	async function handleSignOut() {
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-ink text-ink-foreground md:sticky md:top-0 md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-white/10 bg-white px-4 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, { height: 36 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 pt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary",
					children: "Administration"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-3 flex-1 space-y-1 px-3",
					children: MENU.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						activeOptions: { exact: item.exact },
						activeProps: { className: "bg-primary text-white" },
						inactiveProps: { className: "text-ink-muted hover:bg-white/10 hover:text-white" },
						className: "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold uppercase tracking-wide",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
							className: "size-4",
							"aria-hidden": true
						}), item.label]
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-white/10 p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleSignOut,
						className: "flex w-full items-center gap-3 px-3 py-2.5 text-sm text-ink-muted hover:bg-white/10 hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
							className: "size-4",
							"aria-hidden": true
						}), "Déconnexion"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-border bg-white px-4 py-3 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, { height: 32 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: handleSignOut,
						children: "Sortir"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-2 overflow-x-auto border-b border-border bg-white px-4 py-2 md:hidden",
					children: MENU.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						activeOptions: { exact: item.exact },
						activeProps: { className: "bg-primary text-white" },
						inactiveProps: { className: "bg-secondary text-foreground" },
						className: "shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-5 md:p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})
			]
		})]
	});
}
//#endregion
export { AdminLayout as component };
