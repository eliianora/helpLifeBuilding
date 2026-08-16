import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/categories_e")({
  head: () => ({ meta: [{ title: "Catégories Ebooks — Admin" }] }),
  component: AdminCategoriesEbooks,
});

function AdminCategoriesEbooks() {
  return (
    <AdminResourcePage
      resource="categoriesEbooks"
      title="Catégories ebooks"
      description="Classez les ebooks par catégorie."
      fields={[{ key: "nom", label: "Nom", required: true }]}
      columns={[{ key: "nom", label: "Nom" }]}
    />
  );
}
