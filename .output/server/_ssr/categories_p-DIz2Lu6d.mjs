import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories_p-DIz2Lu6d.js
var import_jsx_runtime = require_jsx_runtime();
function AdminCategoriesProjets() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "categoriesProjets",
		title: "Catégories projets",
		description: "Organisez les projets et réalisations.",
		fields: [{
			key: "nom",
			label: "Nom",
			required: true
		}],
		columns: [{
			key: "nom",
			label: "Nom"
		}]
	});
}
//#endregion
export { AdminCategoriesProjets as component };
