import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Heart, MessageCircle, Send, Trophy } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBanner } from "@/components/page-banner";
import { useSession } from "@/hooks/use-session";
import { COMMUNITY_EVENTS, COMMUNITY_POSTS, COMMUNITY_STATS, TOP_MEMBERS } from "@/lib/site-content";

export const Route = createFileRoute("/communaute")({
  head: () => ({
    meta: [
      { title: "Communauté des lectrices | Help Life Building" },
      {
        name: "description",
        content:
          "Rejoignez la communauté Help Life Building : échanges entre lectrices, ateliers en direct et rendez-vous mensuels.",
      },
      { property: "og:title", content: "Communauté des lectrices | Help Life Building" },
      { property: "og:description", content: "Échangez, apprenez et avancez avec les lectrices Help Life Building." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunautePage,
});

function CommunautePage() {
  const { user } = useSession();
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  function publish() {
    if (!draft.trim()) return;
    setDraft("");
    toast.success("Merci ! Votre message est en attente de validation.");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBanner
        kicker="Ensemble"
        title="Notre communauté"
        subtitle="Échangez, apprenez et avancez ensemble, entre lectrices et lecteurs de la maison."
      />

      <main className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COMMUNITY_STATS.map((stat) => (
            <div key={stat.label} className="glass-panel p-5 text-center">
              <span className="bg-primary inline-flex size-11 items-center justify-center rounded-2xl text-primary-foreground">
                <stat.icon className="size-5" aria-hidden />
              </span>
              <p className="mt-3 font-display text-2xl font-semibold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="premium-card p-6">
              <div className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-2xl" aria-hidden>
                  {user ? "🙂" : "👤"}
                </span>
                <div className="flex-1">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    placeholder="Partagez une lecture, une question, une victoire…"
                    className="w-full resize-none rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-brand/40"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {user ? "Vous publiez sous votre compte." : "Connectez-vous pour publier sous votre nom."}
                    </p>
                    <button
                      type="button"
                      onClick={publish}
                      disabled={!draft.trim()}
                      className="bg-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <Send className="size-4" aria-hidden />
                      Publier
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {COMMUNITY_POSTS.map((post) => {
              const isLiked = liked[post.id];
              return (
                <article key={post.id} className="premium-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-2xl" aria-hidden>
                      {post.avatar}
                    </span>
                    <div>
                      <p className="font-semibold">{post.auteur}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.role} • {post.date}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{post.contenu}</p>
                  <div className="mt-5 flex items-center gap-5 border-t border-border/60 pt-4 text-sm">
                    <button
                      type="button"
                      onClick={() => setLiked((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className={`inline-flex items-center gap-2 font-semibold transition-colors ${
                        isLiked ? "text-brand-strong" : "text-muted-foreground hover:text-brand-strong"
                      }`}
                    >
                      <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} aria-hidden />
                      {post.likes + (isLiked ? 1 : 0)}
                    </button>
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <MessageCircle className="size-4" aria-hidden />
                      {post.commentaires} commentaires
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-6">
            <div className="premium-card p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Calendar className="size-4 text-brand" aria-hidden />
                Prochains rendez-vous
              </h2>
              <ul className="mt-4 space-y-4">
                {COMMUNITY_EVENTS.map((event) => (
                  <li key={event.titre} className="rounded-2xl bg-secondary/70 p-4">
                    <p className="font-semibold">{event.titre}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.date} • {event.participants} inscrits
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                to="/rdv"
                className="bg-primary mt-5 flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md"
              >
                Réserver ma place
              </Link>
            </div>

            <div className="premium-card p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Trophy className="size-4 text-gold" aria-hidden />
                Membres les plus actifs
              </h2>
              <ul className="mt-4 space-y-3">
                {TOP_MEMBERS.map((member, index) => (
                  <li key={member.nom} className="flex items-center gap-3">
                    <span className="w-5 text-sm font-bold text-muted-foreground">{index + 1}</span>
                    <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-lg" aria-hidden>
                      {member.avatar}
                    </span>
                    <span className="flex-1 text-sm font-medium">{member.nom}</span>
                    <span className="text-sm font-semibold text-brand-strong">{member.points} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
