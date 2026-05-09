create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount numeric(12,2) not null,
  category text not null default 'outros',
  expense_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  constraint expenses_category_check check (
    category in ('aluguel', 'folha', 'manutencao', 'marketing', 'outros')
  )
);

create index if not exists expenses_date_idx on public.expenses (expense_date desc);

alter table public.expenses enable row level security;

create policy "expenses_admin_all"
  on public.expenses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
