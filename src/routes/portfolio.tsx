import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBanner } from "@/components/page-banner";
import { PORTFOLIO } from "@/lib/site-content";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — nos réalisations | Help Life Building" },
      {
        name: "description",
        content:
          "Ebooks, ateliers, podcast et programmes d'accompagnement : découvrez les réalisations de Help Life Building.",
      },
      { property: "og:title", content: "Portfolio — nos réalisations | Help Life Building" },
      { property: "og:description", content: "Les projets éditoriaux et d'accompagnement menés par Help Life Building." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const categories = useMemo(() => ["Tous", ...Array.from(new Set(PORTFOLIO.map((p) => p.categorie)))], []);
  const [selected, setSelected] = useState("Tous");
  const projets = PORTFOLIO.filter((p) => selected === "Tous" || p.categorie === selected);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBanner
        kicker="Réalisations"
        title="Notre portfolio"
        subtitle="Les projets menés ces dernières années : édition, accompagnement, événements et médias."
      />

      <main className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelected(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                selected === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {projets.map((projet) => (
            <article key={projet.id} className="premium-card group overflow-hidden">
              <div className="flex h-40 items-center justify-center bg-ink text-6xl transition-transform duration-300 group-hover:scale-105">
                <span aria-hidden>{projet.emoji}</span>
              </div>
              <div className="p-6">
                <span className="premium-badge">{projet.categorie}</span>
                <h2 className="mt-3 font-display text-xl font-semibold">{projet.titre}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{projet.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {projet.tags.map((tag) => (
                    <span key={tag} className="rounded-lg bg-secondary px-2 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="premium-card mt-20 p-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Un projet en tête ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Parlons-en autour d'un premier échange : nous verrons ensemble ce qui est réalisable et dans quel délai.
          </p>
          <Link
            to="/rdv"
            className="mt-6 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:bg-brand-strong"
          >
            Prendre rendez-vous
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
