# Pendências — Henrique Veículos

> Atualizado: 2026-05-08

---

## ✅ Resolvido (esta sessão)

- **Painel admin reconstruído** do zero (Dashboard, Veículos, Cadastro, CRM, Financeiro, Vendas)
- **Login funcionando** com Supabase Auth + cookie SSR
- **RLS corrigido** — todas as políticas do banco (vehicles, leads, sales, storage) usam `EXISTS` inline em vez de `is_admin()` com problema de EXECUTE
- **Cadastro de veículo** — upload de imagem para bucket `vehicles` funcionando
- **Venda salva corretamente** — `client_name`, `cost_price` e `commission` estavam fora do schema Zod, agora salvam
- **CRM troca de status** — `onChange` não funcionava em Server Component; extraído para `LeadStatusSelect` (Client Component)
- **Status `em_negociacao`** — estava faltando no enum Zod (`leads.ts`) E no check constraint do banco (`leads_status_check`) — ambos corrigidos
- **Heading "DASHBOARD" gigante** — CSS de `legacy/styles.css` vazava para o admin; reset adicionado em `.admin-theme`
- **Fontes Rajdhani/Orbitron** — carregadas via Google Fonts em `app/layout.tsx`
- **Storage bucket `vehicles`** — policy de leitura pública adicionada
- **Fluxos testados e validados** — Create/Update/Delete em leads, vehicles e sales funcionando contra banco real; proteção de rota sem auth verificada; todas as páginas admin retornam HTTP 200

---

## 🔴 Bugs / bloqueadores

*(nenhum bloqueador conhecido no momento)*

---

## 🔴 Bugs / bloqueadores

*(nenhum bloqueador conhecido no momento)*

---

## 🟡 Funcionalidades faltando

### 1. ~~Confirmação antes de deletar~~ ✅ FEITO
`<DeleteButton>` (Client Component) com `window.confirm()` implementado em todos os lugares.

### 2. ~~Loading state nos formulários~~ ✅ FEITO
`<SubmitButton>` com `useFormStatus()` implementado.

### 3. ~~Página de edição de veículo~~ ✅ FEITO
`/admin/veiculos/editar?id=...` com formulário pré-preenchido e `updateVehicleAction`.

### 4. ~~Formulário de novo lead no CRM~~ ✅ FEITO
Form de `createLeadAction` no topo do CRM, com campos e `<SubmitButton>`.

### 5. ~~Paginação de veículos~~ ✅ FEITO
`/admin/veiculos` tem paginação com `PAGE_SIZE = 20` e `.range()`.

### 6. ~~Busca/filtro no estoque~~ ✅ FEITO
`<VehicleFilters>` com busca por `make/model` e filtro por status.

### 7. Paginação no CRM e Financeiro
CRM e Financeiro ainda carregam todos os registros. Implementar paginação semelhante à de veículos.

### 8. Busca no CRM
Sem campo de busca por nome/telefone na lista de leads.

---

## 🟢 Melhorias de UX

### 7. Upload de imagem com preview
O campo de foto no cadastro não mostra preview antes de salvar.

### 8. Gráfico mensal de receita
A página Financeiro tem KPIs mas sem gráfico.
`recharts` já está instalado — montar `BarChart` por mês.

### 9. Notificações de novos leads
Quando um lead entra pelo site, nada avisa no painel. Integrar Supabase Realtime ou webhook para WhatsApp.

### 10. Relatório de leads por origem
O CRM registra `source` mas não mostra breakdown visual (WhatsApp, Instagram, etc.).

---

## 🔧 Dívida técnica

### 11. Página `/veiculo/[id]` acoplada ao CSS legado
Usa classes `.modal-*` do CSS da home. Criar classes `.vp-*` próprias para desacoplar.

### 12. Imagens com `<img>` em vez de `<Image>` do Next.js
Substituir para lazy-load automático e geração WebP.

### 13. "Esqueci minha senha" no login
O botão existe mas não faz nada. Implementar:
```ts
await supabase.auth.resetPasswordForEmail(email, { redirectTo: "/reset-senha" });
```

---

## 📦 Deploy / infraestrutura

### 14. Vercel — variáveis de ambiente
Confirmar no dashboard Vercel que estão configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 15. Domínio personalizado
O `metadataBase` aponta para `https://www.henriqueveiculos.com.br`. Configurar DNS apontando para o projeto Vercel.

### 16. Migrations Supabase versionadas
As migrations aplicadas via MCP nesta sessão não estão em `supabase/migrations/`. Rodar:
```bash
supabase db pull
```
para sincronizar o histórico local com o banco remoto antes do próximo deploy.
