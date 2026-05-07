# Pendências — Henrique Veículos

> Atualizado: 2026-05-07

---

## ✅ Resolvido (esta sessão)

- **Painel admin reconstruído** do zero (Dashboard, Veículos, Cadastro, CRM, Financeiro, Vendas)
- **Login funcionando** com Supabase Auth + cookie SSR
- **RLS corrigido** — todas as políticas do banco (vehicles, leads, sales, storage) usam `EXISTS` inline em vez de `is_admin()` com problema de EXECUTE
- **Cadastro de veículo** — upload de imagem para bucket `vehicles` funcionando
- **Venda salva corretamente** — `client_name`, `cost_price` e `commission` estavam fora do schema Zod, agora salvam
- **CRM troca de status** — `onChange` não funcionava em Server Component; extraído para `LeadStatusSelect` (Client Component)
- **Status `em_negociacao`** — estava faltando no enum de validação do Zod em `leads.ts`
- **Heading "DASHBOARD" gigante** — CSS de `legacy/styles.css` vazava para o admin; reset adicionado em `.admin-theme`
- **Fontes Rajdhani/Orbitron** — carregadas via Google Fonts em `app/layout.tsx`
- **Storage bucket `vehicles`** — policy de leitura pública adicionada

---

## 🔴 Bugs / bloqueadores

*(nenhum bloqueador conhecido no momento)*

---

## 🟡 Funcionalidades faltando

### 1. Confirmação antes de deletar
Deletar veículo, lead ou venda não pede confirmação — um clique acidental apaga tudo.
Implementar `<ConfirmButton>` (Client Component) com `window.confirm()` simples ou um `<dialog>`.

### 2. Loading state nos formulários
Nenhum formulário tem spinner/feedback visual enquanto a Server Action executa.
```tsx
"use client";
import { useFormStatus } from "react-dom";
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Salvando..." : label}</button>;
}
```

### 3. Página de edição de veículo
A lista `/admin/veiculos` tem botão de deletar e toggle de status, mas não tem edição completa.
Criar `/admin/veiculos/[id]/editar` com formulário pré-preenchido usando `updateVehicleAction`.

### 4. Formulário de novo lead no CRM
O CRM só lista leads vindos do site. Falta poder cadastrar lead manualmente pelo painel.
`createLeadAction` já existe em `app/actions/leads.ts` — só precisa de um form no topo da página.

### 5. Paginação
`/admin/veiculos`, `/admin/crm` e `/admin/financeiro` carregam todos os registros sem limite.
Adicionar `.range(0, 49)` no Supabase + controles de página simples.

### 6. Busca/filtro no estoque e CRM
Sem campo de busca na lista de veículos ou leads.

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
