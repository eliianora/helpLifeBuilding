import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminResourcePage } from "@/components/admin-resource-page";
import { adminLegacyList } from "@/lib/admin-legacy.functions";

export const Route = createFileRoute("/admin/projets")({
  head: () => ({ meta: [{ title: "Projets — Admin" }] }),
  component: AdminProjets,
});

function AdminProjets() {
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-resource", "categoriesProjets"],
    queryFn: () => adminLegacyList({ data: { resource: "categoriesProjets" } }),
  });
  const categoryOptions = categories.map((category) => ({
    label: String(category.nom),
    value: String(category.id),
  }));

  return (
    <AdminResourcePage
      resource="projets"
      title="Projets"
      description="Publiez les projets et initiatives de Help Life Building."
      fields={[
        { key: "titre", label: "Titre", required: true },
        { key: "icon", label: "Icône" },
        {
          key: "categorie_pro_id",
          label: "Catégorie",
          type: "select",
          options: categoryOptions,
        },
        {
          key: "statut",
          label: "Statut",
          type: "select",
          defaultValue: "brouillon",
          options: [
            { label: "Brouillon", value: "brouillon" },
            { label: "Publié", value: "publie" },
            { label: "Archivé", value: "archive" },
          ],
        },
        { key: "ordre", label: "Ordre", type: "number", defaultValue: 0 },
        {
          key: "visible",
          label: "Visible",
          type: "checkbox",
          defaultValue: true,
        },
        { key: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "titre", label: "Titre" },
        {
          key: "categorie_pro_id",
          label: "Catégorie",
          format: (value) =>
            categoryOptions.find((option) => option.value === String(value ?? ""))?.label ?? "—",
        },
        { key: "statut", label: "Statut" },
        { key: "ordre", label: "Ordre" },
        { key: "visible", label: "Visible" },
      ]}
    />
  );
}
