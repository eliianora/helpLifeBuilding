import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import {
  BookOpen,
  BookText,
  Briefcase,
  Calendar,
  Code,
  CreditCard,
  FileText,
  FolderOpen,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserRole } from "@/lib/admin";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";

const MENU = [
  {
    label: "Tableau de bord",
    to: "/admin" as const,
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Ebooks",
    to: "/admin/ebooks" as const,
    icon: BookOpen,
    exact: false,
  },
  {
    label: "Chapitres",
    to: "/admin/chapitres" as const,
    icon: FileText,
    exact: false,
  },
  {
    label: "Lecteurs",
    to: "/admin/lecteurs" as const,
    icon: Users,
    exact: false,
  },
  {
    label: "Auteurs",
    to: "/admin/auteurs" as const,
    icon: BookText,
    exact: false,
  },
  {
    label: "Catégories Ebooks",
    to: "/admin/categories_e" as const,
    icon: Tag,
    exact: false,
  },
  {
    label: "Services",
    to: "/admin/services" as const,
    icon: Briefcase,
    exact: false,
  },
  {
    label: "Projets",
    to: "/admin/projets" as const,
    icon: FolderOpen,
    exact: false,
  },
  {
    label: "Catégories Projet",
    to: "/admin/categories_p" as const,
    icon: Layers,
    exact: false,
  },
  {
    label: "Langages",
    to: "/admin/langages" as const,
    icon: Code,
    exact: false,
  },
  {
    label: "Bande Info",
    to: "/admin/bande_inf" as const,
    icon: Megaphone,
    exact: false,
  },
  {
    label: "Paiements",
    to: "/admin/paiements" as const,
    icon: CreditCard,
    exact: false,
  },
  {
    label: "Paniers",
    to: "/admin/paniers" as const,
    icon: ShoppingCart,
    exact: false,
  },
  {
    label: "Rendez-vous",
    to: "/admin/rdv" as const,
    icon: Calendar,
    exact: false,
  },
];

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { redirect: location.pathname } });
    }
    const role = await fetchUserRole(data.user.id);
    if (role !== "admin") {
      throw redirect({ to: "/bibliotheque" });
    }
    return { user: data.user, role };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-ink text-ink-foreground md:sticky md:top-0 md:flex">
        <div className="border-b border-white/10 bg-white px-4 py-4">
          <SiteLogo height={36} />
        </div>
        <p className="px-5 pt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          Administration
        </p>
        <nav className="mt-3 flex-1 space-y-1 px-3">
          {MENU.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "bg-primary text-white" }}
              inactiveProps={{
                className: "text-ink-muted hover:bg-white/10 hover:text-white",
              }}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold uppercase tracking-wide"
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-ink-muted hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" aria-hidden />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 md:hidden">
          <SiteLogo height={32} />
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sortir
          </Button>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-border bg-white px-4 py-2 md:hidden">
          {MENU.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "bg-primary text-white" }}
              inactiveProps={{ className: "bg-secondary text-foreground" }}
              className="shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
