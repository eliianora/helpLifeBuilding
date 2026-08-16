import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  adminDeleteChapter,
  adminListChapters,
  adminListEbooks,
  adminSaveChapter,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/chapitres")({
  head: () => ({ meta: [{ title: "Chapitres — Admin" }] }),
  component: AdminChapters,
});

type ChapterForm = {
  id?: string;
  ebook_id: string;
  title: string;
  position: number;
  is_preview: boolean;
  content: string;
};

function AdminChapters() {
  const queryClient = useQueryClient();
  const { data: ebooks = [] } = useQuery({
    queryKey: ["admin-ebooks"],
    queryFn: () => adminListEbooks(),
  });
  const [ebookId, setEbookId] = useState<string>("");
  const selectedId = ebookId || ebooks[0]?.id || "";
  const [form, setForm] = useState<ChapterForm | null>(null);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-chapters", selectedId],
    queryFn: () => adminListChapters({ data: { ebookId: selectedId } }),
    enabled: Boolean(selectedId),
  });

  const nextPosition = useMemo(() => (data.at(-1)?.position ?? 0) + 1, [data]);

  const save = useMutation({
    mutationFn: (payload: ChapterForm) =>
      adminSaveChapter({
        data: {
          id: payload.id,
          ebook_id: payload.ebook_id,
          title: payload.title,
          position: Number(payload.position),
          is_preview: payload.is_preview,
          content: payload.content,
        },
      }),
    onSuccess: (_result, payload) => {
      toast.success("Chapitre enregistré.");
      setForm(null);
      queryClient.invalidateQueries({
        queryKey: ["admin-chapters", payload.ebook_id],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteChapter({ data: { id } }),
    onSuccess: () => {
      toast.success("Chapitre supprimé.");
      queryClient.invalidateQueries({
        queryKey: ["admin-chapters", selectedId],
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
            Chapitres
          </h1>
          <p className="mt-2 text-muted-foreground">
            Rédigez le texte et marquez les extraits gratuits.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="h-10 border border-input bg-white px-3 text-sm"
            value={selectedId}
            onChange={(e) => {
              setEbookId(e.target.value);
              setForm(null);
            }}
          >
            {ebooks.map((ebook) => (
              <option key={ebook.id} value={ebook.id}>
                {ebook.title}
              </option>
            ))}
          </select>
          <Button
            disabled={!selectedId}
            onClick={() =>
              setForm({
                ebook_id: selectedId,
                title: "",
                position: nextPosition,
                is_preview: false,
                content: "",
              })
            }
          >
            Nouveau chapitre
          </Button>
        </div>
      </div>
      <span className="mt-4 mb-8 block h-0.5 w-14 bg-primary" aria-hidden />

      {error ? (
        <p className="mb-4 text-sm text-destructive">{error.message}</p>
      ) : null}
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}

      {!selectedId ? (
        <p className="border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground">
          Créez d’abord un ebook avant d’ajouter des chapitres.
        </p>
      ) : !isLoading && !error && data.length === 0 ? (
        <p className="border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground">
          Aucun chapitre pour cet ebook.
        </p>
      ) : null}

      {data.length ? (
        <div className="overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-secondary text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Extrait</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.map((chapter) => (
                <tr key={chapter.id} className="border-t border-border">
                  <td className="px-4 py-3">{chapter.position}</td>
                  <td className="px-4 py-3 font-semibold">{chapter.title}</td>
                  <td className="px-4 py-3">
                    {chapter.is_preview ? "Oui" : "Non"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setForm(chapter)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={remove.isPending}
                      onClick={() => {
                        if (confirm(`Supprimer « ${chapter.title} » ?`))
                          remove.mutate(chapter.id);
                      }}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {form ? (
        <form
          className="premium-card mt-8 space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate(form);
          }}
        >
          <h2 className="font-display text-xl font-extrabold uppercase">
            {form.id ? "Modifier le chapitre" : "Nouveau chapitre"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                type="number"
                min={1}
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.is_preview}
              onChange={(e) =>
                setForm({ ...form, is_preview: e.target.checked })
              }
            />
            Extrait gratuit
          </label>
          <div className="space-y-2">
            <Label>Contenu</Label>
            <Textarea
              className="min-h-48"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={save.isPending}>
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm(null)}
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
