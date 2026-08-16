import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as BookOpen, i as Users, j as Library, z as FileText } from "../_libs/lucide-react.mjs";
import { f as getAdminStats } from "./admin.functions-D3nCuUqe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CcptqZ1y.js
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["admin-stats"],
		queryFn: () => getAdminStats()
	});
	const cards = [
		{
			label: "Ebooks",
			value: data?.ebooks ?? "—",
			icon: BookOpen,
			to: "/admin/ebooks"
		},
		{
			label: "Chapitres",
			value: data?.chapters ?? "—",
			icon: FileText,
			to: "/admin/chapitres"
		},
		{
			label: "Lecteurs",
			value: data?.lecteurs ?? "—",
			icon: Users,
			to: "/admin/lecteurs"
		},
		{
			label: "Livres en bibliothèque",
			value: data?.bibliotheque ?? "—",
			icon: Library,
			to: "/admin/lecteurs"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-extrabold uppercase tracking-tight",
				children: "Tableau de bord"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Gérez le catalogue, les chapitres et les accès lecteurs."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-4 mb-8 block h-0.5 w-14 bg-primary",
				"aria-hidden": true
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive",
				children: [
					error instanceof Error ? error.message : "Impossible de charger les statistiques.",
					" ",
					"Exécutez ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "supabase-admin-tanstack.sql" }),
					" si les politiques RLS manquent."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: card.to,
					className: "premium-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, {
							className: "size-6 text-primary",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-display text-3xl font-extrabold",
							children: isLoading ? "…" : card.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground",
							children: card.label
						})
					]
				}, card.label))
			})
		]
	});
}
//#endregion
export { AdminHome as component };
