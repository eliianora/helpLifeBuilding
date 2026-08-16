import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, LayoutDashboard, LibraryBig, LogIn, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { useAdmin } from "@/hooks/use-admin";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MAIN_NAV = [
  { label: "Accueil", to: "/" as const },
  { label: "Ebooks", to: "/ebooks" as const },
  { label: "Services", to: "/services" as const },
  { label: "Rendez-vous", to: "/rdv" as const },
];

const MORE_NAV = [
  { label: "Fondatrice", to: "/a-propos" as const },
  { label: "Portfolio", to: "/portfolio" as const },
  { label: "Communauté", to: "/communaute" as const },
];

const NAV = [...MAIN_NAV, ...MORE_NAV];

export function SiteHeader() {
  const { user, loading } = useSession();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-4 px-5">
        <SiteLogo height={46} />

        <nav className="hidden items-center gap-1 text-[13px] font-bold uppercase tracking-[0.08em] lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-foreground hover:text-primary" }}
              className="px-3 py-2 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 text-foreground transition-colors hover:text-primary">
              Plus
              <ChevronDown className="size-3.5" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-sm">
              {MORE_NAV.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link to={item.to} className="text-sm font-semibold uppercase tracking-wide">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-2 text-sm font-bold text-primary xl:flex"
          >
            <Phone className="size-4" aria-hidden />
            {BRAND.phone}
          </a>
          {loading ? null : user ? (
            <>
              {isAdmin ? (
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Link to="/admin">
                    <LayoutDashboard className="size-4" aria-hidden />
                    Admin
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/bibliotheque">
                  <LibraryBig className="size-4" aria-hidden />
                  Bibliothèque
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">
                <LogIn className="size-4" aria-hidden />
                Connexion
              </Link>
            </Button>
          )}
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1 text-sm font-bold uppercase tracking-[0.08em]">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                inactiveProps={{ className: "text-foreground" }}
                className="py-2.5"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link to="/admin" onClick={() => setOpen(false)} className="py-2.5 text-primary">
                Admin
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
