import { Link } from "@tanstack/react-router";
import { coverFor } from "@/lib/covers";

type EbookCardProps = {
  slug: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  priceLabel?: string;
  coverKey: string | null;
};

export function EbookCard({ slug, title, subtitle, category, priceLabel, coverKey }: EbookCardProps) {
  return (
    <Link to="/ebooks/$slug" params={{ slug }} className="group block">
      <div className="relative overflow-hidden bg-muted">
        <img
          src={coverFor(coverKey)}
          alt={`Couverture du livre ${title}`}
          loading="lazy"
          width={800}
          height={1200}
          className="aspect-2/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-ink/0 p-5 transition-colors duration-300 group-hover:bg-ink/75">
          <p className="translate-y-3 text-xs font-bold uppercase tracking-[0.16em] text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {category ?? "Ebook"}
          </p>
          <h3 className="translate-y-3 font-display text-lg font-bold text-white opacity-0 transition-all delay-75 duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {title}
          </h3>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-display text-base font-bold leading-snug transition-colors group-hover:text-primary">{title}</h3>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        {priceLabel ? <p className="pt-1 text-sm font-bold text-primary">{priceLabel}</p> : null}
      </div>
    </Link>
  );
}
