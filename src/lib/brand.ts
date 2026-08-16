import { BookOpen, Clock, Heart, Lock, PartyPopper, Star } from "lucide-react";

export const BRAND = {
  name: "Help Life Building",
  kicker: "Your life coaching",
  promise:
    "Coaching de vie, ebooks et ateliers pour le bien-être mental, l'éducation parentale, la résilience et le leadership personnel.",
  email: "coachprisca@gmail.com",
  phone: "+225 07 15 93 93 21",
  city: "Abidjan, Côte d'Ivoire",
};

export const MARQUEE_ITEMS = [
  { icon: PartyPopper, text: "Nouveau — ebooks, coaching parental et ateliers bien-être en ligne", to: "/ebooks" as const },
  { icon: Heart, text: "16 années d'innovation sociale et d'apprentissage socio-émotionnel en Afrique", to: "/a-propos" as const },
  { icon: BookOpen, text: "Chaque livre s'ouvre sur un extrait gratuit, sans compte", to: "/ebooks" as const },
  { icon: Lock, text: "Lecture 100 % en ligne — aucun fichier à télécharger", to: "/ebooks" as const },
  { icon: Star, text: "Entreprises, familles, femmes et adolescents : un accompagnement sur mesure", to: "/services" as const },
];

export const STATS = [
  { icon: Heart, value: "16 ans", label: "D'expérience en Afrique" },
  { icon: BookOpen, value: "3", label: "Ebooks disponibles" },
  { icon: Star, value: "4", label: "Publics accompagnés" },
  { icon: Clock, value: "24/7", label: "Accès à votre bibliothèque" },
];
