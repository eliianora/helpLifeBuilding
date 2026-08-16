import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { mapAuthError } from "@/lib/supabase-env";
import { resolvePostLoginPath } from "@/lib/admin";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" && search.redirect.startsWith("/") ? search.redirect : undefined,
    code: typeof search.code === "string" ? search.code : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
    error_description: typeof search.error_description === "string" ? search.error_description : undefined,
  }),
  head: () => ({
    meta: [{ title: "Connexion — Help Life Building" }],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Finalisation de la connexion…");

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      try {
        if (search.error || search.error_description) {
          throw new Error(search.error_description || search.error);
        }

        const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (search.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(search.code);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (!data.session) throw new Error("Session introuvable après redirection.");
        }

        if (cancelled) return;
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;
        toast.success("Connexion réussie.");
        navigate({
          to: userId ? await resolvePostLoginPath(userId, search.redirect) : "/bibliotheque",
          replace: true,
        });
      } catch (error) {
        if (cancelled) return;
        toast.error(mapAuthError(error));
        setStatus("Échec de la connexion");
        navigate({ to: "/auth", replace: true });
      }
    }

    void finish();
    return () => {
      cancelled = true;
    };
  }, [navigate, search.code, search.error, search.error_description, search.redirect]);

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{status}</p>
    </div>
  );
}
