# Pendências — Henrique Veículos

## 🔴 Bugs conhecidos

### Login — layout quebrado
O card não centraliza na tela. O CSS usa `display: grid; place-items: center` mas o Tailwind v4 pode estar
conflitando com o preflight. Investigar com DevTools no Chrome:
- Inspecionar `<main class="login-page">` e confirmar se `display: grid` está sendo aplicado
- Se o preflight sobrescreve, encapsular o CSS do login em `@layer components { ... }`

---

## 🟡 Funcionalidades incompletas

### 1. Nav ativa no painel admin
Os links Estoque / CRM / Financeiro nunca ficam "selected". Precisa ler o pathname no Server Component
e adicionar a classe `is-active` dinamicamente:
```tsx
// app/admin/layout.tsx — adicionar:
import { headers } from "next/headers";
const h = await headers();
const pathname = h.get("x-pathname") ?? "";
// ou usar: import { usePathname } from "next/navigation" em Client Component
```

### 2. Confirmação antes de deletar
Deletar veículo, lead ou venda não pede confirmação. Adicionar `<dialog>` ou `confirm()` simples.

### 3. Loading state nos formulários
Nenhum formulário tem spinner/feedback visual enquanto a Server Action executa.
Criar `<SubmitButton>` com `useFormStatus()`:
```tsx
"use client";
import { useFormStatus } from "react-dom";
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Aguarde..." : label}</button>;
}
```

### 4. Paginação
- `/admin` (estoque): sem limite, carrega todos os veículos
- `/admin/crm`: sem limite, carrega todos os leads
- `/admin/financeiro`: sem limite, carrega todas as vendas
Adicionar `range()` no Supabase + controles de página simples.

### 5. Busca/filtro no estoque admin
Não há como buscar por marca/modelo na lista de veículos cadastrados.

---

## 🟢 Melhorias de UX / produto

### 6. Upload de imagem com preview
O campo de foto no formulário de veículo não mostra preview antes de salvar.

### 7. Ordenação drag-and-drop no estoque
O campo `sort_order` é numérico manual. Seria melhor ter drag-and-drop para reordenar.

### 8. Dashboard com gráfico de vendas
A página Financeiro tem KPIs mas não tem gráfico mensal de receita.
Considerar `recharts` ou `chart.js`.

### 9. Notificações de novos leads
Quando um lead é criado pelo site (WhatsApp, formulário), não há alerta no painel.

### 10. Relatório de leads por origem
O CRM registra `source` (WhatsApp, Instagram, etc.) mas não mostra breakdown visual.

---

## 🔧 Dívida técnica

### 11. Página `/veiculo/[id]` usa classes `.modal-*`
Acoplada ao CSS da home. Criar classes `.vp-*` próprias para desacoplar.

### 12. Imagens com `<img>` ao invés de `<Image>` do Next.js
Nenhuma imagem usa o componente otimizado. Substituir para lazy-load e WebP automático.

### 13. Autenticação: "Lembrar-me" e "Esqueci minha senha"
Os dois controles existem na tela de login mas não fazem nada.
- Lembrar-me: Supabase já persiste sessão por padrão — só remover o campo ou wired correctly
- Esqueci minha senha: implementar `supabase.auth.resetPasswordForEmail(email)`

### 14. Variável de ambiente `SUPABASE_SERVICE_ROLE_KEY` ausente
Algumas operações futuras (criar admin via script) precisam da service role. Não exposta no `.env.local`.

---

## 📦 Deploy / infraestrutura

### 15. Vercel — variáveis de ambiente
Confirmar que as seguintes variáveis estão configuradas no projeto Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 16. Supabase — migrations em produção
As migrations em `supabase/migrations/` precisam ser aplicadas no projeto produção (`ejpmvugkxkwbbeokhskk`):
```bash
supabase db push --linked
```

### 17. Storage bucket `vehicles` — policy pública
Confirmar que o bucket tem política `public read` para URLs de imagem funcionarem no site público.

### 18. Domínio personalizado
O `metadataBase` aponta para `https://www.henriqueveiculos.com.br`. Configurar DNS no Vercel.
