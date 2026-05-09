# Henrique Veículos — Admin Panel

Sistema de gestão para concessionária. Next.js 16 App Router + Supabase + design dark neon lime.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Estilo | CSS puro com oklch color space, sem Tailwind no admin |
| Fonte | Rajdhani (display) via `next/font/google` |
| Gráficos | Recharts (Bar, Line, Area, Pie) |
| Validação | Zod |
| Ícones | Lucide React |
| Testes E2E | Playwright (Chromium) |

---

## Rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Puxar variáveis de ambiente do Vercel
vercel env pull .env.local

# 3. Subir servidor
npm run dev
```

Acesse `http://localhost:3000`.

> Sem o `.env.local` o app usa fallback de dados estáticos no showroom público. O admin redireciona para `/login`.

### Rodar testes E2E

```bash
npm run test:e2e
```

Requer o servidor em `localhost:3000` (o Playwright sobe automaticamente via `webServer`). Usuário de teste: `admin.teste@henriqueveiculos.local`.

---

## Variáveis de ambiente necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Estrutura do projeto

```
app/
  page.tsx                  → Showroom público (lista de veículos)
  login/page.tsx            → Login admin
  admin/
    layout.tsx              → Shell com sidebar fixa (240px)
    page.tsx                → Dashboard (KPIs + gráficos)
    veiculos/page.tsx       → CRUD de veículos + upload de foto
    crm/page.tsx            → Gestão de leads
    vendas/page.tsx         → Histórico de vendas com CRUD
    financeiro/page.tsx     → KPIs financeiros + gráficos por mês

components/
  admin-sidebar.tsx         → Sidebar com navegação ativa
  dashboard-charts.tsx      → Gráficos do dashboard (mock)
  crm-client.tsx            → Client component: filtros + painel de lead
  financeiro-charts.tsx     → Client component: gráficos semanais/mensais de vendas
  vehicles-table.tsx        → Client component: tabela com busca/filtro de veículos
  vehicle-gallery.tsx       → Galeria de fotos (múltiplas imagens por veículo)

app/actions/
  auth.ts                   → loginAction, logoutAction
  vehicles.ts               → createVehicleAction, updateVehicleAction, deleteVehicleAction
  leads.ts                  → createLeadAction, updateLeadAction, deleteLeadAction
  sales.ts                  → createSaleAction, updateSaleAction, deleteSaleAction
  expenses.ts               → createExpenseAction, deleteExpenseAction

e2e/
  helpers/auth.ts           → login() helper e credenciais do usuário de teste
  auth.spec.ts              → 3 testes: login, senha errada, logout
  veiculos.spec.ts          → 4 testes: criar, busca filtra, busca vazia, editar
  crm.spec.ts               → 5 testes: criar, filtro status, selecionar, mudar status, excluir
  vendas.spec.ts            → 3 testes: criar, editar, excluir
  financeiro.spec.ts        → 2 testes: criar despesa, excluir despesa

lib/
  supabase/server.ts        → Cliente Supabase para Server Components
  supabase/browser.ts       → Cliente Supabase para Client Components
  database.types.ts         → Tipos gerados: VehicleRow, LeadRow, SaleRow
  vehicles.ts               → getVehicles() com fallback estático

supabase/migrations/
  20260429190000_core_schema.sql           → vehicles, vehicle_images, profiles
  20260429190100_rls_policies.sql          → RLS para vehicles/profiles
  20260429190200_storage_bucket.sql        → Bucket vehicle-photos
  20260429201000_initial_schema.sql        → Schema completo com admin_users
  20260506000000_sales_cost_commission.sql → cost_price, commission, client_name em sales
  20260509000000_vehicle_images_gallery.sql → Tabela vehicle_images para galeria múltipla
  20260509000100_expenses_table.sql        → Tabela expenses (despesas operacionais)
```

---

## Banco de dados (Supabase)

### Tabelas

#### `vehicles`
Estoque de veículos. Campos: `make`, `model`, `year`, `km`, `fuel`, `transmission`, `color`, `price` (text), `options` (array), `image_url`, `image_path`, `bg` (gradient CSS), `is_featured`, `is_available`, `sort_order`.

#### `admin_users`
Controle de acesso admin. Vinculado a `auth.users`. Campo `is_admin: boolean`.

#### `leads`
Leads do CRM. Campos: `name`, `phone`, `email`, `vehicle_label`, `status` (`novo | contato | proposta | fechado | perdido`), `source` (`whatsapp | site | indicacao | instagram | outro`), `notes`.

#### `sales`
Registro de vendas. Campos: `make`, `model`, `year`, `client_name`, `sale_price`, `cost_price`, `commission`, `payment_method` (`a_vista | financiado | consorcio | troca`), `sale_date`, `lead_id` (FK opcional).

### RLS (Row Level Security)

| Tabela | Acesso |
|--------|--------|
| `vehicles` | Leitura pública (`is_available = true`), escrita só admin |
| `admin_users` | Só admin ou o próprio usuário |
| `leads` | Só admin |
| `sales` | Só admin |

### Storage

Bucket `vehicles` (público): fotos de veículos. Upload/update/delete só admin.

---

## Autenticação

Login via Supabase Auth (`signInWithPassword`). Admin é verificado pela tabela `admin_users` — ter conta não é suficiente, precisa ter `is_admin = true`.

Para criar o primeiro admin no Supabase SQL Editor:

```sql
-- 1. Criar usuário via Authentication > Users no dashboard Supabase
-- 2. Copiar o UUID e rodar:
insert into public.admin_users (user_id, email, is_admin)
values ('<UUID>', 'seu@email.com', true);
```

---

## Páginas do Admin

### Dashboard (`/admin`)
- 3 KPIs reais: total de veículos, disponíveis, destaques
- 2 KPIs mock: vendas no mês, leads ativos
- Gráficos mock: receita por mês, lucro por mês, leads por status, vendas recentes

### Veículos (`/admin/veiculos`)
- CRUD completo com upload de foto para Supabase Storage
- Expandable rows com formulário de edição inline
- Campos: marca, modelo, ano, preço, km, combustível, câmbio, cor, opcionais, destaque, disponível

### CRM (`/admin/crm`)
- Cadastro de leads com formulário expansível
- Filtros por status com contadores
- Lista de leads com click-to-select
- Painel de detalhe com edição de status + exclusão
- Dados reais do Supabase

### Vendas (`/admin/vendas`)
- KPIs calculados de vendas reais: total vendido, receita, lucro, ticket médio
- Registro de venda com formulário expansível
- Tabela de histórico com edição inline e exclusão
- Dados reais do Supabase

### Financeiro (`/admin/financeiro`)
- Cards de comparação: Esta Semana vs semana anterior, Este Mês vs mês anterior (delta ↑/↓ %)
- KPIs totais: receita, vendas totais, ticket médio
- Gráficos de barras: últimas 8 semanas e últimos 6 meses (período atual destacado)
- Tabela de despesas com CRUD (aluguel, marketing, manutenção, etc.)
- Dados reais do Supabase

---

## O que falta fazer

### Alta prioridade

- [ ] **Dashboard KPIs reais** — "Vendas no Mês", "Leads Ativos" e "Receita Mensal" ainda são valores mock hardcoded em `app/admin/page.tsx`. Conectar ao Supabase contando `sales` e `leads` do mês corrente.

- [ ] **Dashboard gráficos reais** — `components/dashboard-charts.tsx` usa dados mock. Substituir pelos dados reais de `sales` e `leads`.

### Média prioridade

- [ ] **Site público completo** — Página inicial tem o showroom de veículos. Falta: página "Sobre", "Contato", rodapé com redes sociais, SEO básico (metadata por veículo).

- [ ] **Notificações de novo lead** — Enviar WhatsApp ou e-mail quando um novo lead chegar (via Supabase Edge Function + webhook).

- [ ] **Responsivo mobile no admin** — A sidebar some em telas < 768px mas não tem menu hambúrguer alternativo.

### Baixa prioridade

- [ ] **Deploy no Vercel** — Projeto ainda não publicado. Configurar `vercel.json` ou `vercel.ts` e fazer push para produção.

- [ ] **Variável `SUPABASE_SERVICE_ROLE_KEY`** — Algumas operações de admin (criar usuário programaticamente, acessar dados fora do RLS) precisam da service role key no servidor.
