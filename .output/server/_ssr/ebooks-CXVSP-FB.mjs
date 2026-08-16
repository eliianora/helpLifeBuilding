import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DqaBVmPg.mjs";
import { r as slugify } from "./admin-Bv8g1X24.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CWkTyF61.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { o as Upload, z as FileText } from "../_libs/lucide-react.mjs";
import { a as adminListEbooks, d as adminUploadEbookPdf, l as adminSaveEbook, n as adminDeleteEbook } from "./admin.functions-D3nCuUqe.mjs";
import { n as adminLegacyList } from "./admin-legacy.functions-BrQcRsM7.mjs";
import { t as Input } from "./input-Oigv6AWn.mjs";
import { t as Label } from "./label-DWmshiB9.mjs";
import { t as Textarea } from "./textarea-B-JceDfa.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ebooks-CXVSP-FB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = () => ({
	title: "",
	slug: "",
	subtitle: "",
	description: "",
	category: "",
	category_id: "",
	cover_key: "",
	fichier_url: "",
	price_label: "4 500 FCFA",
	price_amount: 4500,
	pages: 80,
	reading_minutes: 90,
	position: 0,
	published: false
});
function AdminEbooks() {
	const queryClient = useQueryClient();
	const [form, setForm] = (0, import_react.useState)(null);
	const [pdfFile, setPdfFile] = (0, import_react.useState)(null);
	const { data: categories = [] } = useQuery({
		queryKey: ["admin-resource", "categoriesEbooks"],
		queryFn: () => adminLegacyList({ data: { resource: "categoriesEbooks" } })
	});
	const { data = [], isLoading, error } = useQuery({
		queryKey: ["admin-ebooks"],
		queryFn: () => adminListEbooks()
	});
	const save = useMutation({
		mutationFn: async (payload) => {
			let uploadedPath = null;
			if (pdfFile) {
				if (pdfFile.size > 52428800) throw new Error("Le PDF ne doit pas dépasser 50 Mo.");
				const buffer = await pdfFile.arrayBuffer();
				const bytes = new Uint8Array(buffer);
				let binary = "";
				const chunk = 32768;
				for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
				const base64 = btoa(binary);
				uploadedPath = (await adminUploadEbookPdf({ data: {
					fileName: pdfFile.name,
					base64,
					slugHint: payload.slug || payload.title
				} })).path;
			}
			try {
				return {
					saved: await adminSaveEbook({ data: {
						id: payload.id,
						title: payload.title,
						slug: payload.slug || slugify(payload.title),
						subtitle: payload.subtitle || null,
						description: payload.description,
						category: payload.category || null,
						category_id: payload.category_id || null,
						cover_key: payload.cover_key || null,
						fichier_url: uploadedPath || payload.fichier_url || null,
						price_label: payload.price_label,
						price_amount: Number(payload.price_amount),
						pages: Number(payload.pages),
						reading_minutes: Number(payload.reading_minutes),
						position: Number(payload.position),
						published: payload.published
					} }),
					uploadedPath,
					previousPath: payload.fichier_url
				};
			} catch (caught) {
				if (uploadedPath) await supabase.storage.from("ebooks").remove([uploadedPath]);
				throw caught;
			}
		},
		onSuccess: async ({ uploadedPath, previousPath }) => {
			if (uploadedPath && previousPath && !previousPath.startsWith("http")) await supabase.storage.from("ebooks").remove([previousPath]);
			toast.success("Ebook enregistré.");
			setForm(null);
			setPdfFile(null);
			queryClient.invalidateQueries({ queryKey: ["admin-ebooks"] });
			queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const remove = useMutation({
		mutationFn: (id) => adminDeleteEbook({ data: { id } }),
		onSuccess: () => {
			toast.success("Ebook supprimé.");
			queryClient.invalidateQueries({ queryKey: ["admin-ebooks"] });
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
					children: "Ebooks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Publiez et mettez à jour le catalogue."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						setPdfFile(null);
						setForm(emptyForm());
					},
					children: "Nouvel ebook"
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
			!isLoading && !error && data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground",
				children: "Aucun ebook. Créez le premier avec le bouton ci-dessus."
			}) : null,
			data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto border border-border bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary text-xs font-bold uppercase tracking-wide text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Titre"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Catégorie"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Prix"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "PDF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Statut"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((ebook) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-semibold",
								children: ebook.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: ebook.category ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: ebook.price_label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: ebook.fichier_url ? "Chargé" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: ebook.published ? "Publié" : "Brouillon"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										setPdfFile(null);
										setForm({
											id: ebook.id,
											title: ebook.title,
											slug: ebook.slug,
											subtitle: ebook.subtitle ?? "",
											description: ebook.description ?? "",
											category: ebook.category ?? "",
											category_id: ebook.categorie_eb_id ?? "",
											cover_key: ebook.cover_key ?? "",
											fichier_url: ebook.fichier_url ?? "",
											price_label: ebook.price_label,
											price_amount: ebook.prix ?? 0,
											pages: ebook.pages,
											reading_minutes: ebook.reading_minutes,
											position: ebook.position,
											published: ebook.published
										});
									},
									children: "Modifier"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									disabled: remove.isPending,
									onClick: () => {
										if (confirm(`Supprimer « ${ebook.title} » ?`)) remove.mutate(ebook.id);
									},
									children: "Supprimer"
								})]
							})
						]
					}, ebook.id)) })]
				})
			}) : null,
			form ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "premium-card mt-8 grid gap-4 p-6 md:grid-cols-2",
				onSubmit: (event) => {
					event.preventDefault();
					save.mutate(form);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-extrabold uppercase md:col-span-2",
						children: form.id ? "Modifier l'ebook" : "Nouvel ebook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Titre",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.title,
							onChange: (e) => setForm({
								...form,
								title: e.target.value,
								slug: form.id ? form.slug : slugify(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Slug",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.slug,
							onChange: (e) => setForm({
								...form,
								slug: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Sous-titre",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.subtitle,
							onChange: (e) => setForm({
								...form,
								subtitle: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Catégorie",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full border border-input bg-white px-3 text-sm",
							value: form.category_id,
							onChange: (event) => {
								const selected = categories.find((row) => String(row.id) === event.target.value);
								setForm({
									...form,
									category_id: event.target.value,
									category: selected ? String(selected.nom ?? "") : ""
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Sans catégorie"
							}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: String(category.id),
								children: String(category.nom)
							}, String(category.id)))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Prix affiché",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.price_label,
							onChange: (e) => setForm({
								...form,
								price_label: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Prix facturé (FCFA)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							required: true,
							value: form.price_amount,
							onChange: (e) => setForm({
								...form,
								price_amount: Number(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Clé de couverture",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.cover_key,
							onChange: (e) => setForm({
								...form,
								cover_key: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 md:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ebook-pdf",
								children: "Fichier PDF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: "ebook-pdf",
								className: "flex cursor-pointer items-center gap-3 border border-dashed border-primary/40 bg-primary/5 px-4 py-5 text-sm transition-colors hover:bg-primary/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
									className: "size-5 text-primary",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pdfFile ? `${pdfFile.name} (${(pdfFile.size / 1024 / 1024).toFixed(1)} Mo)` : form.fichier_url ? "Remplacer le PDF actuellement chargé" : "Choisir un PDF depuis l’ordinateur (50 Mo maximum)" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "ebook-pdf",
								className: "sr-only",
								type: "file",
								accept: "application/pdf,.pdf",
								onChange: (event) => setPdfFile(event.target.files?.[0] ?? null)
							}),
							form.fichier_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
										className: "size-4",
										"aria-hidden": true
									}),
									"PDF enregistré : ",
									form.fichier_url.split("/").at(-1)
								]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Pages",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							value: form.pages,
							onChange: (e) => setForm({
								...form,
								pages: Number(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Minutes de lecture",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							value: form.reading_minutes,
							onChange: (e) => setForm({
								...form,
								reading_minutes: Number(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Ordre d'affichage",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: form.position,
							onChange: (e) => setForm({
								...form,
								position: Number(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm font-semibold md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.published,
							onChange: (e) => setForm({
								...form,
								published: e.target.checked
							})
						}), "Publié"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-2 min-h-28",
							value: form.description,
							onChange: (e) => setForm({
								...form,
								description: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: save.isPending,
							children: save.isPending ? "Envoi et enregistrement…" : "Enregistrer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => {
								setPdfFile(null);
								setForm(null);
							},
							children: "Annuler"
						})]
					})
				]
			}) : null
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { AdminEbooks as component };
