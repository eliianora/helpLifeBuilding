import { Award, Clock, Heart, Shield, Sparkles, Star, TrendingUp, Users, Zap } from "lucide-react";

export function formatFcfa(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export const SERVICES = [
  {
    id: "coaching",
    icon: Heart,
    titre: "Coaching parental & bien-être",
    description:
      "Un accompagnement individuel pour l'éducation parentale, le bien-être mental et émotionnel et le leadership personnel.",
    prix: 45000,
    unite: "séance",
    color: "from-primary to-brand-strong",
    populaire: false,
    features: ["Éducation parentale", "Résilience affective et émotionnelle", "Suivi par WhatsApp"],
  },
  {
    id: "atelier",
    icon: Users,
    titre: "Ateliers collectifs",
    description:
      "Des sessions pour les familles, les femmes et les adolescents : compétences de vie, résilience et santé sexuelle et reproductive.",
    prix: 25000,
    unite: "atelier",
    color: "from-ink to-neutral-800",
    populaire: true,
    features: ["Familles, femmes et adolescents", "Compétences de vie courante", "Groupes de 8 personnes maximum"],
  },
  {
    id: "conseil",
    icon: TrendingUp,
    titre: "Entreprises & institutions",
    description:
      "Former et accompagner les organisations : innovation sociale, dispositifs d'impact et dynamiques de changement.",
    prix: 0,
    unite: "Sur devis",
    color: "from-primary to-brand-strong",
    populaire: false,
    features: ["Cartographie de solutions", "Programmes d'apprentissage", "Conférences et formations"],
  },
];

export const PACKS = [
  {
    id: "starter",
    nom: "Starter",
    prix: 120000,
    description: "Idéal pour démarrer",
    features: ["3 séances de coaching", "Plan d'action", "Support par email"],
    popular: false,
  },
  {
    id: "growth",
    nom: "Growth",
    prix: 290000,
    description: "Le plus choisi",
    features: ["8 séances de coaching", "Plan personnalisé", "Support WhatsApp", "Ressources exclusives"],
    popular: true,
  },
  {
    id: "premium",
    nom: "Premium",
    prix: 650000,
    description: "Transformation complète",
    features: [
      "20 séances de coaching",
      "Accompagnement complet",
      "Support prioritaire",
      "Accès VIP à la communauté",
      "Tous les ebooks offerts",
    ],
    popular: false,
  },
];

export const GARANTIES = [
  { icon: Shield, titre: "Terrain africain", texte: "16 années de conception et d'évaluation de programmes." },
  { icon: Zap, titre: "Impact structuré", texte: "Fédérer les acteurs et accompagner le changement." },
  { icon: Clock, titre: "Réponse sous 24 h", texte: "Une équipe joignable du lundi au samedi." },
];

export const PORTFOLIO = [
  {
    id: "collection-clarte",
    titre: "Collection « Clarté »",
    categorie: "Édition",
    description: "Direction éditoriale et mise en page d'une série de trois ebooks sur la prise de décision.",
    tags: ["Écriture", "Design éditorial"],
    emoji: "📚",
  },
  {
    id: "programme-traction",
    titre: "Programme Traction",
    categorie: "Accompagnement",
    description: "Un parcours de 12 semaines conçu pour des entrepreneures qui lancent leur première offre.",
    tags: ["Coaching", "Business"],
    emoji: "🚀",
  },
  {
    id: "ateliers-abidjan",
    titre: "Ateliers d'Abidjan",
    categorie: "Événement",
    description: "Six ateliers en présentiel réunissant 240 participantes autour de l'organisation du travail.",
    tags: ["Événementiel", "Formation"],
    emoji: "🎤",
  },
  {
    id: "podcast-batir",
    titre: "Podcast « Bâtir »",
    categorie: "Média",
    description: "Vingt épisodes d'entretiens avec des femmes qui construisent leur activité en Afrique de l'Ouest.",
    tags: ["Audio", "Contenu"],
    emoji: "🎧",
  },
  {
    id: "newsletter-lundi",
    titre: "Lettre du lundi",
    categorie: "Média",
    description: "Une lettre hebdomadaire lue par 4 200 abonnés, avec un taux d'ouverture de 52 %.",
    tags: ["Écriture", "Communauté"],
    emoji: "✉️",
  },
  {
    id: "mentorat-jeunes",
    titre: "Mentorat jeunes talents",
    categorie: "Accompagnement",
    description: "Un programme bénévole de mentorat pour trente étudiantes en fin de cursus.",
    tags: ["Mentorat", "Impact"],
    emoji: "🌱",
  },
];

export const COMMUNITY_POSTS = [
  {
    id: "p1",
    auteur: "Aïcha K.",
    role: "Membre de la communauté",
    avatar: "🌸",
    date: "il y a 2 heures",
    contenu:
      "J'ai terminé le chapitre sur les décisions difficiles ce matin. Trois pages qui m'ont fait revoir toute ma semaine. Merci pour cette clarté !",
    likes: 34,
    commentaires: 6,
  },
  {
    id: "p2",
    auteur: "Prisca A.",
    role: "Experte Help Life Building",
    avatar: "👩🏽‍💻",
    date: "hier",
    contenu:
      "Petit rappel : la lecture se fait entièrement en ligne et votre progression vous suit d'un appareil à l'autre. Reprenez exactement là où vous vous êtes arrêtée.",
    likes: 87,
    commentaires: 12,
  },
  {
    id: "p3",
    auteur: "Bintou D.",
    role: "Membre de la communauté",
    avatar: "✨",
    date: "il y a 3 jours",
    contenu:
      "Atelier de vendredi : j'ai enfin écrit mon offre en une phrase. Deux clientes signées depuis. Je recommande les yeux fermés.",
    likes: 51,
    commentaires: 9,
  },
];

export const COMMUNITY_EVENTS = [
  { titre: "Webinaire : écrire son premier ebook", date: "Demain, 14 h", participants: 156 },
  { titre: "Atelier productivité", date: "Vendredi, 10 h", participants: 89 },
  { titre: "Questions / réponses avec la fondatrice", date: "Samedi, 16 h", participants: 234 },
];

export const TOP_MEMBERS = [
  { nom: "Aïcha K.", avatar: "🌸", points: 1240 },
  { nom: "Bintou D.", avatar: "✨", points: 980 },
  { nom: "Marlène T.", avatar: "🌿", points: 845 },
  { nom: "Fatou S.", avatar: "🔥", points: 712 },
];

export const COMMUNITY_STATS = [
  { icon: Users, value: "1 480", label: "Membres actifs" },
  { icon: Sparkles, value: "320", label: "Publications ce mois" },
  { icon: Star, value: "4,9", label: "Note moyenne" },
  { icon: Award, value: "12", label: "Événements par an" },
];

export const RDV_SERVICES = SERVICES.map((s) => ({
  id: s.id,
  nom: s.titre,
  duree: s.id === "atelier" ? 180 : 60,
  prix: s.prix,
}));

export const CRENEAUX = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
