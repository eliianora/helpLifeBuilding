import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  adminDeleteEbook,
  adminListEbooks,
  adminSaveEbook,
  adminUploadEbookPdf,
} from "@/lib/admin.functions";
import { slugify } from "@/lib/admin";
import { adminLegacyList } from "@/lib/admin-legacy.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/ebooks")({
  head: () => ({ meta: [{ title: "Ebooks — Admin" }] }),
  component: AdminEbooks,
});

type EbookForm = {
  id?: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  category: string;
  category_id: string;
  cover_key: string;
  fichier_url: string;
  price_label: string;
  price_amount: number;
  pages: number;
  reading_minutes: number;
  position: number;
  published: boolean;
};

const emptyForm = (): EbookForm => ({
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  category: "",
  category_id: "",
  cover_key: "",
  fichier_url: "",
  price_label: "4 500 FCFA",
  price_amount: 4500,
  pages: 80,
  reading_minutes: 90,
  position: 0,
  published: false,
});

function AdminEbooks() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<EbookForm | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-resource", "categoriesEbooks"],
    queryFn: () => adminLegacyList({ data: { resource: "categoriesEbooks" } }),
  });
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-ebooks"],
    queryFn: () => adminListEbooks(),
  });

  const save = useMutation({
    mutationFn: async (payload: EbookForm) => {
      let uploadedPath: string | null = null;
      if (pdfFile) {
        if (pdfFile.size > 50 * 1024 * 1024) {
          throw new Error("Le PDF ne doit pas dépasser 50 Mo.");
        }
        const buffer = await pdfFile.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
        }
        const base64 = btoa(binary);
        const uploaded = await adminUploadEbookPdf({
          data: {
            fileName: pdfFile.name,
            base64,
            slugHint: payload.slug || payload.title,
          },
        });
        uploadedPath = uploaded.path;
      }

      try {
        const saved = await adminSaveEbook({
          data: {
            id: payload.id,
            title: payload.title,
            slug: payload.slug || slugify(payload.title),
            subtitle: payload.subtitle || null,
            description: payload.description,
            category: payload.category || null,
            category_id: payload.category_id || null,
            cover_key: payload.cover_key || null,
            fichier_url: uploadedPath || payload.fichier_url || null,
            price_label: payload.price_label,
            price_amount: Number(payload.price_amount),
            pages: Number(payload.pages),
            reading_minutes: Number(payload.reading_minutes),
            position: Number(payload.position),
            published: payload.published,
          },
        });
        return { saved, uploadedPath, previousPath: payload.fichier_url };
      } catch (caught) {
        if (uploadedPath) await supabase.storage.from("ebooks").remove([uploadedPath]);
        throw caught;
      }
    },
    onSuccess: async ({ uploadedPath, previousPath }) => {
      if (uploadedPath && previousPath && !previousPath.startsWith("http")) {
        await supabase.storage.from("ebooks").remove([previousPath]);
      }
      toast.success("Ebook enregistré.");
      setForm(null);
      setPdfFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-ebooks"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminDeleteEbook({ data: { id } }),
    onSuccess: () => {
      toast.success("Ebook supprimé.");
      queryClient.invalidateQueries({ queryKey: ["admin-ebooks"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
            Ebooks
          </h1>
          <p className="mt-2 text-muted-foreground">
            Publiez et mettez à jour le catalogue.
          </p>
        </div>
        <Button onClick={() => {
          setPdfFile(null);
          setForm(emptyForm());
        }}>Nouvel ebook</Button>
      </div>
      <span className="mt-4 mb-8 block h-0.5 w-14 bg-primary" aria-hidden />

      {error ? (
        <p className="mb-4 text-sm text-destructive">{error.message}</p>
      ) : null}
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}

      {!isLoading && !error && data.length === 0 ? (
        <p className="border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground">
          Aucun ebook. Créez le premier avec le bouton ci-dessus.
        </p>
      ) : null}

      {data.length ? (
        <div className="overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-secondary text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">PDF</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.map((ebook) => (
                <tr key={ebook.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{ebook.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {ebook.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">{ebook.price_label}</td>
                  <td className="px-4 py-3">{ebook.fichier_url ? "Chargé" : "—"}</td>
                  <td className="px-4 py-3">
                    {ebook.published ? "Publié" : "Brouillon"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPdfFile(null);
                        setForm({
                          id: ebook.id,
                          title: ebook.title,
                          slug: ebook.slug,
                          subtitle: ebook.subtitle ?? "",
                          description: ebook.description ?? "",
                          category: ebook.category ?? "",
                          category_id: ebook.categorie_eb_id ?? "",
                          cover_key: ebook.cover_key ?? "",
                          fichier_url: ebook.fichier_url ?? "",
                          price_label: ebook.price_label,
                          price_amount: ebook.prix ?? 0,
                          pages: ebook.pages,
                          reading_minutes: ebook.reading_minutes,
                          position: ebook.position,
                          published: ebook.published,
                        });
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={remove.isPending}
                      onClick={() => {
                        if (confirm(`Supprimer « ${ebook.title} » ?`))
                          remove.mutate(ebook.id);
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
          className="premium-card mt-8 grid gap-4 p-6 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate(form);
          }}
        >
          <h2 className="font-display text-xl font-extrabold uppercase md:col-span-2">
            {form.id ? "Modifier l'ebook" : "Nouvel ebook"}
          </h2>
          <Field label="Titre">
            <Input
              required
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                  slug: form.id ? form.slug : slugify(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Slug">
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </Field>
          <Field label="Sous-titre">
            <Input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </Field>
          <Field label="Catégorie">
            <select
              className="h-10 w-full border border-input bg-white px-3 text-sm"
              value={form.category_id}
              onChange={(event) => {
                const selected = categories.find((row) => String(row.id) === event.target.value);
                setForm({
                  ...form,
                  category_id: event.target.value,
                  category: selected ? String(selected.nom ?? "") : "",
                });
              }}
            >
              <option value="">Sans catégorie</option>
              {categories.map((category) => (
                <option key={String(category.id)} value={String(category.id)}>
                  {String(category.nom)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Prix affiché">
            <Input
              value={form.price_label}
              onChange={(e) =>
                setForm({ ...form, price_label: e.target.value })
              }
            />
          </Field>
          <Field label="Prix facturé (FCFA)">
            <Input
              type="number"
              min={0}
              required
              value={form.price_amount}
              onChange={(e) =>
                setForm({ ...form, price_amount: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Clé de couverture">
            <Input
              value={form.cover_key}
              onChange={(e) => setForm({ ...form, cover_key: e.target.value })}
            />
          </Field>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ebook-pdf">Fichier PDF</Label>
            <label
              htmlFor="ebook-pdf"
              className="flex cursor-pointer items-center gap-3 border border-dashed border-primary/40 bg-primary/5 px-4 py-5 text-sm transition-colors hover:bg-primary/10"
            >
              <Upload className="size-5 text-primary" aria-hidden />
              <span>
                {pdfFile
                  ? `${pdfFile.name} (${(pdfFile.size / 1024 / 1024).toFixed(1)} Mo)`
                  : form.fichier_url
                    ? "Remplacer le PDF actuellement chargé"
                    : "Choisir un PDF depuis l’ordinateur (50 Mo maximum)"}
              </span>
            </label>
            <input
              id="ebook-pdf"
              className="sr-only"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
            />
            {form.fichier_url ? (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="size-4" aria-hidden />
                PDF enregistré : {form.fichier_url.split("/").at(-1)}
              </p>
            ) : null}
          </div>
          <Field label="Pages">
            <Input
              type="number"
              min={1}
              value={form.pages}
              onChange={(e) =>
                setForm({ ...form, pages: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Minutes de lecture">
            <Input
              type="number"
              min={1}
              value={form.reading_minutes}
              onChange={(e) =>
                setForm({ ...form, reading_minutes: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Ordre d'affichage">
            <Input
              type="number"
              min={0}
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: Number(e.target.value) })
              }
            />
          </Field>
          <label className="flex items-center gap-2 text-sm font-semibold md:col-span-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
            />
            Publié
          </label>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              className="mt-2 min-h-28"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="flex gap-3 md:col-span-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Envoi et enregistrement…" : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPdfFile(null);
                setForm(null);
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
