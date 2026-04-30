-- Core schema: vehicles, vehicle_images, profiles
-- Triggers, helpers, indexes.

create extension if not exists "pgcrypto";

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year smallint,
  km integer,
  fuel text,
  transmission text,
  color text,
  price numeric(12, 2),
  price_label text,
  options text[] not null default '{}',
  cover_url text,
  bg_gradient text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'available' check (status in ('available', 'sold', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vehicles_status_idx on public.vehicles (status);
create index vehicles_featured_idx on public.vehicles (is_featured) where is_featured = true;
create index vehicles_year_idx on public.vehicles (year desc);
create index vehicles_make_model_idx on public.vehicles (make, model);

create table public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index vehicle_images_vehicle_id_idx on public.vehicle_images (vehicle_id);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from anon, authenticated, public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

revoke execute on function public.is_admin() from anon, authenticated, public;
