create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url text not null,
  path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists vehicle_images_vehicle_id_idx on public.vehicle_images (vehicle_id);

alter table public.vehicle_images enable row level security;

create policy "vehicle_images_public_read"
  on public.vehicle_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.vehicles v
      where v.id = vehicle_images.vehicle_id
        and (v.is_available = true or public.is_admin())
    )
  );

create policy "vehicle_images_admin_insert"
  on public.vehicle_images for insert
  to authenticated
  with check (public.is_admin());

create policy "vehicle_images_admin_delete"
  on public.vehicle_images for delete
  to authenticated
  using (public.is_admin());
