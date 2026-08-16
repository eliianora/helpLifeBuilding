-- Rôles admin pour le back-office TanStack (table profiles)
-- À exécuter dans Supabase → SQL Editor,
-- APRÈS supabase-migration-tanstack.sql.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  role text not null default 'client',
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists role text not null default 'client';

alter table public.profiles
  add column if not exists email text;

-- Normalisation avant la contrainte (d'anciens rôles peuvent exister)
update public.profiles set role = 'client'
where role is null or role not in ('admin', 'client');

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'client'));

-- is_admin() existait déjà et lisait public.users : de nombreuses policies
-- de supabase-schema.sql en dépendent. On accepte donc les deux tables.
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
  ) or exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.ebooks enable row level security;
alter table public.chapters enable row level security;
alter table public.profiles enable row level security;
alter table public.library_entries enable row level security;

drop policy if exists "Admins gèrent les ebooks" on public.ebooks;
create policy "Admins gèrent les ebooks"
  on public.ebooks for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins gèrent les chapitres" on public.chapters;
create policy "Admins gèrent les chapitres"
  on public.chapters for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins lisent les profils" on public.profiles;
create policy "Admins lisent les profils"
  on public.profiles for select
  using (public.is_admin() or id = auth.uid());

drop policy if exists "Admins mettent à jour les profils" on public.profiles;
create policy "Admins mettent à jour les profils"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Lecteurs créent leur profil" on public.profiles;
create policy "Lecteurs créent leur profil"
  on public.profiles for insert
  with check (id = auth.uid() and role = 'client');

drop policy if exists "Lecteurs mettent à jour leur profil" on public.profiles;
create policy "Lecteurs mettent à jour leur profil"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name'),
    'client'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Reprendre les comptes créés avant l'installation du trigger.
insert into public.profiles (id, email, display_name, role)
select
  au.id,
  au.email,
  coalesce(au.raw_user_meta_data->>'display_name', au.raw_user_meta_data->>'full_name'),
  case when u.role = 'admin' then 'admin' else 'client' end
from auth.users au
left join public.users u on u.id = au.id
on conflict (id) do update
set email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    role = case when excluded.role = 'admin' then 'admin' else public.profiles.role end;

drop policy if exists "Admins lisent la bibliothèque" on public.library_entries;
create policy "Admins lisent la bibliothèque"
  on public.library_entries for select
  using (public.is_admin() or user_id = auth.uid());

grant select, insert, update on table public.profiles to authenticated;

-- Droits et policies des pages historiques du back-office.
alter table public.auteurs enable row level security;
alter table public.categorie_eb enable row level security;
alter table public.categorie_pro enable row level security;
alter table public.langages enable row level security;
alter table public.services enable row level security;
alter table public.projet enable row level security;
alter table public.bande_info enable row level security;
alter table public.rendez_vous enable row level security;
alter table public.paiement enable row level security;
alter table public.panier enable row level security;

grant select, insert, update, delete on table
  public.auteurs,
  public.categorie_eb,
  public.categorie_pro,
  public.langages,
  public.services,
  public.projet,
  public.bande_info,
  public.rendez_vous,
  public.paiement,
  public.panier
to authenticated;

drop policy if exists "Admin gère auteurs" on public.auteurs;
create policy "Admin gère auteurs" on public.auteurs for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin gère catégories ebooks" on public.categorie_eb;
create policy "Admin gère catégories ebooks" on public.categorie_eb for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin gère catégories projets" on public.categorie_pro;
create policy "Admin gère catégories projets" on public.categorie_pro for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin gère langages" on public.langages;
create policy "Admin gère langages" on public.langages for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin gère services" on public.services;
create policy "Admin gère services" on public.services for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin gère projets" on public.projet;
create policy "Admin gère projets" on public.projet for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin gère bande info" on public.bande_info;
create policy "Admin gère bande info" on public.bande_info for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin gère rendez-vous" on public.rendez_vous;
create policy "Admin gère rendez-vous" on public.rendez_vous for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin gère paiements" on public.paiement;
create policy "Admin gère paiements" on public.paiement for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin voit paniers" on public.panier;
create policy "Admin voit paniers" on public.panier for select
  using (public.is_admin());

notify pgrst, 'reload schema';

-- ------------------------------------------------------------
-- Premier administrateur
-- Créez d'abord le compte : Authentication > Users > Add user
-- (cochez « Auto Confirm User »), puis exécutez ceci.
-- Fonctionne que le profil existe déjà ou non.
-- ------------------------------------------------------------
insert into public.profiles (id, email, role)
select u.id, u.email, 'admin'
from auth.users u
where u.email = 'estheerrkouame05@gmail.com'
on conflict (id) do update
  set role = 'admin',
      email = excluded.email;

-- Vérification : doit renvoyer une ligne avec role = admin
select id, email, role from public.profiles where email = 'estheerrkouame05@gmail.com';
