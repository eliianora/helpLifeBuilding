import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookLock,
  BookOpen,
  Briefcase,
  CheckCircle,
  Heart,
  Highlighter,
  Quote,
  Users,
} from "lucide-react";

import { listEbooks } from "@/lib/catalog.functions";
import { FOUNDER } from "@/lib/covers";
import { BRAND, STATS } from "@/lib/brand";
import { SERVICES } from "@/lib/site-content";
import { EbookCard } from "@/components/ebook-card";
import { MarqueeBar } from "@/components/marquee-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import founderPortrait from "@/assets/founder.jpg";

const ebooksQuery = queryOptions({ queryKey: ["ebooks"], queryFn: () => listEbooks() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Help Life Building — Ebooks à lire en ligne" },
      {
        name: "description",
        content:
          "Help Life Building — coaching de vie, ebooks et ateliers avec Prisca Brou. Bien-être mental, éducation parentale et leadership personnel.",
      },
      { property: "og:title", content: "Help Life Building — Ebooks à lire en ligne" },
      {
        property: "og:description",
        content: "Coaching de vie, ebooks et ateliers pour construire votre résilience et votre leadership.",
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
  component: Index,
});

const EXPERTISES = [
  {
    icon: BookOpen,
    title: "Ebooks",
    items: ["Extraits gratuits", "Lecture 100 % en ligne", "Progression enregistrée", "Bibliothèque personnelle"],
  },
  {
    icon: Heart,
    title: "Coaching parental",
    items: ["Éducation parentale", "Bien-être mental", "Résilience émotionnelle", "Leadership personnel"],
  },
  {
    icon: Users,
    title: "Ateliers collectifs",
    items: ["Familles", "Femmes", "Adolescents", "Compétences de vie"],
  },
  {
    icon: Briefcase,
    title: "Entreprises",
    items: ["Innovation sociale", "Dispositifs d'impact", "Conférences", "Formations"],
  },
];

function Index() {
  const { data: ebooks } = useSuspenseQuery(ebooksQuery);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <MarqueeBar />

      <main>
        <section className="relative overflow-hidden bg-secondary">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
            <div>
              <p className="hero-eyebrow">Your life coaching · Abidjan</p>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-6xl">
                Coaching de vie
                <br />
                pour <span className="text-primary">construire votre autonomie</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {BRAND.promise} Extrait gratuit sur chaque livre, coaching et ateliers sur mesure.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="cta" size="lg">
                  <Link to="/ebooks">
                    Explorer les ebooks
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/services">Découvrir nos services</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={founderPortrait}
                alt={`Portrait de ${FOUNDER.name}, fondatrice de ${BRAND.name}`}
                width={1024}
                height={1280}
                className="aspect-4/5 w-full object-cover"
              />
              <div className="absolute -bottom-4 -left-4 hidden bg-primary px-6 py-4 text-white md:block">
                <p className="font-display text-3xl font-extrabold">16 ans</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em]">D'expérience en Afrique</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center">
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                Quelques réalisations
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Découvrez quelques-uns de nos ebooks — chaque fiche s'ouvre sur un premier chapitre offert.
              </p>
              <span className="section-bar" aria-hidden />
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ebooks.slice(0, 3).map((ebook) => (
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
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link to="/ebooks">Plus de réalisations</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                  Votre coaching de vie
                  <br />
                  en Côte d'Ivoire
                </h2>
                <span className="mt-4 mb-6 block h-0.5 w-14 bg-primary" aria-hidden />
                <p className="leading-relaxed text-muted-foreground">
                  Help Life Building vous accompagne de A à Z : ebooks, coaching parental, bien-être mental et
                  émotionnel, ateliers pour les familles, les femmes et les adolescents, et formations pour les
                  entreprises.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Un accompagnement ancré dans l'innovation sociale et la participation communautaire, comme levier
                  d'autonomie, de résilience et de développement durable.
                </p>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-primary">Vous avez un projet ?</p>
                <Button asChild className="mt-4" size="lg">
                  <Link to="/services">Découvrir nos services</Link>
                </Button>
              </div>
              <div className="grid gap-px bg-border sm:grid-cols-2">
                {EXPERTISES.map((block) => (
                  <div key={block.title} className="bg-white p-6">
                    <block.icon className="size-7 text-primary" aria-hidden />
                    <h3 className="mt-4 text-sm font-extrabold uppercase tracking-[0.1em]">{block.title}</h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink py-20 text-ink-foreground">
          <div className="mx-auto max-w-6xl px-5 text-center">
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
              Pourquoi nous choisir ?
            </h2>
            <span className="section-bar" aria-hidden />
            <p className="mx-auto mt-6 max-w-2xl text-ink-muted">
              16 années à concevoir et évaluer des programmes d'apprentissage socio-émotionnels en Afrique — et une
              capacité reconnue à fédérer les acteurs et structurer des dispositifs d'impact.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <FeatureDark icon={BookLock} title="Lecture en ligne">
                Aucun fichier à télécharger : le texte reste sur le site, dans votre espace lecteur.
              </FeatureDark>
              <FeatureDark icon={Highlighter} title="Progression suivie">
                Votre place est enregistrée automatiquement, d'un appareil à l'autre.
              </FeatureDark>
              <FeatureDark icon={CheckCircle} title="Extrait gratuit">
                Le premier chapitre de chaque livre est lisible immédiatement, sans compte.
              </FeatureDark>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid items-center gap-12 md:grid-cols-[280px_1fr]">
              <div className="text-center md:text-left">
                <p className="font-display text-7xl font-extrabold leading-none text-primary md:text-8xl">16</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em]">années d'expérience</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Innovation sociale, recherche et développement — en Afrique, sur le terrain.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-y-8 border-y border-border py-8 sm:grid-cols-4 sm:divide-x sm:divide-border">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-2 text-center sm:px-4">
                    <div className="font-display text-3xl font-extrabold text-foreground md:text-4xl">{stat.value}</div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[320px_1fr]">
            <img
              src={founderPortrait}
              alt={`Portrait de ${FOUNDER.name}`}
              width={1024}
              height={1280}
              className="aspect-4/5 w-full object-cover"
            />
            <div>
              <p className="section-eyebrow">Fondatrice de {BRAND.name}</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                Bonjour, je suis {FOUNDER.name}
              </h2>
              <span className="mt-4 mb-6 block h-0.5 w-14 bg-primary" aria-hidden />
              <p className="max-w-2xl leading-relaxed text-muted-foreground">{FOUNDER.bio}</p>
              <div className="mt-6 flex max-w-2xl items-start gap-3 border-l-2 border-primary pl-5">
                <Quote className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <p className="italic text-foreground/80">« {FOUNDER.tagline} »</p>
              </div>
              <Button asChild className="mt-8" size="lg">
                <Link to="/a-propos">
                  Découvrir son histoire
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-secondary py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center">
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight">Ils nous font confiance</h2>
              <span className="section-bar" aria-hidden />
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {SERVICES.map((service) => (
                <Link
                  key={service.id}
                  to="/services"
                  className="group border border-border bg-white p-8 text-center transition-colors hover:border-primary"
                >
                  <service.icon className="mx-auto size-8 text-primary" aria-hidden />
                  <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight">{service.titre}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function FeatureDark({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof BookLock;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Icon className="mx-auto size-8 text-primary" aria-hidden />
      <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{children}</p>
    </div>
  );
}
