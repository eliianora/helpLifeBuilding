import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-DGgjkIUZ.js
var import_jsx_runtime = require_jsx_runtime();
function AdminServices() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "services",
		title: "Services",
		description: "Gérez les offres affichées sur le site.",
		fields: [
			{
				key: "titre",
				label: "Titre",
				required: true
			},
			{
				key: "prix",
				label: "Prix (FCFA)",
				type: "number",
				defaultValue: 0
			},
			{
				key: "unite",
				label: "Unité",
				defaultValue: "heure"
			},
			{
				key: "icone",
				label: "Icône"
			},
			{
				key: "couleur",
				label: "Couleur"
			},
			{
				key: "ordre",
				label: "Ordre",
				type: "number",
				defaultValue: 0
			},
			{
				key: "populaire",
				label: "Service populaire",
				type: "checkbox",
				defaultValue: false
			},
			{
				key: "actif",
				label: "Service actif",
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
				key: "prix",
				label: "Prix"
			},
			{
				key: "unite",
				label: "Unité"
			},
			{
				key: "populaire",
				label: "Populaire"
			},
			{
				key: "actif",
				label: "Actif"
			}
		]
	});
}
//#endregion
export { AdminServices as component };
