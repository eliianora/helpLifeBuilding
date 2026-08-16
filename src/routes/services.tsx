import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBanner } from "@/components/page-banner";
import { GARANTIES, PACKS, SERVICES, formatFcfa } from "@/lib/site-content";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — coaching et ateliers | Help Life Building" },
      {
        name: "description",
        content:
          "Coaching parental, ateliers familles / femmes / adolescents, et formations pour entreprises et institutions.",
      },
      { property: "og:title", content: "Services — coaching et ateliers | Help Life Building" },
      {
        property: "og:description",
        content: "Coaching parental, ateliers et formations institutions avec Help Life Building.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBanner
        kicker="Expertise"
        title="Nos services"
        subtitle="Un accompagnement professionnel, en individuel ou en groupe, pour transformer vos idées en résultats."
      />

      <main className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-7 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className={`premium-card relative p-7 ${service.populaire ? "ring-2 ring-primary" : ""}`}
            >
              {service.populaire ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
                  Populaire
                </span>
              ) : null}

              <span className={`inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-md`}>
                <service.icon className="size-7" aria-hidden />
              </span>

              <h2 className="mt-6 font-display text-2xl font-semibold">{service.titre}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>

              <ul className="mt-6 space-y-3 text-sm">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-center justify-between border-t border-border/60 pt-5">
                <p className="font-display text-xl font-semibold">
                  {service.prix ? formatFcfa(service.prix) : service.unite}
                  {service.prix ? <span className="text-sm font-normal text-muted-foreground">/{service.unite}</span> : null}
                </p>
                <Link
                  to="/rdv"
                  className="inline-flex items-center gap-1.5 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:bg-brand-strong"
                >
                  Réserver
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-24 text-center">
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight">Nos packs</h2>
          <span className="section-bar" aria-hidden />
          <p className="mt-3 text-muted-foreground">Des offres groupées pour un meilleur rapport qualité-prix.</p>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-3">
          {PACKS.map((pack) => (
            <article key={pack.id} className={`premium-card relative p-7 ${pack.popular ? "ring-2 ring-gold" : ""}`}>
              {pack.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                  Meilleure offre
                </span>
              ) : null}
              <h3 className="font-display text-2xl font-semibold">{pack.nom}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{pack.description}</p>
              <p className="mt-5 font-display text-3xl font-semibold text-brand-strong">{formatFcfa(pack.prix)}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/rdv"
                className={`mt-7 flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
                  pack.popular ? "bg-primary text-white hover:bg-brand-strong" : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                Choisir ce pack
              </Link>
            </article>
          ))}
        </div>

        <section className="relative mt-24 bg-ink px-8 py-14 text-ink-foreground">
          <h2 className="relative text-center font-display text-3xl font-extrabold uppercase tracking-tight">
            Nos garanties
          </h2>
          <span className="section-bar" aria-hidden />
          <div className="relative mt-10 grid gap-8 md:grid-cols-3">
            {GARANTIES.map((g) => (
              <div key={g.titre} className="text-center">
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/10 text-gold">
                  <g.icon className="size-7" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{g.titre}</h3>
                <p className="mt-2 text-sm text-ink-muted">{g.texte}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
