import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paniers-CXtoFPfc.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPaniers() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "paniers",
		title: "Paniers",
		description: "Consultez les ebooks actuellement ajoutés aux paniers.",
		allowCreate: false,
		allowDelete: false,
		fields: [],
		columns: [
			{
				key: "ajoute_le",
				label: "Ajouté le",
				format: (value) => value ? new Date(String(value)).toLocaleString("fr-FR") : "—"
			},
			{
				key: "utilisateur_id",
				label: "Utilisateur"
			},
			{
				key: "ebook_id",
				label: "Ebook"
			}
		]
	});
}
//#endregion
export { AdminPaniers as component };
