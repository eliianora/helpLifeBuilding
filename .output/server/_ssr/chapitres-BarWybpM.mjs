import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CWkTyF61.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as adminListEbooks, c as adminSaveChapter, i as adminListChapters, t as adminDeleteChapter } from "./admin.functions-D3nCuUqe.mjs";
import { t as Input } from "./input-Oigv6AWn.mjs";
import { t as Label } from "./label-DWmshiB9.mjs";
import { t as Textarea } from "./textarea-B-JceDfa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chapitres-BarWybpM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminChapters() {
	const queryClient = useQueryClient();
	const { data: ebooks = [] } = useQuery({
		queryKey: ["admin-ebooks"],
		queryFn: () => adminListEbooks()
	});
	const [ebookId, setEbookId] = (0, import_react.useState)("");
	const selectedId = ebookId || ebooks[0]?.id || "";
	const [form, setForm] = (0, import_react.useState)(null);
	const { data = [], isLoading, error } = useQuery({
		queryKey: ["admin-chapters", selectedId],
		queryFn: () => adminListChapters({ data: { ebookId: selectedId } }),
		enabled: Boolean(selectedId)
	});
	const nextPosition = (0, import_react.useMemo)(() => (data.at(-1)?.position ?? 0) + 1, [data]);
	const save = useMutation({
		mutationFn: (payload) => adminSaveChapter({ data: {
			id: payload.id,
			ebook_id: payload.ebook_id,
			title: payload.title,
			position: Number(payload.position),
			is_preview: payload.is_preview,
			content: payload.content
		} }),
		onSuccess: (_result, payload) => {
			toast.success("Chapitre enregistré.");
			setForm(null);
			queryClient.invalidateQueries({ queryKey: ["admin-chapters", payload.ebook_id] });
			queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const remove = useMutation({
		mutationFn: (id) => adminDeleteChapter({ data: { id } }),
		onSuccess: () => {
			toast.success("Chapitre supprimé.");
			queryClient.invalidateQueries({ queryKey: ["admin-chapters", selectedId] });
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold uppercase tracking-tight",
					children: "Chapitres"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Rédigez le texte et marquez les extraits gratuits."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-10 border border-input bg-white px-3 text-sm",
						value: selectedId,
						onChange: (e) => {
							setEbookId(e.target.value);
							setForm(null);
						},
						children: ebooks.map((ebook) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: ebook.id,
							children: ebook.title
						}, ebook.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !selectedId,
						onClick: () => setForm({
							ebook_id: selectedId,
							title: "",
							position: nextPosition,
							is_preview: false,
							content: ""
						}),
						children: "Nouveau chapitre"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-4 mb-8 block h-0.5 w-14 bg-primary",
				"aria-hidden": true
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-destructive",
				children: error.message
			}) : null,
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Chargement…"
			}) : null,
			!selectedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground",
				children: "Créez d’abord un ebook avant d’ajouter des chapitres."
			}) : !isLoading && !error && data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground",
				children: "Aucun chapitre pour cet ebook."
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
								children: "#"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Titre"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Extrait"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((chapter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: chapter.position
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-semibold",
								children: chapter.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: chapter.is_preview ? "Oui" : "Non"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setForm(chapter),
									children: "Modifier"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									disabled: remove.isPending,
									onClick: () => {
										if (confirm(`Supprimer « ${chapter.title} » ?`)) remove.mutate(chapter.id);
									},
									children: "Supprimer"
								})]
							})
						]
					}, chapter.id)) })]
				})
			}) : null,
			form ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "premium-card mt-8 space-y-4 p-6",
				onSubmit: (event) => {
					event.preventDefault();
					save.mutate(form);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-extrabold uppercase",
						children: form.id ? "Modifier le chapitre" : "Nouveau chapitre"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Titre" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.title,
								onChange: (e) => setForm({
									...form,
									title: e.target.value
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Position" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								value: form.position,
								onChange: (e) => setForm({
									...form,
									position: Number(e.target.value)
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.is_preview,
							onChange: (e) => setForm({
								...form,
								is_preview: e.target.checked
							})
						}), "Extrait gratuit"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Contenu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-48",
							value: form.content,
							onChange: (e) => setForm({
								...form,
								content: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: save.isPending,
							children: "Enregistrer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setForm(null),
							children: "Annuler"
						})]
					})
				]
			}) : null
		]
	});
}
//#endregion
export { AdminChapters as component };
