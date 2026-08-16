import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { FOUNDER } from "@/lib/covers";
import { SiteLogo } from "@/components/site-logo";

const COLUMNS = [
  {
    title: "Lecture",
    links: [
      { label: "Tous les ebooks", to: "/ebooks" as const },
      { label: "Ma bibliothèque", to: "/bibliotheque" as const },
    ],
  },
  {
    title: "La maison",
    links: [
      { label: "La fondatrice", to: "/a-propos" as const },
      { label: "Services", to: "/services" as const },
      { label: "Portfolio", to: "/portfolio" as const },
      { label: "Créer un compte", to: "/auth" as const },
    ],
  },
  {
    title: "Échanger",
    links: [
      { label: "Prendre rendez-vous", to: "/rdv" as const },
      { label: "Communauté", to: "/communaute" as const },
    ],
  },
];

const SOCIALS = [Facebook, Instagram, Linkedin, Youtube];

export function SiteFooter() {
  return (
    <footer className="mt-0 bg-ink text-ink-foreground">
      <div className="border-b border-white/10 bg-primary py-10 text-center text-white">
        <p className="font-display text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
          Parlons de vos projets
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">
          Coaching parental, bien-être mental, ateliers et ebooks à Abidjan — un premier échange pour clarifier ce dont vous avez besoin.
        </p>
        <Link to="/rdv" className="mt-6 inline-flex bg-ink px-8 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-black">
          Nous contacter
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="rounded-sm bg-white px-3 py-2 inline-flex">
              <SiteLogo height={40} />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">{BRAND.promise}</p>
            <div className="mt-6 space-y-3 text-sm text-ink-muted">
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 transition-colors hover:text-primary">
                <Mail className="size-4 text-primary" aria-hidden />
                {BRAND.email}
              </a>
              <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 transition-colors hover:text-primary">
                <Phone className="size-4 text-primary" aria-hidden />
                {BRAND.phone}
              </a>
              <p className="flex items-center gap-3">
                <MapPin className="size-4 text-primary" aria-hidden />
                {BRAND.city}
              </p>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.12em]">{column.title}</h3>
              <span className="mt-3 mb-4 block h-0.5 w-8 bg-primary" aria-hidden />
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-ink-muted transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-ink-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name} — textes de {FOUNDER.name}.
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map((Icon, i) => (
              <span
                key={i}
                className="flex size-9 items-center justify-center rounded-sm bg-white/10 transition-colors hover:bg-primary"
              >
                <Icon className="size-4" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
