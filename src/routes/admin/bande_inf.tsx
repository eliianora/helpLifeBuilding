import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/bande_inf")({
  head: () => ({ meta: [{ title: "Bande Info — Admin" }] }),
  component: AdminBandeInfo,
});

function AdminBandeInfo() {
  return (
    <AdminResourcePage
      resource="bandeInfo"
      title="Bande info"
      description="Gérez les messages défilants et annonces."
      fields={[
        {
          key: "type",
          label: "Type",
          type: "select",
          defaultValue: "text",
          options: [
            { label: "Texte", value: "text" },
            { label: "Image", value: "image" },
            { label: "Vidéo", value: "video" },
          ],
        },
        { key: "contenu", label: "Contenu", type: "textarea", required: true },
        { key: "media_url", label: "URL du média" },
        { key: "lien", label: "Lien" },
        { key: "ordre", label: "Ordre", type: "number", defaultValue: 0 },
        {
          key: "actif",
          label: "Annonce active",
          type: "checkbox",
          defaultValue: true,
        },
      ]}
      columns={[
        { key: "contenu", label: "Contenu" },
        { key: "type", label: "Type" },
        { key: "ordre", label: "Ordre" },
        { key: "actif", label: "Actif" },
      ]}
    />
  );
}
