# TODO — Henrique Veículos

Estado atual: sistema funcional com admin completo e showroom público.
Este documento lista **só o que falta** — do mais crítico ao cosmético.

---

## 🔴 Bugs confirmados

### 1. Botão de login sem estilo
`app/login/page.tsx` usa `className="admin-button"` mas essa classe não existe em nenhum CSS.
O botão aparece sem estilo nenhum.

**Fix**: em `globals.css`, adicionar:
```css
.admin-button { /* mesmo estilo que .adm-btn-primary */ }
```
Ou trocar o className para `adm-btn-primary` diretamente.

---

### 2. Ordenação do showroom usa lista hardcoded
`components/home-experience.tsx` linha 322–330 prioriza veículos por modelo hardcoded
(`["HB20 1.0 CONFOR", "ARGO", "HB20S", "PCX"]`) ignorando o campo `sort_order` que já existe no banco.

**Fix**: remover o `showroomPriority` e usar `sort_order` (já vem ordenado do `getVehicles()`):
```ts
const showroomList = filteredVehicles; // sem re-sort
```

---

### 3. Links de redes sociais são placeholder
Instagram e Facebook no header e na seção de contato apontam para `"#"`.

**Fix**: substituir pelos links reais (pedir ao cliente) ou ocultar os ícones até ter os links.

---

## 🟠 Alta prioridade (funcionalidades faltando)

### 4. Mobile no admin — sem menu hambúrguer
A sidebar some em telas < 768px mas não tem alternativa.
O admin fica inacessível no celular.

**Fix**: adicionar botão hambúrguer no `adm-main` que abre a sidebar como drawer com overlay.
Requer adicionar estado em `AdminSidebar` ou criar um wrapper client component.

---

### 5. Galeria de fotos por veículo
Hoje cada veículo tem só uma foto (`image_url`). A tabela `vehicle_images` já existe no schema
mas não está integrada a nenhuma parte do sistema.

**O que falta**:
- Campo de upload múltiplo no formulário de veículo (`/admin/veiculos`)
- Server Action `addVehicleImageAction` e `deleteVehicleImageAction`
- Galeria no modal do showroom público (troca de fotos com setas)
- Query `vehicle_images` junto com `vehicles` no `getVehicles()`

---

### 6. Formulário de contato público → lead automático
O site tem uma seção de contato mas não tem formulário. Qualquer pessoa interessada vai
direto pro WhatsApp — não entra como lead no CRM.

**Fix**: adicionar form com nome, telefone e veículo de interesse na seção `#contato`.
Server Action `createLeadAction` (já existe) recebe os dados e cria o lead com `source: "site"`.

---

### 7. Tabela de despesas (saídas financeiras)
O Financeiro mostra custos de aquisição de veículos mas não tem onde registrar:
aluguel, folha de pagamento, manutenção, marketing etc.

**O que falta**:
- Migration: tabela `expenses` com `id, description, amount, category, expense_date`
- Server Action `createExpenseAction`, `deleteExpenseAction`
- Formulário expansível em `/admin/financeiro`
- Calcular custos totais reais (venda + despesas) nos KPIs

---

### 8. Integração de venda com estoque visual
Quando uma venda é registrada e o veículo é marcado como `is_available = false`,
o tag no admin mostra "Vendido" — correto. Mas o `is_available` controla também
a visibilidade no showroom público (veículo some do site automaticamente).

**Verificar**: confirmar se o comportamento é o desejado (veículo vendido some do site)
ou se deve mostrar com badge "Vendido". Ajustar a query de `getVehicles()` e o
`<StockRow>` conforme a decisão.

---

## 🟡 Média prioridade

### 9. Paginação / limite de registros
Todas as tabelas admin (`vehicles`, `leads`, `sales`) buscam todos os registros sem LIMIT.
Com >100 registros vai ficar lento.

**Fix**: adicionar `.range(0, 49)` nas queries e controles "Próxima página / Anterior"
ou scroll infinito com `IntersectionObserver`.

---

### 10. Busca e filtro no admin de veículos
A tabela de estoque no admin não tem campo de busca. Com muitos veículos fica difícil
achar um específico para editar.

**Fix**: adicionar um campo de busca client-side (igual ao showroom já tem) filtrando
por marca/modelo/ano nos dados já carregados.

---

### 11. Dashboard — filtro por período
O dashboard mostra receita do mês atual e histórico dos últimos 8 meses fixos.
Não tem como mudar o período.

**Fix**: adicionar seletor de mês/ano ou range de datas (requer transformar parte do
dashboard em Client Component com state).

---

### 12. Recuperação de senha
Não existe fluxo de "Esqueci minha senha". Se o admin perder acesso, só pelo
painel do Supabase.

**Fix**: página `/login/reset` com `supabase.auth.resetPasswordForEmail()` e
página `/login/nova-senha` para confirmar o token do e-mail.

---

## 🟢 Baixa prioridade (qualidade / produção)

### 13. Deploy no Vercel
Projeto não está publicado. Passos:
1. `vercel link` para conectar ao projeto
2. Conferir variáveis de ambiente no painel Vercel
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. `vercel --prod` ou push para `main` com auto-deploy

---

### 14. SEO — metadata por veículo
Hoje não há `<title>` ou `<meta description>` por página. Veículos não são indexáveis individualmente
porque abrem em modal (não têm URL própria).

**Fix**: criar rota `/veiculos/[slug]` com `generateMetadata()` do Next.js,
ou no mínimo adicionar metadata global no `app/layout.tsx`.

---

### 15. Favicon e meta imagem
Sem favicon customizado e sem `og:image`. Aparecer genérico ao compartilhar no WhatsApp.

---

### 16. `data/vehicles.ts` — fallback desatualizado
O arquivo `data/vehicles.ts` tem 18 veículos hardcoded usados como fallback quando o Supabase
não responde. Com o banco ativo, esse fallback nunca é usado — mas se as env vars sumissem,
o site mostraria dados de 2025/2026 falsos.

**Fix**: trocar o fallback por array vazio `[]` ou remover a lógica de fallback inteiramente.

---

### 17. Notificação de novo lead
Quando um lead entra (via formulário público ou admin), ninguém é notificado.

**Fix**: Supabase Edge Function ou webhook via `Database Webhooks` no painel do Supabase
disparando mensagem no WhatsApp/Telegram do admin via API.

---

## Resumo

| # | Item | Esforço |
|---|------|---------|
| 1 | Bug botão login sem estilo | 2 min |
| 2 | Bug ordenação showroom | 5 min |
| 3 | Links sociais placeholder | 5 min (pedir ao cliente) |
| 4 | Mobile admin hamburger | 2–3h |
| 5 | Galeria de fotos múltiplas | 4–6h |
| 6 | Form contato → lead automático | 1–2h |
| 7 | Tabela de despesas | 2–3h |
| 8 | Definir comportamento veículo vendido | 30min |
| 9 | Paginação | 2h |
| 10 | Busca no admin de veículos | 1h |
| 11 | Dashboard filtro por período | 2h |
| 12 | Recuperação de senha | 1–2h |
| 13 | Deploy Vercel | 30min |
| 14 | SEO / metadata | 1–2h |
| 15 | Favicon / og:image | 30min |
| 16 | Limpar fallback estático | 10min |
| 17 | Notificação de lead | 2–3h |
