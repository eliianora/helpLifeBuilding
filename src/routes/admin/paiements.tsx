import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/paiements")({
  head: () => ({ meta: [{ title: "Paiements — Admin" }] }),
  component: AdminPaiements,
});

function AdminPaiements() {
  return (
    <AdminResourcePage
      resource="paiements"
      title="Paiements"
      description="Consultez les transactions et corrigez leur statut."
      allowCreate={false}
      allowDelete={false}
      editLabel="Changer le statut"
      fields={[
        {
          key: "statut",
          label: "Statut",
          type: "select",
          required: true,
          options: [
            { label: "Payé", value: "paid" },
            { label: "En attente", value: "pending" },
            { label: "Échoué", value: "failed" },
            { label: "Remboursé", value: "refunded" },
          ],
        },
      ]}
      columns={[
        {
          key: "date_paiement",
          label: "Date",
          format: (value) =>
            value ? new Date(String(value)).toLocaleString("fr-FR") : "—",
        },
        {
          key: "montant",
          label: "Montant",
          format: (value, row) =>
            `${Number(value ?? 0).toLocaleString("fr-FR")} ${row.devise ?? "XOF"}`,
        },
        { key: "moyen", label: "Moyen" },
        { key: "statut", label: "Statut" },
        { key: "utilisateur_id", label: "Utilisateur" },
      ]}
    />
  );
}
