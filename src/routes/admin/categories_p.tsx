import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/categories_p")({
  head: () => ({ meta: [{ title: "Catégories Projets — Admin" }] }),
  component: AdminCategoriesProjets,
});

function AdminCategoriesProjets() {
  return (
    <AdminResourcePage
      resource="categoriesProjets"
      title="Catégories projets"
      description="Organisez les projets et réalisations."
      fields={[{ key: "nom", label: "Nom", required: true }]}
      columns={[{ key: "nom", label: "Nom" }]}
    />
  );
}
