/**
 * Palette extraite de public/logo2.png (Help Life Building).
 * Violet = marque · Jaune = énergie / CTA · Corail & pêche = chaleur humaine.
 */
export const LOGO_COLORS = {
  /** Texte « Help Life Building » et nuage */
  purple: "#9B4FD4",
  /** Violet profond — hover, titres forts */
  purpleDark: "#6E2FA8",
  /** Nuage / fonds doux */
  purpleSoft: "#C8AAE6",
  /** Fonds de section très légers */
  purpleMuted: "#EDE4F7",
  /** Échelle + soleil du logo */
  yellow: "#FFEB00",
  /** Jaune assombri pour texte sur fond clair */
  yellowDeep: "#C9A800",
  /** Hémisphère droit du cerveau */
  coral: "#E07A72",
  /** Hémisphère gauche du cerveau */
  peach: "#F2C4B0",
  /** Mains — ton peau / accueil */
  sand: "#F5E6D8",
  /** Tagline « YOUR LIFE COACHING » */
  ink: "#1E1B2E",
} as const;

export type LogoColorKey = keyof typeof LOGO_COLORS;
