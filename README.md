# Henrique Veículos

Site institucional e painel administrativo para revenda de seminovos em Guarujá/SP.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions)
- **Supabase** (Auth, Postgres, Storage)
- **Tailwind CSS v4**
- **TypeScript** (strict)

## Estrutura

```
app/
  (site)/          → site público (home, listagem, detalhe do veículo)
  admin/           → painel administrativo protegido por auth
    dashboard/     → KPIs e resumo
    veiculos/      → CRUD de estoque com busca e paginação
    cadastro/      → cadastro de novo veículo com upload de foto
    crm/           → leads com status kanban e form de criação manual
    vendas/        → registro de vendas
    financeiro/    → relatório financeiro com KPIs
  login/           → autenticação via Supabase Auth
  actions/         → Server Actions (vehicles, leads, sales, auth)
components/admin/  → SubmitButton, DeleteButton, AlertBanner,
                     VehicleFilters, ImagePreview, LeadStatusSelect
lib/supabase/      → client (browser) + server (SSR)
```

## Variáveis de ambiente

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Rodar localmente

```bash
npm install
npm run dev       # Turbopack dev server em http://localhost:3000
npm run build     # build de produção
npm start         # serve o build de produção
```

## Admin

Acesse `/login` com as credenciais de admin. O usuário precisa existir em `auth.users` e ter um registro em `admin_users` com `is_admin = true`.

Para criar um admin via SQL:

```sql
-- 1. Criar usuário no Supabase Auth (via dashboard ou API)
-- 2. Inserir na tabela admin_users:
INSERT INTO admin_users (user_id, is_admin)
VALUES ('<uuid-do-user>', true);
```

## Banco de dados

Tabelas principais: `vehicles`, `leads`, `sales`, `admin_users`.

RLS habilitado em todas as tabelas. Políticas de escrita usam:
```sql
EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_admin = true)
```

Bucket Storage: `vehicles` (público para leitura, escrita restrita a admins).

## Deploy

Projeto configurado para deploy na Vercel. Configurar as variáveis de ambiente no dashboard antes do primeiro deploy.
