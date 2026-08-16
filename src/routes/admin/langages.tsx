import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/langages")({
  head: () => ({ meta: [{ title: "Langages — Admin" }] }),
  component: AdminLangages,
});

function AdminLangages() {
  return (
    <AdminResourcePage
      resource="langages"
      title="Langages"
      description="Gérez les technologies et compétences des projets."
      fields={[{ key: "nom", label: "Nom", required: true }]}
      columns={[{ key: "nom", label: "Nom" }]}
    />
  );
}
