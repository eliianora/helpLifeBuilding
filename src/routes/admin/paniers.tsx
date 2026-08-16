import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/paniers")({
  head: () => ({ meta: [{ title: "Paniers — Admin" }] }),
  component: AdminPaniers,
});

function AdminPaniers() {
  return (
    <AdminResourcePage
      resource="paniers"
      title="Paniers"
      description="Consultez les ebooks actuellement ajoutés aux paniers."
      allowCreate={false}
      allowDelete={false}
      fields={[]}
      columns={[
        {
          key: "ajoute_le",
          label: "Ajouté le",
          format: (value) =>
            value ? new Date(String(value)).toLocaleString("fr-FR") : "—",
        },
        { key: "utilisateur_id", label: "Utilisateur" },
        { key: "ebook_id", label: "Ebook" },
      ]}
    />
  );
}
