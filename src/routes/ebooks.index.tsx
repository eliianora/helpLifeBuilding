import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { listEbooks } from "@/lib/catalog.functions";
import { EbookCard } from "@/components/ebook-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBanner } from "@/components/page-banner";

const ebooksQuery = queryOptions({ queryKey: ["ebooks"], queryFn: () => listEbooks() });

export const Route = createFileRoute("/ebooks/")({
  head: () => ({
    meta: [
      { title: "Tous les livres — Prisca Brou" },
      {
        name: "description",
        content:
          "Le catalogue complet des livres numériques de Prisca Brou. Extrait gratuit sur chaque fiche.",
      },
      { property: "og:title", content: "Tous les livres — Prisca Brou" },
      {
        property: "og:description",
        content: "Le catalogue complet des livres numériques de Prisca Brou.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(ebooksQuery);
  },
  errorComponent: () => (
    <div className="p-16 text-center text-muted-foreground">Le catalogue n'a pas pu être chargé.</div>
  ),
  notFoundComponent: () => <div className="p-16 text-center">Page introuvable.</div>,
  component: EbooksIndex,
});

function EbooksIndex() {
  const { data: ebooks } = useSuspenseQuery(ebooksQuery);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBanner
        kicker="Catalogue"
        title="Les livres"
        subtitle="Chaque fiche contient un extrait gratuit du premier chapitre. La suite se lit en ligne, dans votre bibliothèque."
      />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ebooks.map((ebook) => (
            <EbookCard
              key={ebook.id}
              slug={ebook.slug}
              title={ebook.title}
              subtitle={ebook.subtitle}
              category={ebook.category}
              priceLabel={ebook.price_label}
              coverKey={ebook.cover_key}
            />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}