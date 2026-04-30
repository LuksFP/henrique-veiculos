create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year integer not null,
  km text,
  fuel text not null,
  transmission text not null,
  color text,
  price text not null,
  options text[] not null default '{}',
  image_url text,
  image_path text,
  bg text,
  is_featured boolean not null default false,
  is_available boolean not null default true,
  sort_order integer not null default 99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and is_admin = true
  );
$$;

alter table public.admin_users enable row level security;
alter table public.vehicles enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "Vehicles are public" on public.vehicles;
create policy "Vehicles are public"
on public.vehicles
for select
to anon, authenticated
using (is_available = true or public.is_admin());

drop policy if exists "Admins can insert vehicles" on public.vehicles;
create policy "Admins can insert vehicles"
on public.vehicles
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update vehicles" on public.vehicles;
create policy "Admins can update vehicles"
on public.vehicles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete vehicles" on public.vehicles;
create policy "Admins can delete vehicles"
on public.vehicles
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('vehicles', 'vehicles', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Vehicle images are public" on storage.objects;
create policy "Vehicle images are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'vehicles');

drop policy if exists "Admins can upload vehicle images" on storage.objects;
create policy "Admins can upload vehicle images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'vehicles' and public.is_admin());

drop policy if exists "Admins can update vehicle images" on storage.objects;
create policy "Admins can update vehicle images"
on storage.objects
for update
to authenticated
using (bucket_id = 'vehicles' and public.is_admin())
with check (bucket_id = 'vehicles' and public.is_admin());

drop policy if exists "Admins can delete vehicle images" on storage.objects;
create policy "Admins can delete vehicle images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'vehicles' and public.is_admin());
