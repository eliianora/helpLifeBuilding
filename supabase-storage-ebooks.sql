-- ============================================================
-- Stockage privé des ebooks PDF
-- Supabase → SQL Editor → New query → Run
-- À exécuter APRÈS supabase-admin-tanstack.sql.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ebooks',
  'ebooks',
  false,
  52428800,
  array['application/pdf']::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins chargent les PDF ebooks" on storage.objects;
create policy "Admins chargent les PDF ebooks"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'ebooks' and public.is_admin());

drop policy if exists "Admins remplacent les PDF ebooks" on storage.objects;
create policy "Admins remplacent les PDF ebooks"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'ebooks' and public.is_admin())
  with check (bucket_id = 'ebooks' and public.is_admin());

drop policy if exists "Admins suppriment les PDF ebooks" on storage.objects;
create policy "Admins suppriment les PDF ebooks"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'ebooks' and public.is_admin());

drop policy if exists "Admins consultent les PDF ebooks" on storage.objects;
create policy "Admins consultent les PDF ebooks"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'ebooks' and public.is_admin());

-- Les lecteurs n'accèdent pas directement au bucket.
-- Après contrôle de library_entries, le serveur produit une URL signée valable 1 heure.
