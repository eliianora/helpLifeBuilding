import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight, Library } from "lucide-react";

import { getReaderBook, saveProgress } from "@/lib/library.functions";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/lecture/$slug")({
  head: () => ({
    meta: [
      { title: "Lecture en ligne — Prisca Brou" },
      { name: "description", content: "Lecteur en ligne sécurisé de votre bibliothèque." },
      { property: "og:title", content: "Lecture en ligne — Prisca Brou" },
      { property: "og:description", content: "Lecteur en ligne sécurisé de votre bibliothèque." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReaderPage,
});

function ReaderPage() {
  const { slug } = Route.useParams();
  const fetchBook = useServerFn(getReaderBook);
  const persist = useServerFn(saveProgress);

  const { data, isLoading, error } = useQuery({
    queryKey: ["reader", slug],
    queryFn: () => fetchBook({ data: { slug } }),
  });

  const [index, setIndex] = useState(0);
  const [scrolled, setScrolled] = useState(0);
  const initialised = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const chapters = data?.hasAccess ? data.chapters : [];
  const total = chapters.length;
  const current = chapters[index];
  const overallPercent = total
    ? Math.min(100, Math.round(((index + scrolled) / total) * 100))
    : 0;

  useEffect(() => {
    if (initialised.current || !data?.hasAccess || !data.progress || total === 0) return;
    initialised.current = true;
    const target = chapters.findIndex((c) => c.position === data.progress?.chapter_position);
    if (target >= 0) setIndex(target);
  }, [data, chapters, total]);

  useEffect(() => {
    function onScroll() {
      const node = contentRef.current;
      if (!node) return;
      const start = node.offsetTop;
      const height = node.offsetHeight - window.innerHeight;
      if (height <= 0) return setScrolled(1);
      setScrolled(Math.max(0, Math.min(1, (window.scrollY - start) / height)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [index, total]);

  const save = useCallback(
    (chapterPosition: number, percent: number) => {
      persist({ data: { slug, chapterPosition, percent } }).catch(() => {});
    },
    [persist, slug],
  );

  useEffect(() => {
    if (!current || !data?.hasAccess) return;
    const timer = setTimeout(() => save(current.position, overallPercent), 1200);
    return () => clearTimeout(timer);
  }, [current, overallPercent, save, data]);

  function goTo(next: number) {
    setIndex(next);
    setScrolled(0);
    window.scrollTo({ top: 0 });
  }

  if (isLoading) {
    return <ReaderShell>Chargement de votre livre…</ReaderShell>;
  }
  if (error || !data) {
    return <ReaderShell>Ce livre n'a pas pu être ouvert.</ReaderShell>;
  }
  if (!data.hasAccess) {
    return (
      <ReaderShell>
        <p className="font-display text-xl">Ce livre n'est pas dans votre bibliothèque.</p>
        <Button asChild className="mt-5">
          <Link to="/ebooks/$slug" params={{ slug }}>
            Voir la fiche du livre
          </Link>
        </Button>
      </ReaderShell>
    );
  }
  if (data.pdfUrl) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="border-b border-border bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
            <Link
              to="/bibliotheque"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Library className="size-4" aria-hidden /> Bibliothèque
            </Link>
            <p className="truncate text-sm font-semibold">{data.ebook.title}</p>
          </div>
        </div>
        <main className="mx-auto max-w-6xl px-3 py-4 sm:px-5">
          <iframe
            title={`Lecture de ${data.ebook.title}`}
            src={`${data.pdfUrl}#toolbar=0&navpanes=0`}
            referrerPolicy="no-referrer"
            className="h-[calc(100vh-10rem)] min-h-[640px] w-full border border-border bg-white"
          />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Exemplaire personnel de {data.email} — lecture en ligne, reproduction interdite.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="sticky top-16 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-3">
          <Link
            to="/bibliotheque"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Library className="size-4" aria-hidden /> Bibliothèque
          </Link>
          <div className="flex-1">
            <Progress value={overallPercent} />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{overallPercent}%</span>
        </div>
      </div>

      <main
        className="relative mx-auto max-w-3xl px-5 py-12"
        onContextMenu={(event) => event.preventDefault()}
        onCopy={(event) => event.preventDefault()}
      >
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{data.ebook.title}</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight">
          {current?.position}. {current?.title}
        </h1>

        <div ref={contentRef} className="prose-reader no-select relative mt-8 space-y-6 text-foreground/90">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-2xl font-medium text-foreground/[0.04] select-none"
          >
            {data.email}
          </span>
          {current?.content.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <nav className="mt-14 flex items-center justify-between gap-4 border-t border-border/60 pt-6">
          <Button variant="outline" disabled={index === 0} onClick={() => goTo(index - 1)}>
            <ChevronLeft className="size-4" aria-hidden /> Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Chapitre {index + 1} / {total}
          </span>
          <Button disabled={index >= total - 1} onClick={() => goTo(index + 1)}>
            Suivant <ChevronRight className="size-4" aria-hidden />
          </Button>
        </nav>

        <ol className="mt-12 space-y-2 text-sm">
          {chapters.map((chapter, i) => (
            <li key={chapter.position}>
              <button
                type="button"
                onClick={() => goTo(i)}
                className={`w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-secondary ${
                  i === index ? "bg-secondary font-medium" : "text-muted-foreground"
                }`}
              >
                {chapter.position}. {chapter.title}
              </button>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Exemplaire personnel de {data.email} — lecture en ligne, reproduction interdite.
        </p>
      </main>
    </div>
  );
}

function ReaderShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-24 text-center text-muted-foreground">{children}</main>
    </div>
  );
}