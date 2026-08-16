import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Library, Users } from "lucide-react";
import { getAdminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Help Life Building" }] }),
  component: AdminHome,
});

function AdminHome() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
  });

  const cards = [
    {
      label: "Ebooks",
      value: data?.ebooks ?? "—",
      icon: BookOpen,
      to: "/admin/ebooks" as const,
    },
    {
      label: "Chapitres",
      value: data?.chapters ?? "—",
      icon: FileText,
      to: "/admin/chapitres" as const,
    },
    {
      label: "Lecteurs",
      value: data?.lecteurs ?? "—",
      icon: Users,
      to: "/admin/lecteurs" as const,
    },
    {
      label: "Livres en bibliothèque",
      value: data?.bibliotheque ?? "—",
      icon: Library,
      to: "/admin/lecteurs" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
        Tableau de bord
      </h1>
      <p className="mt-2 text-muted-foreground">
        Gérez le catalogue, les chapitres et les accès lecteurs.
      </p>
      <span className="mt-4 mb-8 block h-0.5 w-14 bg-primary" aria-hidden />

      {error ? (
        <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Impossible de charger les statistiques."}{" "}
          Exécutez <code>supabase-admin-tanstack.sql</code> si les politiques
          RLS manquent.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="premium-card p-5">
            <card.icon className="size-6 text-primary" aria-hidden />
            <p className="mt-4 font-display text-3xl font-extrabold">
              {isLoading ? "…" : card.value}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {card.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
