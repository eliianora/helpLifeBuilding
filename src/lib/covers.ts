import coverClarte from "@/assets/cover-clarte.jpg";
import coverTraction from "@/assets/cover-traction.jpg";
import coverLettres from "@/assets/cover-lettres.jpg";

const COVERS: Record<string, string> = {
  clarte: coverClarte,
  traction: coverTraction,
  lettres: coverLettres,
};

export function coverFor(key: string | null | undefined): string {
  return (key && COVERS[key]) || coverClarte;
}

export const FOUNDER = {
  name: "Prisca Brou",
  role: "Anthropologue, coach & fondatrice",
  honor: "Docteur Honoris Causa d'université · Mère de 4 enfants",
  tagline:
    "Elle croit en une éducation des adultes ancrée dans l'innovation sociale et la participation communautaire, comme levier d'autonomie, de résilience et de développement durable.",
  bio: "Anthropologue et spécialiste en innovation sociale, recherche et développement, avec 16 années d'expérience dans la conception et l'évaluation de programmes d'apprentissage socio-émotionnels et technologiques en Afrique.",
  longBio:
    "Responsable de la cartographie des solutions innovantes au sein d'une institution internationale et ancienne Conseillère Technique Éducation à l'IRC, Prisca Brou est écrivaine, conférencière et coach en éducation parentale, bien-être mental et émotionnel. Elle forme et accompagne les entreprises, les familles, les femmes et les adolescents sur la résilience affective et émotionnelle, les compétences de vie courante, la santé sexuelle et reproductive et le leadership personnel. Reconnue pour sa capacité à fédérer les acteurs, structurer des dispositifs d'impact et accompagner des dynamiques de changement, elle est engagée pour la transformation sociale : changer le monde en transformant d'abord son environnement.",
  vision:
    "Engagée pour la transformation sociale, elle œuvre à changer le monde en transformant d'abord son environnement.",
};