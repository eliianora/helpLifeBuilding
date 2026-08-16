import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AdminResourcePage } from "./admin-resource-page-B8vUzpyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paiements-DHQFM9tk.js
var import_jsx_runtime = require_jsx_runtime();
function AdminPaiements() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminResourcePage, {
		resource: "paiements",
		title: "Paiements",
		description: "Consultez les transactions et corrigez leur statut.",
		allowCreate: false,
		allowDelete: false,
		editLabel: "Changer le statut",
		fields: [{
			key: "statut",
			label: "Statut",
			type: "select",
			required: true,
			options: [
				{
					label: "Payé",
					value: "paid"
				},
				{
					label: "En attente",
					value: "pending"
				},
				{
					label: "Échoué",
					value: "failed"
				},
				{
					label: "Remboursé",
					value: "refunded"
				}
			]
		}],
		columns: [
			{
				key: "date_paiement",
				label: "Date",
				format: (value) => value ? new Date(String(value)).toLocaleString("fr-FR") : "—"
			},
			{
				key: "montant",
				label: "Montant",
				format: (value, row) => `${Number(value ?? 0).toLocaleString("fr-FR")} ${row.devise ?? "XOF"}`
			},
			{
				key: "moyen",
				label: "Moyen"
			},
			{
				key: "statut",
				label: "Statut"
			},
			{
				key: "utilisateur_id",
				label: "Utilisateur"
			}
		]
	});
}
//#endregion
export { AdminPaiements as component };
