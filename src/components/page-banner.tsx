import { Link } from "@tanstack/react-router";

type PageBannerProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
};

/** Bandeau de page intérieure — même langage que les pages Comfordev. */
export function PageBanner({ kicker, title, subtitle }: PageBannerProps) {
  return (
    <section className="bg-ink py-16 text-center text-ink-foreground md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        {kicker ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary">{kicker}</p>
        ) : null}
        <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight md:text-5xl">{title}</h1>
        {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-base text-ink-muted md:text-lg">{subtitle}</p> : null}
        <span className="section-bar" aria-hidden />
      </div>
    </section>
  );
}
