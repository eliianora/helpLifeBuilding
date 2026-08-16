import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { resolvePostLoginPath } from "@/lib/admin";
import { authRedirectTo, isSupabaseConfigured, mapAuthError } from "@/lib/supabase-env";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthSearch = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect:
      typeof search.redirect === "string" && search.redirect.startsWith("/") ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Connexion — Prisca Brou" },
      {
        name: "description",
        content: "Connectez-vous pour accéder à votre bibliothèque et reprendre votre lecture en ligne.",
      },
      { property: "og:title", content: "Connexion — Prisca Brou" },
      { property: "og:description", content: "Accédez à votre bibliothèque de lecture en ligne." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseConfigured();

  const destination = search.redirect;

  useEffect(() => {
    if (sessionLoading || !user) return;
    let cancelled = false;
    resolvePostLoginPath(user.id, destination).then((path) => {
      if (!cancelled) navigate({ to: path, replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [sessionLoading, user, destination, navigate]);

  async function ensureProfile(userId: string, displayName?: string, email?: string) {
    const { data: existing } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
    const display_name = displayName?.trim() || null;
    const nextEmail = email || null;
    if (existing) {
      await supabase
        .from("profiles")
        .update({
          ...(display_name ? { display_name } : {}),
          ...(nextEmail ? { email: nextEmail } : {}),
        })
        .eq("id", userId);
      return;
    }
    await supabase.from("profiles").insert({
      id: userId,
      display_name,
      email: nextEmail,
      role: "client",
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured) {
      toast.error(mapAuthError(new Error("Missing Supabase")));
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authRedirectTo(),
            data: { display_name: name },
          },
        });
        if (error) throw error;
        if (data.user && data.session) {
          await ensureProfile(data.user.id, name, data.user.email ?? email).catch(() => undefined);
          toast.success("Compte créé. Bienvenue !");
          navigate({ to: await resolvePostLoginPath(data.user.id, destination) });
          return;
        }
        toast.success("Compte créé. Vérifiez votre email pour confirmer l'inscription, puis connectez-vous.");
        setMode("signin");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        await ensureProfile(data.user.id, data.user.user_metadata?.display_name, data.user.email ?? email).catch(
          () => undefined,
        );
      }
      toast.success("Connexion réussie.");
      navigate({ to: await resolvePostLoginPath(data.user?.id ?? "", destination) });
    } catch (error) {
      toast.error(mapAuthError(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    if (!configured) {
      toast.error(mapAuthError(new Error("Missing Supabase")));
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: authRedirectTo(),
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) throw error;
    } catch (error) {
      setBusy(false);
      toast.error(mapAuthError(error));
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-5 py-16">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight">
          {mode === "signin" ? "Content de vous revoir" : "Créer votre compte lecteur"}
        </h2>

        {!configured ? (
          <p className="mt-6 border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Supabase n'est pas configuré. Ajoutez <code>VITE_SUPABASE_URL</code> et{" "}
            <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> dans <code>.env.local</code>, puis relancez le serveur.
          </p>
        ) : null}

        <Button variant="outline" className="mt-8 normal-case tracking-normal" onClick={handleGoogle} disabled={busy || !configured}>
          Continuer avec Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          ou
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" ? (
            <div className="space-y-2">
              <Label htmlFor="name">Prénom</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <Button type="submit" variant="cta" className="cta-glow w-full" disabled={busy || !configured}>
            {busy ? "Patientez…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-6 text-sm text-muted-foreground underline underline-offset-4"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Pas encore de compte ? En créer un" : "J'ai déjà un compte"}
        </button>
      </main>
      <SiteFooter />
    </div>
  );
}
