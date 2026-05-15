-- Security hardening:
-- 1. Enable RLS on admin_users (self-read only)
-- 2. Replace all public.is_admin() usage with EXISTS on admin_users (inline, no function dep)
-- 3. Add anon INSERT policy on leads for public contact forms

-- ============================================================
-- admin_users: enable RLS, allow users to read their own row
-- ============================================================
alter table public.admin_users enable row level security;

drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- ============================================================
-- vehicles: replace public.is_admin() with EXISTS inline
-- ============================================================
drop policy if exists "vehicles_public_read"      on public.vehicles;
drop policy if exists "vehicles_admin_insert"     on public.vehicles;
drop policy if exists "vehicles_admin_update"     on public.vehicles;
drop policy if exists "vehicles_admin_delete"     on public.vehicles;

create policy "vehicles_public_read"
  on public.vehicles for select
  to anon, authenticated
  using (
    is_available = true
    or exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

create policy "vehicles_admin_insert"
  on public.vehicles for insert
  to authenticated
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

create policy "vehicles_admin_update"
  on public.vehicles for update
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

create policy "vehicles_admin_delete"
  on public.vehicles for delete
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

-- ============================================================
-- vehicle_images: replace public.is_admin() with EXISTS inline
-- ============================================================
drop policy if exists "vehicle_images_public_read"   on public.vehicle_images;
drop policy if exists "vehicle_images_admin_insert"  on public.vehicle_images;
drop policy if exists "vehicle_images_admin_update"  on public.vehicle_images;
drop policy if exists "vehicle_images_admin_delete"  on public.vehicle_images;

create policy "vehicle_images_public_read"
  on public.vehicle_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.vehicles v
      where v.id = vehicle_images.vehicle_id
        and (
          v.is_available = true
          or exists (
            select 1 from public.admin_users
            where user_id = auth.uid() and is_admin = true
          )
        )
    )
  );

create policy "vehicle_images_admin_insert"
  on public.vehicle_images for insert
  to authenticated
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

create policy "vehicle_images_admin_update"
  on public.vehicle_images for update
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

create policy "vehicle_images_admin_delete"
  on public.vehicle_images for delete
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

-- ============================================================
-- leads: replace public.is_admin(), add anon INSERT for public forms
-- ============================================================
drop policy if exists "admins_manage_leads" on public.leads;
drop policy if exists "leads_anon_insert"   on public.leads;
drop policy if exists "leads_admin_all"     on public.leads;

-- Public contact forms (anonKey client) can create leads with status='novo' only
create policy "leads_anon_insert"
  on public.leads for insert
  to anon
  with check (status = 'novo');

-- Admins can do everything
create policy "leads_admin_all"
  on public.leads for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

-- ============================================================
-- sales: replace public.is_admin() with EXISTS inline
-- ============================================================
drop policy if exists "admins_manage_sales" on public.sales;
drop policy if exists "sales_admin_all"     on public.sales;

create policy "sales_admin_all"
  on public.sales for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );

-- ============================================================
-- expenses: replace public.is_admin() with EXISTS inline
-- ============================================================
drop policy if exists "expenses_admin_all" on public.expenses;

create policy "expenses_admin_all"
  on public.expenses for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and is_admin = true
    )
  );
