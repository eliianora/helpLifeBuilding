import { createFileRoute } from "@tanstack/react-router";
import { AdminResourcePage } from "@/components/admin-resource-page";

export const Route = createFileRoute("/admin/services")({
  head: () => ({ meta: [{ title: "Services — Admin" }] }),
  component: AdminServices,
});

function AdminServices() {
  return (
    <AdminResourcePage
      resource="services"
      title="Services"
      description="Gérez les offres affichées sur le site."
      fields={[
        { key: "titre", label: "Titre", required: true },
        { key: "prix", label: "Prix (FCFA)", type: "number", defaultValue: 0 },
        { key: "unite", label: "Unité", defaultValue: "heure" },
        { key: "icone", label: "Icône" },
        { key: "couleur", label: "Couleur" },
        { key: "ordre", label: "Ordre", type: "number", defaultValue: 0 },
        {
          key: "populaire",
          label: "Service populaire",
          type: "checkbox",
          defaultValue: false,
        },
        {
          key: "actif",
          label: "Service actif",
          type: "checkbox",
          defaultValue: true,
        },
        { key: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "titre", label: "Titre" },
        { key: "prix", label: "Prix" },
        { key: "unite", label: "Unité" },
        { key: "populaire", label: "Populaire" },
        { key: "actif", label: "Actif" },
      ]}
    />
  );
}
