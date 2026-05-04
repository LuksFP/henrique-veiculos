-- CRM leads table
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  vehicle_label text,
  status text not null default 'novo'
    check (status in ('novo', 'contato', 'proposta', 'fechado', 'perdido')),
  source text not null default 'whatsapp'
    check (source in ('whatsapp', 'site', 'indicacao', 'instagram', 'outro')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Financial sales table
create table public.sales (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete set null,
  make text not null,
  model text not null,
  year integer not null,
  lead_id uuid references public.leads(id) on delete set null,
  sale_price numeric(12, 2) not null,
  payment_method text not null default 'a_vista'
    check (payment_method in ('a_vista', 'financiado', 'consorcio', 'troca')),
  sale_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS: admin-only for both tables
alter table public.leads enable row level security;
alter table public.sales enable row level security;

create policy "admins_manage_leads"
  on public.leads for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admins_manage_sales"
  on public.sales for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
