import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CWkTyF61.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as adminListEbooks, o as adminListReaders, r as adminGrantEbookAccess, s as adminRevokeEbookAccess, u as adminSetRole } from "./admin.functions-D3nCuUqe.mjs";
import { t as Label } from "./label-DWmshiB9.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lecteurs-CPaxuj_v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminReaders() {
	const queryClient = useQueryClient();
	const [grantUserId, setGrantUserId] = (0, import_react.useState)("");
	const [grantEbookId, setGrantEbookId] = (0, import_react.useState)("");
	const { data = [], isLoading, error } = useQuery({
		queryKey: ["admin-readers"],
		queryFn: () => adminListReaders()
	});
	const { data: ebooks = [] } = useQuery({
		queryKey: ["admin-ebooks"],
		queryFn: () => adminListEbooks()
	});
	const setRole = useMutation({
		mutationFn: (payload) => adminSetRole({ data: payload }),
		onSuccess: () => {
			toast.success("Rôle mis à jour.");
			queryClient.invalidateQueries({ queryKey: ["admin-readers"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const grant = useMutation({
		mutationFn: () => adminGrantEbookAccess({ data: {
			userId: grantUserId,
			ebookId: grantEbookId
		} }),
		onSuccess: () => {
			toast.success("Accès ebook accordé.");
			setGrantEbookId("");
			queryClient.invalidateQueries({ queryKey: ["admin-readers"] });
			queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const revoke = useMutation({
		mutationFn: () => adminRevokeEbookAccess({ data: {
			userId: grantUserId,
			ebookId: grantEbookId
		} }),
		onSuccess: () => {
			toast.success("Accès ebook retiré.");
			queryClient.invalidateQueries({ queryKey: ["admin-readers"] });
			queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-extrabold uppercase tracking-tight",
				children: "Lecteurs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Rôles, et attribution manuelle d’accès aux ebooks (paiement vérifié ou admin)."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-4 mb-8 block h-0.5 w-14 bg-primary",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "premium-card mb-8 grid gap-4 p-5 md:grid-cols-3",
				onSubmit: (event) => {
					event.preventDefault();
					if (!grantUserId || !grantEbookId) {
						toast.error("Choisissez un lecteur et un ebook.");
						return;
					}
					grant.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-extrabold uppercase md:col-span-3",
						children: "Accorder / retirer un ebook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Lecteur" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full border border-input bg-white px-3 text-sm",
							value: grantUserId,
							onChange: (e) => setGrantUserId(e.target.value),
							required: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Sélectionner…"
							}), data.map((reader) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: reader.id,
								children: reader.display_name || reader.email || reader.id
							}, reader.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ebook" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full border border-input bg-white px-3 text-sm",
							value: grantEbookId,
							onChange: (e) => setGrantEbookId(e.target.value),
							required: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Sélectionner…"
							}), ebooks.map((ebook) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: ebook.id,
								children: ebook.title
							}, ebook.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: grant.isPending,
							children: "Accorder"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							disabled: revoke.isPending || !grantUserId || !grantEbookId,
							onClick: () => revoke.mutate(),
							children: "Retirer"
						})]
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-destructive",
				children: error.message
			}) : null,
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Chargement…"
			}) : null,
			!isLoading && !error && data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground",
				children: "Aucun profil lecteur n’a encore été créé."
			}) : null,
			data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto border border-border bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary text-xs font-bold uppercase tracking-wide text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Nom"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Rôle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Livres"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((reader) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-semibold",
								children: reader.display_name || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: reader.email || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: reader.role === "admin" ? "Admin" : "Client"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: reader.livres
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setGrantUserId(reader.id),
									children: "Accès"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									disabled: setRole.isPending,
									onClick: () => setRole.mutate({
										userId: reader.id,
										role: reader.role === "admin" ? "client" : "admin"
									}),
									children: reader.role === "admin" ? "Retirer admin" : "Rendre admin"
								})]
							})
						]
					}, reader.id)) })]
				})
			}) : null
		]
	});
}
//#endregion
export { AdminReaders as component };
