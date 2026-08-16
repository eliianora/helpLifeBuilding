import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  adminGrantEbookAccess,
  adminListEbooks,
  adminListReaders,
  adminRevokeEbookAccess,
  adminSetRole,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/lecteurs")({
  head: () => ({ meta: [{ title: "Lecteurs — Admin" }] }),
  component: AdminReaders,
});

function AdminReaders() {
  const queryClient = useQueryClient();
  const [grantUserId, setGrantUserId] = useState("");
  const [grantEbookId, setGrantEbookId] = useState("");

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-readers"],
    queryFn: () => adminListReaders(),
  });
  const { data: ebooks = [] } = useQuery({
    queryKey: ["admin-ebooks"],
    queryFn: () => adminListEbooks(),
  });

  const setRole = useMutation({
    mutationFn: (payload: { userId: string; role: "admin" | "client" }) =>
      adminSetRole({ data: payload }),
    onSuccess: () => {
      toast.success("Rôle mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin-readers"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const grant = useMutation({
    mutationFn: () =>
      adminGrantEbookAccess({ data: { userId: grantUserId, ebookId: grantEbookId } }),
    onSuccess: () => {
      toast.success("Accès ebook accordé.");
      setGrantEbookId("");
      queryClient.invalidateQueries({ queryKey: ["admin-readers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const revoke = useMutation({
    mutationFn: () =>
      adminRevokeEbookAccess({ data: { userId: grantUserId, ebookId: grantEbookId } }),
    onSuccess: () => {
      toast.success("Accès ebook retiré.");
      queryClient.invalidateQueries({ queryKey: ["admin-readers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
        Lecteurs
      </h1>
      <p className="mt-2 text-muted-foreground">
        Rôles, et attribution manuelle d’accès aux ebooks (paiement vérifié ou admin).
      </p>
      <span className="mt-4 mb-8 block h-0.5 w-14 bg-primary" aria-hidden />

      <form
        className="premium-card mb-8 grid gap-4 p-5 md:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!grantUserId || !grantEbookId) {
            toast.error("Choisissez un lecteur et un ebook.");
            return;
          }
          grant.mutate();
        }}
      >
        <h2 className="font-display text-lg font-extrabold uppercase md:col-span-3">
          Accorder / retirer un ebook
        </h2>
        <div className="space-y-2">
          <Label>Lecteur</Label>
          <select
            className="h-10 w-full border border-input bg-white px-3 text-sm"
            value={grantUserId}
            onChange={(e) => setGrantUserId(e.target.value)}
            required
          >
            <option value="">Sélectionner…</option>
            {data.map((reader) => (
              <option key={reader.id} value={reader.id}>
                {reader.display_name || reader.email || reader.id}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Ebook</Label>
          <select
            className="h-10 w-full border border-input bg-white px-3 text-sm"
            value={grantEbookId}
            onChange={(e) => setGrantEbookId(e.target.value)}
            required
          >
            <option value="">Sélectionner…</option>
            {ebooks.map((ebook) => (
              <option key={ebook.id} value={ebook.id}>
                {ebook.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" disabled={grant.isPending}>
            Accorder
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={revoke.isPending || !grantUserId || !grantEbookId}
            onClick={() => revoke.mutate()}
          >
            Retirer
          </Button>
        </div>
      </form>

      {error ? (
        <p className="mb-4 text-sm text-destructive">{error.message}</p>
      ) : null}
      {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}

      {!isLoading && !error && data.length === 0 ? (
        <p className="border border-dashed border-border bg-white px-5 py-10 text-center text-muted-foreground">
          Aucun profil lecteur n’a encore été créé.
        </p>
      ) : null}

      {data.length ? (
        <div className="overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-secondary text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Livres</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.map((reader) => (
                <tr key={reader.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">
                    {reader.display_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {reader.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {reader.role === "admin" ? "Admin" : "Client"}
                  </td>
                  <td className="px-4 py-3">{reader.livres}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGrantUserId(reader.id)}
                    >
                      Accès
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={setRole.isPending}
                      onClick={() =>
                        setRole.mutate({
                          userId: reader.id,
                          role: reader.role === "admin" ? "client" : "admin",
                        })
                      }
                    >
                      {reader.role === "admin"
                        ? "Retirer admin"
                        : "Rendre admin"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
