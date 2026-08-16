import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/auteurs")({
  head: () => ({ meta: [{ title: "Auteurs — Admin" }] }),
  component: AdminAuteurs,
});

function AdminAuteurs() {
  return (
    <AdminResourcePage
      resource="auteurs"
      title="Auteurs"
      description="Gérez les auteurs associés aux contenus."
      fields={[
        { key: "nom", label: "Nom", required: true },
        { key: "prenom", label: "Prénom" },
      ]}
      columns={[
        { key: "nom", label: "Nom" },
        { key: "prenom", label: "Prénom" },
      ]}
    />
  );
}
