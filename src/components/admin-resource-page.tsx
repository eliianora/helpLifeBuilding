import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
  adminLegacyDelete,
  adminLegacyList,
  adminLegacySave,
  type LegacyAdminResource,
} from "@/lib/admin-legacy.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Value = string | number | boolean | null | string[];
type Row = Record<string, Value>;

export type AdminField = {
  key: string;
  label: string;
  type?:
    "text" | "number" | "textarea" | "checkbox" | "select" | "date" | "time";
  required?: boolean;
  defaultValue?: Value;
  options?: Array<{ label: string; value: string }>;
};

export type AdminColumn = {
  key: string;
  label: string;
  format?: (value: Value, row: Row) => string;
};

type Props = {
  resource: LegacyAdminResource;
  title: string;
  description: string;
  fields: AdminField[];
  columns: AdminColumn[];
  allowCreate?: boolean;
  allowDelete?: boolean;
  editLabel?: string;
};

function emptyValues(fields: AdminField[]) {
  return Object.fromEntries(
    fields.map((field) => [
      field.key,
      field.defaultValue ??
        (field.type === "checkbox" ? false : field.type === "number" ? 0 : ""),
    ]),
  ) as Row;
}

function displayValue(value: Value) {
  if (value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (Array.isArray(value)) return value.join(", ") || "—";
  return String(value);
}

export function AdminResourcePage({
  resource,
  title,
  description,
  fields,
  columns,
  allowCreate = true,
  allowDelete = true,
  editLabel = "Modifier",
}: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["admin-resource", resource];
  const [form, setForm] = useState<{ id?: string; values: Row } | null>(null);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => adminLegacyList({ data: { resource } }),
  });

  const save = useMutation({
    mutationFn: (payload: { id?: string; values: Row }) =>
      adminLegacySave({
        data: { resource, id: payload.id, values: payload.values },
      }),
    onSuccess: () => {
      toast.success("Enregistrement effectué.");
      setForm(null);
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (caught: Error) => toast.error(caught.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminLegacyDelete({ data: { resource, id } }),
    onSuccess: () => {
      toast.success("Élément supprimé.");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (caught: Error) => toast.error(caught.message),
  });

  function edit(row: Row) {
    setForm({
      id: String(row.id),
      values: Object.fromEntries(
        fields.map((field) => [
          field.key,
          row[field.key] ?? emptyValues([field])[field.key],
        ]),
      ),
    });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        {allowCreate ? (
          <Button onClick={() => setForm({ values: emptyValues(fields) })}>
            Ajouter
          </Button>
        ) : null}
      </div>
      <span className="mt-4 mb-8 block h-0.5 w-14 bg-primary" aria-hidden />

      {error ? (
        <p className="mb-5 border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error.message}
        </p>
      ) : null}
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}

      {!isLoading && !error && data.length === 0 ? (
        <p className="border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground">
          Aucun élément pour le moment.
        </p>
      ) : null}

      {data.length ? (
        <div className="overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-secondary text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3">
                    {column.label}
                  </th>
                ))}
                {fields.length || allowDelete ? (
                  <th className="px-4 py-3 text-right">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={String(row.id)} className="border-t border-border">
                  {columns.map((column) => (
                    <td key={column.key} className="max-w-xs px-4 py-3">
                      {column.format
                        ? column.format(row[column.key] ?? null, row)
                        : displayValue(row[column.key] ?? null)}
                    </td>
                  ))}
                  {fields.length || allowDelete ? (
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {fields.length ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => edit(row)}
                        >
                          {editLabel}
                        </Button>
                      ) : null}
                      {allowDelete ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={remove.isPending}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Supprimer définitivement cet élément ?",
                              )
                            ) {
                              remove.mutate(String(row.id));
                            }
                          }}
                        >
                          Supprimer
                        </Button>
                      ) : null}
                    </td>
                  ) : null}
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
            {form.id ? editLabel : `Ajouter — ${title}`}
          </h2>
          {fields.map((field) => (
            <AdminFormField
              key={field.key}
              field={field}
              value={form.values[field.key]}
              onChange={(value) =>
                setForm({
                  ...form,
                  values: { ...form.values, [field.key]: value },
                })
              }
            />
          ))}
          <div className="flex gap-3 md:col-span-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Enregistrement…" : "Enregistrer"}
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

function AdminFormField({
  field,
  value,
  onChange,
}: {
  field: AdminField;
  value: Value | undefined;
  onChange: (value: Value) => void;
}) {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 self-end py-3 text-sm font-semibold">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        {field.label}
      </label>
    );
  }

  const stringValue = Array.isArray(value)
    ? value.join(", ")
    : String(value ?? "");
  return (
    <div
      className={
        field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"
      }
    >
      <Label>{field.label}</Label>
      {field.type === "textarea" ? (
        <Textarea
          className="min-h-28"
          required={field.required}
          value={stringValue}
          onChange={(event) => onChange(event.target.value || null)}
        />
      ) : field.type === "select" ? (
        <select
          className="h-10 w-full border border-input bg-white px-3 text-sm"
          required={field.required}
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Sélectionner…</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={field.type === "number" ? "number" : (field.type ?? "text")}
          required={field.required}
          value={stringValue}
          onChange={(event) =>
            onChange(
              field.type === "number"
                ? Number(event.target.value)
                : event.target.value,
            )
          }
        />
      )}
    </div>
  );
}
