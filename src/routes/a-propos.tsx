import { createFileRoute, Link } from "@tanstack/react-router";

import { FOUNDER } from "@/lib/covers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBanner } from "@/components/page-banner";
import { Button } from "@/components/ui/button";
import founderPortrait from "@/assets/founder.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos de Prisca Brou, fondatrice | Help Life Building" },
      {
        name: "description",
        content:
          "Prisca Brou, anthropologue et coach : 16 ans d'innovation sociale en Afrique, éducation parentale, bien-être mental et leadership personnel.",
      },
      { property: "og:title", content: "À propos de Prisca Brou, fondatrice | Help Life Building" },
      {
        property: "og:description",
        content: "Le parcours de Prisca Brou, fondatrice de Help Life Building.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBanner kicker="À propos" title="La fondatrice" subtitle={FOUNDER.role} />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <img
            src={founderPortrait}
            alt={`Portrait de ${FOUNDER.name}`}
            loading="lazy"
            width={1024}
            height={1280}
            className="aspect-4/5 w-full object-cover"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Je suis</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight">{FOUNDER.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{FOUNDER.honor}</p>
            <span className="mt-4 mb-6 block h-0.5 w-14 bg-primary" aria-hidden />
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>{FOUNDER.bio}</p>
              <p>{FOUNDER.longBio}</p>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">Thème</p>
            <blockquote className="mt-3 border-l-2 border-primary pl-5 font-display text-xl leading-relaxed">
              « {FOUNDER.tagline} »
            </blockquote>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-primary">Sa vision</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">{FOUNDER.vision}</p>
            <Button asChild className="mt-8">
              <Link to="/ebooks">Voir les livres</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
