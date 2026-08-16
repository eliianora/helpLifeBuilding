/** Lecture unifiée des variables Supabase (Vite + SSR Nitro). */
export function getSupabasePublicEnv() {
  const viteUrl = typeof import.meta !== "undefined" ? import.meta.env?.VITE_SUPABASE_URL : undefined;
  const viteKey =
    typeof import.meta !== "undefined" ? import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY : undefined;

  const proc = typeof process !== "undefined" ? process.env : undefined;

  const url =
    (viteUrl as string | undefined) ||
    proc?.SUPABASE_URL ||
    proc?.VITE_SUPABASE_URL ||
    proc?.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    (viteKey as string | undefined) ||
    proc?.SUPABASE_PUBLISHABLE_KEY ||
    proc?.VITE_SUPABASE_PUBLISHABLE_KEY ||
    proc?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url: url?.trim() || undefined,
    key: key?.trim() || undefined,
  };
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabasePublicEnv();
  return Boolean(url && key);
}

export function authRedirectTo(path = "/auth/callback") {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${path}`;
}

export function mapAuthError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  const message = raw.toLowerCase();

  if (message.includes("fetch failed") || message.includes("failed to fetch") || message.includes("network")) {
    return "Impossible de joindre Supabase. Vérifiez SUPABASE_URL dans .env.local (le projet doit exister et être actif).";
  }
  if (message.includes("invalid login credentials") || message.includes("invalid_credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (message.includes("email not confirmed")) {
    return "Confirmez votre adresse email avant de vous connecter.";
  }
  if (message.includes("user already registered") || message.includes("already registered")) {
    return "Un compte existe déjà avec cet email. Connectez-vous.";
  }
  if (message.includes("password should be") || message.includes("password is known")) {
    return "Le mot de passe est trop court ou trop faible (6 caractères minimum).";
  }
  if (message.includes("unsupported provider") || message.includes("provider is not enabled")) {
    return "La connexion Google n'est pas activée dans le dashboard Supabase (Authentication > Providers).";
  }
  if (message.includes("missing supabase")) {
    return "Les identifiants Supabase manquent. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.";
  }
  return raw || "Une erreur est survenue.";
}
