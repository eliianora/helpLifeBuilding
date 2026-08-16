import type { Database } from "@/integrations/supabase/types";

type EbookRow = Pick<
  Database["public"]["Tables"]["ebooks"]["Row"],
  | "id"
  | "slug"
  | "title"
  | "subtitle"
  | "description"
  | "cover_key"
  | "price_label"
  | "pages"
  | "reading_minutes"
  | "category"
>;

type ChapterPreview = Pick<
  Database["public"]["Tables"]["chapters"]["Row"],
  "position" | "title" | "content" | "is_preview"
>;

const DEMO_EBOOKS: EbookRow[] = [
  {
    id: "demo-clarte",
    slug: "clarte",
    title: "Clarté",
    subtitle: "Décider sans se perdre",
    description:
      "Un guide court pour trier le bruit, formuler vos critères et prendre une décision que vous assumerez demain.",
    cover_key: "clarte",
    price_label: "4 500 FCFA",
    pages: 96,
    reading_minutes: 120,
    category: "Décision",
  },
  {
    id: "demo-traction",
    slug: "traction",
    title: "Traction",
    subtitle: "Passer de l'idée à l'offre",
    description:
      "Les étapes concrètes pour lancer une offre simple, la tester vite et ajuster sans s'épuiser.",
    cover_key: "traction",
    price_label: "4 500 FCFA",
    pages: 88,
    reading_minutes: 105,
    category: "Entrepreneuriat",
  },
  {
    id: "demo-lettres",
    slug: "lettres",
    title: "Lettres à une fondatrice",
    subtitle: "Ce qu'on ne dit pas assez",
    description:
      "Douze lettres intimes sur le doute, la fatigue et la façon de continuer sans se trahir.",
    cover_key: "lettres",
    price_label: "3 900 FCFA",
    pages: 72,
    reading_minutes: 90,
    category: "Récit",
  },
];

const DEMO_CHAPTERS: Record<string, ChapterPreview[]> = {
  clarte: [
    {
      position: 1,
      title: "Le bruit n'est pas une preuve",
      is_preview: true,
      content:
        "Il y a des semaines où tout semble urgent.\n\nOn ouvre dix onglets, on relit trois fils de messages, on demande un avis de plus — et l'on finit par ne rien trancher. Ce n'est pas de la paresse. C'est un excès de signaux sans critère.\n\nCe livre part d'une idée simple : une bonne décision ne demande pas plus d'informations, mais une meilleure formulation de ce qui compte pour vous.",
    },
    { position: 2, title: "Nommer le vrai enjeu", is_preview: false, content: "" },
    { position: 3, title: "Trois critères suffisent", is_preview: false, content: "" },
    { position: 4, title: "Choisir et assumer", is_preview: false, content: "" },
  ],
  traction: [
    {
      position: 1,
      title: "Une offre, pas un manifeste",
      is_preview: true,
      content:
        "La plupart des projets traînent parce qu'ils cherchent à être parfaits avant d'exister.\n\nUne offre utile se décrit en une phrase : pour qui, quel résultat, en combien de temps. Tout le reste — le site, la charte, la stratégie complète — peut attendre.\n\nCommencez petit. Testez vite. Corrigez sans vous punir.",
    },
    { position: 2, title: "Le premier prix", is_preview: false, content: "" },
    { position: 3, title: "Trouver dix personnes", is_preview: false, content: "" },
  ],
  lettres: [
    {
      position: 1,
      title: "Lettre 1 — Le dimanche soir",
      is_preview: true,
      content:
        "Chère toi,\n\nCe dimanche où tu prépares la semaine en te demandant si tu tiendras encore le rythme, je voulais te dire une chose : tu n'es pas en retard. Tu es en train de construire quelque chose qui demande du temps.\n\nLa fatigue n'est pas un échec. C'est parfois le signe qu'il faut simplifier, pas accelerer.",
    },
    { position: 2, title: "Lettre 2 — Quand tout dépend de toi", is_preview: false, content: "" },
    { position: 3, title: "Lettre 3 — La permission de changer d'avis", is_preview: false, content: "" },
  ],
};

export function demoListEbooks(): EbookRow[] {
  return DEMO_EBOOKS;
}

export function demoGetEbookBySlug(slug: string) {
  const ebook = DEMO_EBOOKS.find((b) => b.slug === slug);
  if (!ebook) return null;

  const chapters = DEMO_CHAPTERS[slug] ?? [];
  const toc = chapters.map(({ position, title, is_preview }) => ({ position, title, is_preview }));
  const sample = chapters
    .filter((c) => c.is_preview)
    .map(({ position, title, content }) => ({ position, title, content }));
  const related = DEMO_EBOOKS.filter((b) => b.slug !== slug && b.category === ebook.category).slice(0, 3);
  if (related.length === 0) {
    return {
      ebook,
      toc,
      sample,
      related: DEMO_EBOOKS.filter((b) => b.slug !== slug).slice(0, 3),
    };
  }
  return { ebook, toc, sample, related };
}

export function isDemoMode() {
  return process.env.CATALOG_DEMO === "1" || process.env.VITE_CATALOG_DEMO === "1";
}
