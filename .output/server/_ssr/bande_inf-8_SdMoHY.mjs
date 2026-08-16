import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bande_inf-8_SdMoHY.js
var import_jsx_runtime = require_jsx_runtime();
function AdminBandeInfo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "bandeInfo",
		title: "Bande info",
		description: "Gérez les messages défilants et annonces.",
		fields: [
			{
				key: "type",
				label: "Type",
				type: "select",
				defaultValue: "text",
				options: [
					{
						label: "Texte",
						value: "text"
					},
					{
						label: "Image",
						value: "image"
					},
					{
						label: "Vidéo",
						value: "video"
					}
				]
			},
			{
				key: "contenu",
				label: "Contenu",
				type: "textarea",
				required: true
			},
			{
				key: "media_url",
				label: "URL du média"
			},
			{
				key: "lien",
				label: "Lien"
			},
			{
				key: "ordre",
				label: "Ordre",
				type: "number",
				defaultValue: 0
			},
			{
				key: "actif",
				label: "Annonce active",
				type: "checkbox",
				defaultValue: true
			}
		],
		columns: [
			{
				key: "contenu",
				label: "Contenu"
			},
			{
				key: "type",
				label: "Type"
			},
			{
				key: "ordre",
				label: "Ordre"
			},
			{
				key: "actif",
				label: "Actif"
			}
		]
	});
}
//#endregion
export { AdminBandeInfo as component };
