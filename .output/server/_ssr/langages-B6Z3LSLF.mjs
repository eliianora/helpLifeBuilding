import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/langages-B6Z3LSLF.js
var import_jsx_runtime = require_jsx_runtime();
function AdminLangages() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "langages",
		title: "Langages",
		description: "Gérez les technologies et compétences des projets.",
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
export { AdminLangages as component };
