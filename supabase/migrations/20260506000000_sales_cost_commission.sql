-- Add financial columns to sales and updated_at to leads

alter table public.sales
  add column if not exists client_name text not null default '',
  add column if not exists cost_price  numeric(12, 2) not null default 0,
  add column if not exists commission  numeric(12, 2) not null default 0;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

alter table public.leads
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();
