-- ============================================================
-- Alignement de la base existante sur le schéma du site TanStack
-- Supabase → SQL Editor → New query → Run
--
-- La base contient l'ancien schéma français (ebooks.titre, ebooks.statut)
-- et il manque chapters / library_entries / reading_progress.
-- Ce script ajoute ce qui manque et garde les deux nommages synchronisés,
-- pour ne pas casser l'ancien code Next.js ni complete_checkout().
--
-- À exécuter AVANT supabase-admin-tanstack.sql.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Retrait des accents (extension unaccent pas toujours dispo)
-- ------------------------------------------------------------
create or replace function public.unaccent_safe(value text)
returns text
language sql
immutable
as $$
  select translate(
    value,
    'àáâãäåçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ',
    'aaaaaaceeeeiiiinooooouuuuyyAAAAAACEEEEIIIINOOOOOUUUUY'
  );
$$;

-- ------------------------------------------------------------
-- 1. Table ebooks : colonnes du site
-- ------------------------------------------------------------
alter table public.ebooks add column if not exists title text;
alter table public.ebooks add column if not exists slug text;
alter table public.ebooks add column if not exists subtitle text;
alter table public.ebooks add column if not exists category text;
alter table public.ebooks add column if not exists cover_key text;
alter table public.ebooks add column if not exists price_label text;
alter table public.ebooks add column if not exists reading_minutes integer;
alter table public.ebooks add column if not exists position integer;
alter table public.ebooks add column if not exists published boolean;

-- Le site écrit title/published ; l'ancien code écrit titre/statut.
-- On relâche les contraintes pour que les deux sens fonctionnent.
alter table public.ebooks alter column titre drop not null;
alter table public.ebooks alter column prix drop not null;
alter table public.ebooks alter column description set default '';

-- ------------------------------------------------------------
-- 2. Reprise des données existantes
-- ------------------------------------------------------------
update public.ebooks set title = titre where title is null;
update public.ebooks set published = (statut = 'publie') where published is null;
update public.ebooks set description = '' where description is null;
update public.ebooks set pages = 80 where pages is null;
update public.ebooks set reading_minutes = coalesce(pages, 80) where reading_minutes is null;
update public.ebooks set position = 0 where position is null;
update public.ebooks set cover_key = image_url where cover_key is null and image_url is not null;

update public.ebooks
set price_label = case
  when prix is null or prix = 0 then 'Gratuit'
  else trim(to_char(prix, 'FM9999999')) || ' FCFA'
end
where price_label is null;

update public.ebooks e
set category = c.nom
from public.categorie_eb c
where e.categorie_eb_id = c.id and e.category is null;

-- Slug : dérivé du titre, suffixé si doublon
update public.ebooks
set slug = trim(both '-' from regexp_replace(lower(public.unaccent_safe(coalesce(title, titre, 'livre'))), '[^a-z0-9]+', '-', 'g'))
where slug is null or slug = '';

update public.ebooks set slug = slug || '-' || left(id::text, 6)
where id in (
  select id from (
    select id, row_number() over (partition by slug order by created_at) as rn
    from public.ebooks
  ) d where d.rn > 1
);

alter table public.ebooks alter column title set not null;
alter table public.ebooks alter column slug set not null;
alter table public.ebooks alter column published set default false;
alter table public.ebooks alter column position set default 0;
alter table public.ebooks alter column pages set default 80;
alter table public.ebooks alter column reading_minutes set default 90;
alter table public.ebooks alter column price_label set default '4 500 FCFA';

create unique index if not exists ebooks_slug_key on public.ebooks (slug);

-- ------------------------------------------------------------
-- 3. Synchronisation title <-> titre, published <-> statut
--    Les deux applications peuvent écrire sans se casser.
-- ------------------------------------------------------------
create or replace function public.sync_ebook_columns()
returns trigger
language plpgsql
as $$
begin
  if new.title is null and new.titre is not null then
    new.title := new.titre;
  elsif new.titre is null and new.title is not null then
    new.titre := new.title;
  elsif tg_op = 'UPDATE' then
    if new.title is distinct from old.title then
      new.titre := new.title;
    elsif new.titre is distinct from old.titre then
      new.title := new.titre;
    end if;
  end if;

  if tg_op = 'INSERT' then
    if new.published is null then
      new.published := (new.statut = 'publie');
    end if;
    new.statut := case when new.published then 'publie' else coalesce(nullif(new.statut, 'publie'), 'brouillon') end;
  elsif new.published is distinct from old.published then
    new.statut := case when new.published then 'publie' else 'brouillon' end;
  elsif new.statut is distinct from old.statut then
    new.published := (new.statut = 'publie');
  end if;

  if new.price_label is null and new.prix is not null then
    new.price_label := trim(to_char(new.prix, 'FM9999999')) || ' FCFA';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists sync_ebook_columns on public.ebooks;
create trigger sync_ebook_columns
  before insert or update on public.ebooks
  for each row execute function public.sync_ebook_columns();

-- ------------------------------------------------------------
-- 4. Tables manquantes : chapters, library_entries, reading_progress
-- ------------------------------------------------------------
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  ebook_id uuid not null references public.ebooks(id) on delete cascade,
  title text not null,
  position integer not null,
  is_preview boolean not null default false,
  content text not null default ''
);

create unique index if not exists chapters_ebook_position_key
  on public.chapters (ebook_id, position);

create table if not exists public.library_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ebook_id uuid not null references public.ebooks(id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists library_entries_user_ebook_key
  on public.library_entries (user_id, ebook_id);

create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ebook_id uuid not null references public.ebooks(id) on delete cascade,
  chapter_position integer not null default 1,
  percent integer not null default 0,
  updated_at timestamptz not null default now()
);

create unique index if not exists reading_progress_user_ebook_key
  on public.reading_progress (user_id, ebook_id);

-- ------------------------------------------------------------
-- 5. RLS des nouvelles tables
-- ------------------------------------------------------------
alter table public.chapters enable row level security;
alter table public.library_entries enable row level security;
alter table public.reading_progress enable row level security;

grant select, insert, update, delete on table public.chapters to authenticated;
grant select on table public.chapters to anon;
grant select, insert, update, delete on table public.library_entries to authenticated;
grant select, insert, update, delete on table public.reading_progress to authenticated;

-- Extraits gratuits lisibles publiquement
drop policy if exists "Extraits publics lisibles" on public.chapters;
create policy "Extraits publics lisibles"
  on public.chapters for select
  using (
    is_preview
    and exists (select 1 from public.ebooks e where e.id = chapters.ebook_id and e.published)
  );

-- Chapitres complets réservés aux lecteurs qui ont le livre
drop policy if exists "Chapitres lisibles par le lecteur" on public.chapters;
create policy "Chapitres lisibles par le lecteur"
  on public.chapters for select
  to authenticated
  using (
    exists (
      select 1 from public.library_entries le
      where le.ebook_id = chapters.ebook_id and le.user_id = auth.uid()
    )
  );

drop policy if exists "Bibliotheque du lecteur" on public.library_entries;
create policy "Bibliotheque du lecteur"
  on public.library_entries for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Progression du lecteur" on public.reading_progress;
create policy "Progression du lecteur"
  on public.reading_progress for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Le catalogue public du site lit ebooks.published
drop policy if exists "Ebooks publies lisibles" on public.ebooks;
create policy "Ebooks publies lisibles"
  on public.ebooks for select
  using (published or statut = 'publie');

-- ------------------------------------------------------------
-- 6. Recharger le cache de l'API
-- ------------------------------------------------------------
notify pgrst, 'reload schema';
