import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auteurs-Cj1FyTQL.js
var import_jsx_runtime = require_jsx_runtime();
function AdminAuteurs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "auteurs",
		title: "Auteurs",
		description: "Gérez les auteurs associés aux contenus.",
		fields: [{
			key: "nom",
			label: "Nom",
			required: true
		}, {
			key: "prenom",
			label: "Prénom"
		}],
		columns: [{
			key: "nom",
			label: "Nom"
		}, {
			key: "prenom",
			label: "Prénom"
		}]
	});
}
//#endregion
export { AdminAuteurs as component };
