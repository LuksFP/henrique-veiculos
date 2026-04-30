-- Row level security: public reads, admin writes.

alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.profiles enable row level security;

create policy "vehicles_public_read"
  on public.vehicles
  for select
  to anon, authenticated
  using (status <> 'hidden' or public.is_admin());

create policy "vehicles_admin_insert"
  on public.vehicles
  for insert
  to authenticated
  with check (public.is_admin());

create policy "vehicles_admin_update"
  on public.vehicles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "vehicles_admin_delete"
  on public.vehicles
  for delete
  to authenticated
  using (public.is_admin());

create policy "vehicle_images_public_read"
  on public.vehicle_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.vehicles v
      where v.id = vehicle_images.vehicle_id
        and (v.status <> 'hidden' or public.is_admin())
    )
  );

create policy "vehicle_images_admin_insert"
  on public.vehicle_images
  for insert
  to authenticated
  with check (public.is_admin());

create policy "vehicle_images_admin_update"
  on public.vehicle_images
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "vehicle_images_admin_delete"
  on public.vehicle_images
  for delete
  to authenticated
  using (public.is_admin());

create policy "profiles_self_read"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_self_update"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and is_admin = (select is_admin from public.profiles where id = auth.uid()));

create policy "profiles_admin_manage"
  on public.profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
