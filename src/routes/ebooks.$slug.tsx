import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  BookLock,
  BookOpen,
  Check,
  Clock,
  FileText,
  Highlighter,
  Library,
  Lock,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { getEbookBySlug } from "@/lib/catalog.functions";
import { getEbookAccessStatus } from "@/lib/library.functions";
import { BRAND } from "@/lib/brand";
import { coverFor, FOUNDER } from "@/lib/covers";
import { useSession } from "@/hooks/use-session";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBanner } from "@/components/page-banner";
import { EbookCard } from "@/components/ebook-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const bookQuery = (slug: string) =>
  queryOptions({
    queryKey: ["ebook", slug],
    queryFn: () => getEbookBySlug({ data: { slug } }),
  });

const accessQuery = (slug: string) =>
  queryOptions({
    queryKey: ["ebook-access", slug],
    queryFn: () => getEbookAccessStatus({ data: { slug } }),
  });

export const Route = createFileRoute("/ebooks/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(bookQuery(params.slug));
    if (!data) throw notFound();
    return {
      title: data.ebook.title,
      description: data.ebook.description,
      coverKey: data.ebook.cover_key,
    };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Prisca Brou` : "Livre — Prisca Brou";
    const description = loaderData?.description?.slice(0, 155) ?? "Un livre de Prisca Brou.";
    const cover = loaderData?.coverKey ? coverFor(loaderData.coverKey) : undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "book" },
        ...(cover ? [{ property: "og:image", content: cover }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => (
    <div className="p-16 text-center text-muted-foreground">Cette fiche n'a pas pu être chargée.</div>
  ),
  notFoundComponent: () => (
    <div className="p-16 text-center">
      <p className="font-display text-2xl">Ce livre n'existe pas.</p>
      <Link to="/ebooks" className="mt-4 inline-block text-sm underline">
        Retour au catalogue
      </Link>
    </div>
  ),
  component: EbookDetail,
});

function EbookDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(bookQuery(slug));
  const { user, loading: sessionLoading } = useSession();
  const fetchAccess = useServerFn(getEbookAccessStatus);
  const [copied, setCopied] = useState(false);

  const { data: access, isLoading: accessLoading } = useQuery({
    ...accessQuery(slug),
    queryFn: () => fetchAccess({ data: { slug } }),
    enabled: !!user,
  });

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: data?.ebook.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user cancelled share */
    }
  }

  if (!data) return null;
  const { ebook, toc, sample, related } = data;
  const previewCount = toc.filter((c) => c.is_preview).length;
  const lockedCount = toc.filter((c) => !c.is_preview).length;
  const hasAccess = access?.hasAccess ?? false;
  const progress = access?.progress ?? null;
  const readingHours =
    ebook.reading_minutes >= 60
      ? `~${Math.round(ebook.reading_minutes / 60)} h`
      : `~${ebook.reading_minutes} min`;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBanner kicker={ebook.category ?? "Ebook"} title={ebook.title} subtitle={ebook.subtitle ?? undefined} />

      <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <Link
          to="/ebooks"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour au catalogue
        </Link>

        {/* Hero */}
        <div className="mt-8 grid gap-10 md:grid-cols-[0.65fr_1.35fr] md:items-start">
          <div className="relative">
            <img
              src={coverFor(ebook.cover_key)}
              alt={`Couverture du livre ${ebook.title}`}
              width={800}
              height={1200}
              className="aspect-2/3 w-full object-cover"
            />
            {previewCount > 0 ? (
              <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm backdrop-blur">
                Extrait gratuit
              </span>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              {ebook.category ? (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
                  {ebook.category}
                </span>
              ) : null}
              {previewCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Sparkles className="size-4 text-brand-strong" aria-hidden />
                  {previewCount} chapitre{previewCount > 1 ? "s" : ""} offert{previewCount > 1 ? "s" : ""}
                </span>
              ) : null}
            </div>

            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-[2.5rem]">
              {ebook.title}
            </h2>
            {ebook.subtitle ? (
              <p className="mt-2 text-lg text-muted-foreground">{ebook.subtitle}</p>
            ) : null}

            <p className="mt-4 text-sm text-muted-foreground">
              Par{" "}
              <Link to="/a-propos" className="font-medium text-foreground underline-offset-4 hover:underline">
                {FOUNDER.name}
              </Link>
              <span className="mx-2 text-border">·</span>
              {FOUNDER.role}
            </p>

            <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-4" aria-hidden /> {ebook.pages} pages
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden /> {readingHours} de lecture
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookLock className="size-4" aria-hidden /> Lecture en ligne
              </span>
            </div>

            <p className="mt-6 leading-relaxed text-muted-foreground">{ebook.description}</p>

            <PurchasePanel
              slug={slug}
              priceLabel={ebook.price_label}
              sessionLoading={sessionLoading}
              accessLoading={!!user && accessLoading}
              user={user}
              hasAccess={hasAccess}
              progress={progress}
            />

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-strong" aria-hidden />
                Accès permanent
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen className="size-4 text-brand-strong" aria-hidden />
                Progression synchronisée
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Share2 className="size-4" aria-hidden />
                {copied ? "Lien copié !" : "Partager"}
              </button>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <section className="mt-14 rounded-xl border border-border/70 bg-secondary/30 p-6 md:p-8">
          <h2 className="font-display text-xl tracking-tight">Ce que vous obtenez</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: "Lecture intégrale",
                text: `${toc.length} chapitre${toc.length > 1 ? "s" : ""} à lire dans le lecteur en ligne.`,
              },
              {
                icon: Highlighter,
                title: "Extrait avant achat",
                text: "Lisez les chapitres gratuits sans créer de compte.",
              },
              {
                icon: Library,
                title: "Bibliothèque personnelle",
                text: "Retrouvez tous vos livres et reprenez où vous vous êtes arrêtée.",
              },
              {
                icon: ShieldCheck,
                title: "Sans téléchargement",
                text: "Le contenu reste sur le site — aucun fichier à copier ou partager.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                  <Icon className="size-4 text-brand-strong" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Excerpt + TOC */}
        <section className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <div id="extrait" className="scroll-mt-24">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-brand-strong" aria-hidden />
              <h2 className="font-display text-2xl tracking-tight">Extrait gratuit</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {sample.length === 0
                ? "L'aperçu de ce livre sera bientôt disponible."
                : previewCount === 1
                  ? "Le premier chapitre, en intégralité, sans compte."
                  : `${previewCount} chapitres en intégralité, sans compte.`}
            </p>

            {sample.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
                Revenez bientôt pour découvrir un extrait de ce titre.
              </div>
            ) : (
              sample.map((chapter) => (
                <article key={chapter.position} className="mt-8">
                  <h3 className="font-display text-xl">
                    {chapter.position}. {chapter.title}
                  </h3>
                  <div
                    className="prose-reader mt-4 space-y-5 text-foreground/90"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {chapter.content.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))
            )}

            {lockedCount > 0 ? (
              <PaywallCta
                slug={slug}
                lockedCount={lockedCount}
                priceLabel={ebook.price_label}
                sessionLoading={sessionLoading}
                user={user}
                hasAccess={hasAccess}
              />
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <h2 className="font-display text-lg">Sommaire</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {previewCount} gratuit{previewCount > 1 ? "s" : ""} · {lockedCount} réservé
                {lockedCount > 1 ? "s" : ""}
              </p>
              <ol className="mt-4 space-y-3 text-sm">
                {toc.map((chapter) => (
                  <li key={chapter.position} className="flex items-start gap-2">
                    {chapter.is_preview ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-strong" aria-hidden />
                    ) : (
                      <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                    )}
                    {chapter.is_preview ? (
                      <a
                        href="#extrait"
                        className="transition-colors hover:text-brand-strong"
                      >
                        {chapter.title}
                        <span className="ml-1.5 text-xs uppercase tracking-wide text-brand-strong">
                          gratuit
                        </span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{chapter.title}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </section>

        {/* Related */}
        {related.length > 0 ? (
          <section className="mt-20 border-t border-border/60 pt-16">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-brand-strong" aria-hidden />
              <h2 className="font-display text-2xl tracking-tight">Vous aimerez aussi</h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <EbookCard
                  key={item.slug}
                  slug={item.slug}
                  title={item.title}
                  subtitle={item.subtitle}
                  category={item.category}
                  priceLabel={item.price_label}
                  coverKey={item.cover_key}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}

type ProgressInfo = { chapter_position: number; percent: number } | null;

type PurchasePanelProps = {
  slug: string;
  priceLabel: string;
  sessionLoading: boolean;
  accessLoading: boolean;
  user: { id: string } | null;
  hasAccess: boolean;
  progress: ProgressInfo;
};

function PurchasePanel({
  slug,
  priceLabel,
  sessionLoading,
  accessLoading,
  user,
  hasAccess,
  progress,
}: PurchasePanelProps) {
  const showSkeleton = sessionLoading || accessLoading;

  return (
    <div className="mt-8 rounded-xl border border-border/70 bg-secondary/40 p-5 md:p-6">
      {hasAccess ? (
        <>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-brand-strong">
            <Check className="size-4" aria-hidden />
            Ce livre est dans votre bibliothèque
          </p>
          {progress && progress.percent > 0 ? (
            <div className="mt-4 max-w-sm">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Votre progression</span>
                <span>{progress.percent}%</span>
              </div>
              <Progress value={progress.percent} className="mt-2" />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Chapitre {progress.chapter_position} — reprise automatique
              </p>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="cta" size="lg" className="cta-glow">
              <Link to="/lecture/$slug" params={{ slug }}>
                <BookOpen className="size-4" aria-hidden />
                {progress && progress.percent > 0 ? "Continuer la lecture" : "Commencer la lecture"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/bibliotheque">Ma bibliothèque</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="font-display text-2xl">{priceLabel}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Accès permanent au lecteur en ligne, sans fichier téléchargeable.
          </p>
          <p className="mt-3 border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
            Paiement sécurisé bientôt disponible. Pour obtenir l’accès maintenant, contactez{" "}
            <a className="font-semibold text-primary underline" href={`mailto:${BRAND.email}`}>
              {BRAND.email}
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {showSkeleton ? (
              <div className="h-11 w-48 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <Button asChild variant="cta" size="lg" className="cta-glow">
                <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent(`Accès ebook — ${slug}`)}`}>
                  Demander l’accès
                </a>
              </Button>
            ) : (
              <>
                <Button asChild variant="cta" size="lg" className="cta-glow">
                  <Link to="/auth" search={{ redirect: `/ebooks/${slug}` }}>
                    Créer un compte pour lire
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth" search={{ redirect: `/ebooks/${slug}` }}>
                    Se connecter
                  </Link>
                </Button>
              </>
            )}
            <Button asChild variant="outline" size="lg">
              <a href="#extrait">Lire l'extrait gratuit</a>
            </Button>
          </div>
          {!user && !showSkeleton ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Pas encore convaincu(e) ? Lisez l'extrait ci-dessous, sans inscription.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

type PaywallCtaProps = {
  slug: string;
  lockedCount: number;
  priceLabel: string;
  sessionLoading: boolean;
  user: { id: string } | null;
  hasAccess: boolean;
};

function PaywallCta({
  slug,
  lockedCount,
  priceLabel,
  sessionLoading,
  user,
  hasAccess,
}: PaywallCtaProps) {
  if (hasAccess) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
        <BookOpen className="mx-auto size-5 text-brand-strong" aria-hidden />
        <p className="mt-3 font-display text-xl">La suite vous attend dans le lecteur</p>
        <Button asChild variant="cta" className="cta-glow mt-5">
          <Link to="/lecture/$slug" params={{ slug }}>
            Ouvrir le livre complet
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-xl border border-dashed border-border bg-gradient-to-b from-transparent to-secondary/30 p-8 text-center">
      <Lock className="mx-auto size-5 text-muted-foreground" aria-hidden />
      <p className="mt-3 font-display text-xl">
        {lockedCount} chapitre{lockedCount > 1 ? "s" : ""} de plus vous attend
        {lockedCount > 1 ? "ent" : ""}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        L’accès complet s’ouvre après paiement vérifié ou attribution par un administrateur ({priceLabel}).
      </p>
      {sessionLoading ? null : user ? (
        <Button asChild variant="cta" className="cta-glow mt-5">
          <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent(`Accès ebook — ${slug}`)}`}>
            Demander l’accès — {priceLabel}
          </a>
        </Button>
      ) : (
        <Button asChild variant="cta" className="cta-glow mt-5">
          <Link to="/auth" search={{ redirect: `/ebooks/${slug}` }}>
            Se connecter pour continuer
          </Link>
        </Button>
      )}
    </div>
  );
}
