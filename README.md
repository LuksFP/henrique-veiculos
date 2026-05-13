# Henrique Veículos

Site público + painel admin para concessionária de seminovos. Next.js 16 App Router + Supabase + design dark neon lime.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Estilo | CSS puro com design system próprio (dark + neon lime), sem Tailwind |
| Fontes | Archivo Black (display), Barlow (body), Yellowtail (script) via Google Fonts |
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

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Estrutura do projeto

```
app/
  page.tsx                      → Showroom público (lista de veículos)
  login/page.tsx                → Login admin
  contato/page.tsx              → Página de contato com formulário de lead
  financiamento/page.tsx        → Simulador de financiamento + formulário de lead
  consignacao/page.tsx          → Simulador de consignação + formulário de lead
  avaliacao/page.tsx            → Formulário de avaliação de veículo usado
  empresa/page.tsx              → Sobre a loja
  admin/
    layout.tsx                  → Shell com sidebar fixa (240px)
    loading.tsx                 → Barra de loading animada (lime) para todas as rotas admin
    page.tsx                    → Dashboard (KPIs + gráficos)
    veiculos/page.tsx           → CRUD de veículos + upload de foto
    crm/page.tsx                → Gestão de leads
    vendas/page.tsx             → Histórico de vendas com CRUD
    financeiro/page.tsx         → Ganhos semanais/mensais + despesas operacionais

components/
  admin-sidebar.tsx             → Sidebar com navegação ativa
  brand-logo.tsx                → Logo com tipografia script + bandeira checkered
  dashboard-charts.tsx          → Gráficos do dashboard (mock)
  crm-client.tsx                → Client component: filtros (status + source) + painel de lead
  financing-calculator.tsx      → Simulador de parcelas (PMT) — 3 cenários de taxa
  consignment-calculator.tsx    → Simulador de valor líquido de consignação
  financeiro-charts.tsx         → Client component: gráficos semanais/mensais de vendas
  home-experience.tsx           → Client component: seção de serviços na home (prefetch via Link)
  scroll-reveal.tsx             → Client component: IntersectionObserver para animações de entrada
  vehicle-gallery.tsx           → Galeria de fotos (múltiplas imagens por veículo)
  vehicles-table.tsx            → Client component: tabela com busca/filtro de veículos

app/actions/
  auth.ts                       → loginAction, logoutAction
  vehicles.ts                   → createVehicleAction, updateVehicleAction, deleteVehicleAction
  leads.ts                      → createLeadAction, updateLeadAction, deleteLeadAction
  sales.ts                      → createSaleAction, updateSaleAction, deleteSaleAction
  expenses.ts                   → createExpenseAction, deleteExpenseAction
  public-leads.ts               → submitPublicLeadAction (formulários públicos com honeypot anti-bot)

proxy.ts                        → Proteção de /admin/* na borda (Next.js 16 proxy convention)

e2e/
  helpers/auth.ts               → login() helper e credenciais do usuário de teste
  auth.spec.ts                  → 3 testes: login, senha errada, logout
  veiculos.spec.ts              → 4 testes: criar, busca filtra, busca vazia, editar
  crm.spec.ts                   → 5 testes: criar, filtro status, selecionar, mudar status, excluir
  vendas.spec.ts                → 3 testes: criar, editar, excluir
  financeiro.spec.ts            → 2 testes: criar despesa, excluir despesa

lib/
  supabase/server.ts            → Cliente Supabase para Server Components
  supabase/browser.ts           → Cliente Supabase para Client Components
  database.types.ts             → Tipos gerados: VehicleRow, LeadRow, SaleRow
  fmt.ts                        → Utilitários compartilhados: formatCurrency, pad, toISO, MONTH_LABELS
  vehicles.ts                   → getVehicles() com fallback estático
  env.ts                        → getSupabaseEnv() — guard seguro sem asserções

supabase/migrations/
  20260429190000_core_schema.sql            → vehicles, vehicle_images, profiles
  20260429190100_rls_policies.sql           → RLS para vehicles/profiles
  20260429190200_storage_bucket.sql         → Bucket vehicle-photos
  20260429201000_initial_schema.sql         → Schema completo com admin_users
  20260506000000_sales_cost_commission.sql  → cost_price, commission, client_name em sales
  20260509000000_vehicle_images_gallery.sql → Tabela vehicle_images para galeria múltipla
  20260509000100_expenses_table.sql         → Tabela expenses (despesas operacionais)

legacy/
  styles.css                    → Design system CSS do site público e admin
```

---

## Banco de dados (Supabase)

### Tabelas

#### `vehicles`
Estoque de veículos. Campos: `make`, `model`, `year`, `km`, `fuel`, `transmission`, `color`, `price` (text), `options` (array), `image_url`, `image_path`, `bg` (gradient CSS), `is_featured`, `is_available`, `sort_order`.

#### `admin_users`
Controle de acesso admin. Vinculado a `auth.users`. Campo `is_admin: boolean`.

#### `leads`
Leads do CRM. Campos: `name`, `phone`, `email`, `vehicle_label`, `status` (`novo | contato | proposta | fechado | perdido`), `source` (`whatsapp | site | indicacao | instagram | outro | avaliacao | consignacao | financiamento`), `notes`.

#### `sales`
Registro de vendas. Campos: `make`, `model`, `year`, `client_name`, `sale_price`, `cost_price`, `commission`, `payment_method` (`a_vista | financiado | consorcio | troca`), `sale_date`, `lead_id` (FK opcional).

#### `expenses`
Despesas operacionais. Campos: `description`, `amount`, `category`, `expense_date`.

### RLS (Row Level Security)

| Tabela | Acesso |
|--------|--------|
| `vehicles` | Leitura pública (`is_available = true`), escrita só admin |
| `admin_users` | Só admin ou o próprio usuário |
| `leads` | Insert público (anon) via `public_insert_leads`; leitura/edição só admin |
| `sales` | Só admin |
| `expenses` | Só admin |

### Storage

Bucket `vehicles` (público): fotos de veículos. Upload/update/delete só admin.

---

## Autenticação

Login via Supabase Auth (`signInWithPassword`). Admin é verificado pela tabela `admin_users` — ter conta não é suficiente, precisa ter `is_admin = true`.

Proteção de rotas `/admin/*` feita via `proxy.ts` (edge, Next.js 16). A função `requireAdmin()` nas pages server-side é a segunda camada (verifica `is_admin` no DB).

Para criar o primeiro admin no Supabase SQL Editor:

```sql
-- 1. Criar usuário via Authentication > Users no dashboard Supabase
-- 2. Copiar o UUID e rodar:
insert into public.admin_users (user_id, email, is_admin)
values ('<UUID>', 'seu@email.com', true);
```

---

## Site Público

### Showroom (`/`)
- Grid de veículos disponíveis com foto, specs e preço
- Animações de scroll via IntersectionObserver (`ScrollReveal`)
- Links prefetchados via `next/link`

### Financiamento (`/financiamento`)
- Simulador interativo de parcelas: valor do veículo, entrada, nº de parcelas (12x–72x)
- 3 cenários de taxa: Melhor caso (1,29% a.m.), Típico (1,79% a.m.), Conservador (2,19% a.m.)
- Fórmula PMT padrão com total pago por cenário
- Formulário de lead captura interesse para o CRM

### Consignação (`/consignacao`)
- Simulador de valor líquido: preço de venda e comissão selecionável (5% / 7% / 10%)
- Exibe comissão e valor que o vendedor recebe
- Formulário de lead captura interesse para o CRM

### Avaliação (`/avaliacao`)
- Formulário de lead para avaliação de veículo usado
- Campos: marca, modelo, ano, km, combustível, câmbio

### Contato (`/contato`)
- Endereço, telefone, WhatsApp, e-mail, horário
- Formulário de contato geral

### Anti-spam
Todos os formulários públicos usam honeypot (`_hp`): bots preenchem o campo invisível e são silenciosamente ignorados pelo servidor.

---

## CRM Admin (`/admin/crm`)

- Cadastro de leads com formulário expansível
- Filtros por **status** (Novo · Contato · Proposta · Fechado · Perdido) com contadores
- Filtros por **origem** (Avaliação · Consignação · Financiamento · WhatsApp · Site) com contadores
- Lista de leads com click-to-select
- Painel de detalhe com edição de status + exclusão
- Exibe origem do lead com ícone
- Dados reais do Supabase

---

## O que falta fazer

### Alta prioridade

- [ ] **Dashboard KPIs reais** — "Vendas no Mês", "Leads Ativos" e "Receita Mensal" ainda são valores mock hardcoded em `app/admin/page.tsx`. Conectar ao Supabase contando `sales` e `leads` do mês corrente.

- [ ] **Dashboard gráficos reais** — `components/dashboard-charts.tsx` usa dados mock. Substituir pelos dados reais de `sales` e `leads`.

### Média prioridade

- [ ] **Notificações de novo lead** — Enviar WhatsApp ou e-mail quando um novo lead chegar (via Supabase Edge Function + webhook).

- [ ] **Responsivo mobile no admin** — A sidebar some em telas < 768px mas não tem menu hambúrguer alternativo.

### Baixa prioridade

- [ ] **Variável `SUPABASE_SERVICE_ROLE_KEY`** — Algumas operações de admin (criar usuário programaticamente, acessar dados fora do RLS) precisam da service role key no servidor.
