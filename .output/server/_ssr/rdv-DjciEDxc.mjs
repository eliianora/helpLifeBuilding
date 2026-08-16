import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rdv-DjciEDxc.js
var import_jsx_runtime = require_jsx_runtime();
function AdminRendezVous() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "rendezVous",
		title: "Rendez-vous",
		description: "Traitez les demandes de rendez-vous reçues.",
		allowCreate: false,
		allowDelete: false,
		editLabel: "Traiter",
		fields: [{
			key: "statut",
			label: "Statut",
			type: "select",
			required: true,
			options: [
				{
					label: "En attente",
					value: "en_attente"
				},
				{
					label: "Confirmé",
					value: "confirme"
				},
				{
					label: "Terminé",
					value: "termine"
				},
				{
					label: "Annulé",
					value: "annule"
				}
			]
		}, {
			key: "notes_admin",
			label: "Notes administratives",
			type: "textarea"
		}],
		columns: [
			{
				key: "date_rdv",
				label: "Date"
			},
			{
				key: "heure_rdv",
				label: "Heure"
			},
			{
				key: "nom_client",
				label: "Client"
			},
			{
				key: "email_client",
				label: "Email"
			},
			{
				key: "telephone",
				label: "Téléphone"
			},
			{
				key: "statut",
				label: "Statut"
			}
		]
	});
}
//#endregion
export { AdminRendezVous as component };
