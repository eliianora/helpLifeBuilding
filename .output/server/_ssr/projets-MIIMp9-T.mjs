import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as adminLegacyList } from "./admin-legacy.functions-BrQcRsM7.mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projets-MIIMp9-T.js
var import_jsx_runtime = require_jsx_runtime();
function AdminProjets() {
	const { data: categories = [] } = useQuery({
		queryKey: ["admin-resource", "categoriesProjets"],
		queryFn: () => adminLegacyList({ data: { resource: "categoriesProjets" } })
	});
	const categoryOptions = categories.map((category) => ({
		label: String(category.nom),
		value: String(category.id)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "projets",
		title: "Projets",
		description: "Publiez les projets et initiatives de Help Life Building.",
		fields: [
			{
				key: "titre",
				label: "Titre",
				required: true
			},
			{
				key: "icon",
				label: "Icône"
			},
			{
				key: "categorie_pro_id",
				label: "Catégorie",
				type: "select",
				options: categoryOptions
			},
			{
				key: "statut",
				label: "Statut",
				type: "select",
				defaultValue: "brouillon",
				options: [
					{
						label: "Brouillon",
						value: "brouillon"
					},
					{
						label: "Publié",
						value: "publie"
					},
					{
						label: "Archivé",
						value: "archive"
					}
				]
			},
			{
				key: "ordre",
				label: "Ordre",
				type: "number",
				defaultValue: 0
			},
			{
				key: "visible",
				label: "Visible",
				type: "checkbox",
				defaultValue: true
			},
			{
				key: "description",
				label: "Description",
				type: "textarea"
			}
		],
		columns: [
			{
				key: "titre",
				label: "Titre"
			},
			{
				key: "categorie_pro_id",
				label: "Catégorie",
				format: (value) => categoryOptions.find((option) => option.value === String(value ?? ""))?.label ?? "—"
			},
			{
				key: "statut",
				label: "Statut"
			},
			{
				key: "ordre",
				label: "Ordre"
			},
			{
				key: "visible",
				label: "Visible"
			}
		]
	});
}
//#endregion
export { AdminProjets as component };
