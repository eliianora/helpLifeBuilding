-- ============================================================
-- Sécurité production — accès ebooks
-- Supabase → SQL Editor → Run
-- Après : supabase-migration-tanstack.sql, supabase-admin-tanstack.sql,
--         supabase-storage-ebooks.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. Rôles : profiles.role = unique source de vérité
-- ------------------------------------------------------------
insert into public.profiles (id, email, display_name, role)
select
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'display_name', au.raw_user_meta_data->>'full_name', u.nom),
  case when u.role = 'admin' then 'admin' else 'client' end
from auth.users au
left join public.users u on u.id = au.id
on conflict (id) do update
set email = coalesce(excluded.email, public.profiles.email),
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    role = case
      when excluded.role = 'admin' or public.profiles.role = 'admin' then 'admin'
      else 'client'
    end;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.role := 'client';
    elsif new.role is distinct from old.role then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before insert or update on public.profiles
  for each row execute function public.protect_profile_role();

-- Empêcher l'auto-promotion via l'ancienne table users
create or replace function public.protect_users_role()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.role := 'client';
    elsif new.role is distinct from old.role then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_users_role on public.users;
create trigger protect_users_role
  before insert or update on public.users
  for each row execute function public.protect_users_role();

-- Lecture publique de users : trop large (emails / rôles)
drop policy if exists "Users profiles public read" on public.users;
drop policy if exists "Users public read" on public.users;
drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id or public.is_admin());

-- ------------------------------------------------------------
-- 2. library_entries : lecture seule côté utilisateur
-- ------------------------------------------------------------
drop policy if exists "Bibliotheque du lecteur" on public.library_entries;
drop policy if exists "Admins lisent la bibliothèque" on public.library_entries;
drop policy if exists "Lecteurs lisent leur bibliothèque" on public.library_entries;
drop policy if exists "Admins gèrent la bibliothèque" on public.library_entries;

create policy "Lecteurs lisent leur bibliothèque"
  on public.library_entries for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admins gèrent la bibliothèque"
  on public.library_entries for all
  using (public.is_admin())
  with check (public.is_admin());

revoke insert, update, delete on table public.library_entries from anon, authenticated;
grant select on table public.library_entries to authenticated;

-- Synchroniser depuis les achats déjà payés (si table présente)
do $$
begin
  if to_regclass('public.ebook_achats') is not null then
    insert into public.library_entries (user_id, ebook_id)
    select distinct ea.utilisateur_id, ea.ebook_id
    from public.ebook_achats ea
    where ea.utilisateur_id is not null and ea.ebook_id is not null
    on conflict do nothing;
  end if;
exception when others then
  raise notice 'Sync ebook_achats → library_entries ignorée: %', sqlerrm;
end $$;

-- ------------------------------------------------------------
-- 3. reading_progress : uniquement si accès bibliothèque
-- ------------------------------------------------------------
drop policy if exists "Progression du lecteur" on public.reading_progress;
create policy "Progression du lecteur"
  on public.reading_progress for all
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.library_entries le
      where le.user_id = auth.uid() and le.ebook_id = reading_progress.ebook_id
    )
  )
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.library_entries le
      where le.user_id = auth.uid() and le.ebook_id = reading_progress.ebook_id
    )
  );

-- ------------------------------------------------------------
-- 4. Désactiver complete_checkout côté client
-- ------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'complete_checkout'
  ) then
    execute 'revoke all on function public.complete_checkout(text, uuid[], text, text) from public, anon, authenticated';
  end if;
exception when others then
  raise notice 'REVOKE complete_checkout: %', sqlerrm;
end $$;

-- ------------------------------------------------------------
-- 5. Catalogue public sans secrets (fichier_url / contenu_pages)
-- ------------------------------------------------------------
create or replace view public.ebooks_public
with (security_invoker = true)
as
select
  id,
  slug,
  title,
  subtitle,
  description,
  cover_key,
  price_label,
  pages,
  reading_minutes,
  category,
  position,
  published,
  created_at
from public.ebooks
where published = true or statut = 'publie';

grant select on public.ebooks_public to anon, authenticated;

-- Les policies ebooks publiques restent, mais le code doit sélectionner
-- uniquement les colonnes sûres (jamais fichier_url / contenu_pages en public).

-- ------------------------------------------------------------
-- 6. commandes / paiement : plus d'UPDATE utilisateur libre
-- ------------------------------------------------------------
drop policy if exists "Commandes modifiables par proprietaire" on public.commandes;

do $$
begin
  if to_regclass('public.paiement') is not null then
    execute 'drop policy if exists "Utilisateurs peuvent creer leurs paiements" on public.paiement';
    execute 'drop policy if exists "Utilisateurs peuvent modifier leurs paiements" on public.paiement';
  end if;
exception when others then
  raise notice 'Policies paiement: %', sqlerrm;
end $$;

notify pgrst, 'reload schema';
