import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/rdv")({
  head: () => ({ meta: [{ title: "Rendez-vous — Admin" }] }),
  component: AdminRendezVous,
});

function AdminRendezVous() {
  return (
    <AdminResourcePage
      resource="rendezVous"
      title="Rendez-vous"
      description="Traitez les demandes de rendez-vous reçues."
      allowCreate={false}
      allowDelete={false}
      editLabel="Traiter"
      fields={[
        {
          key: "statut",
          label: "Statut",
          type: "select",
          required: true,
          options: [
            { label: "En attente", value: "en_attente" },
            { label: "Confirmé", value: "confirme" },
            { label: "Terminé", value: "termine" },
            { label: "Annulé", value: "annule" },
          ],
        },
        {
          key: "notes_admin",
          label: "Notes administratives",
          type: "textarea",
        },
      ]}
      columns={[
        { key: "date_rdv", label: "Date" },
        { key: "heure_rdv", label: "Heure" },
        { key: "nom_client", label: "Client" },
        { key: "email_client", label: "Email" },
        { key: "telephone", label: "Téléphone" },
        { key: "statut", label: "Statut" },
      ]}
    />
  );
}
