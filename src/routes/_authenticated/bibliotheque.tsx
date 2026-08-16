import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getMyLibrary } from "@/lib/library.functions";
import { coverFor } from "@/lib/covers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBanner } from "@/components/page-banner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Ma bibliothèque — Prisca Brou" },
      { name: "description", content: "Vos livres et votre progression de lecture." },
      { property: "og:title", content: "Ma bibliothèque — Prisca Brou" },
      { property: "og:description", content: "Vos livres et votre progression de lecture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const fetchLibrary = useServerFn(getMyLibrary);
  const { data, isLoading, error } = useQuery({ queryKey: ["library"], queryFn: () => fetchLibrary() });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBanner
        kicker="Espace lecteur"
        title="Ma bibliothèque"
        subtitle="Reprenez exactement là où vous vous êtes arrêtée."
      />
      <main className="mx-auto max-w-5xl px-5 py-16">

        {isLoading ? <p className="mt-10 text-muted-foreground">Chargement…</p> : null}
        {error ? <p className="mt-10 text-destructive">La bibliothèque n'a pas pu être chargée.</p> : null}

        {data && data.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="font-display text-xl">Votre bibliothèque est vide</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Choisissez un livre, lisez l'extrait, puis ajoutez-le ici pour le lire en entier.
            </p>
            <Button asChild className="mt-5">
              <Link to="/ebooks">Parcourir les livres</Link>
            </Button>
          </div>
        ) : null}

        <div className="mt-10 space-y-5">
          {data?.map(({ ebook, progress }) =>
            ebook ? (
              <div
                key={ebook.id}
                className="flex flex-col gap-5 rounded-xl border border-border/70 bg-card p-5 sm:flex-row sm:items-center"
              >
                <img
                  src={coverFor(ebook.cover_key)}
                  alt={`Couverture du livre ${ebook.title}`}
                  loading="lazy"
                  width={800}
                  height={1200}
                  className="h-36 w-24 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl">{ebook.title}</h2>
                  {ebook.subtitle ? (
                    <p className="text-sm text-muted-foreground">{ebook.subtitle}</p>
                  ) : null}
                  <div className="mt-4 max-w-sm">
                    <Progress value={progress?.percent ?? 0} />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {progress
                        ? `${progress.percent}% lu — chapitre ${progress.chapter_position}`
                        : "Pas encore commencé"}
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/lecture/$slug" params={{ slug: ebook.slug }}>
                    {progress ? "Reprendre" : "Commencer"}
                  </Link>
                </Button>
              </div>
            ) : null,
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}