import { Plus, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { FinanceiroCharts } from "@/components/financeiro-charts";
import { createExpenseAction, deleteExpenseAction } from "@/app/actions/expenses";
import type { ExpenseRow, SaleRow } from "@/lib/database.types";
import { pad, toISO, formatCurrency } from "@/lib/fmt";

const CATEGORY_LABELS: Record<ExpenseRow["category"], string> = {
  aluguel: "Aluguel",
  folha: "Folha",
  manutencao: "ManutenÃ§Ã£o",
  marketing: "Marketing",
  outros: "Outros",
};

async function getPageData() {
  const supabase = await requireAdmin();
  const [salesRes, expensesRes] = await Promise.all([
    supabase.from("sales").select("*").order("sale_date", { ascending: true }),
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
  ]);
  return {
    sales: (salesRes.data ?? []) as SaleRow[],
    expenses: (expensesRes.data ?? []) as ExpenseRow[],
  };
}

const fmt = formatCurrency;

function pctDelta(current: number, prev: number) {
  if (prev === 0) return null;
  const pct = Math.round(((current - prev) / prev) * 100);
  return { text: `${pct >= 0 ? "+" : ""}${pct}%`, positive: pct >= 0 };
}

const OK: Record<string, string> = {
  expense_created: "Despesa cadastrada.",
  expense_deleted: "Despesa excluÃ­da.",
};

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const [{ sales, expenses }, params] = await Promise.all([getPageData(), searchParams]);

  const now = new Date();
  const daysSinceMonday = (now.getDay() + 6) % 7;

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - daysSinceMonday);
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const thisWeekStr = toISO(thisWeekStart);
  const lastWeekStr = toISO(lastWeekStart);

  const thisMonthPrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthPrefix = `${lastMonthDate.getFullYear()}-${pad(lastMonthDate.getMonth() + 1)}`;

  const thisWeekSales = sales.filter((s) => s.sale_date >= thisWeekStr);
  const lastWeekSales = sales.filter((s) => s.sale_date >= lastWeekStr && s.sale_date < thisWeekStr);
  const thisMonthSales = sales.filter((s) => s.sale_date.startsWith(thisMonthPrefix));
  const lastMonthSales = sales.filter((s) => s.sale_date.startsWith(lastMonthPrefix));

  const sum = (arr: SaleRow[]) => arr.reduce((acc, s) => acc + Number(s.sale_price), 0);

  const thisWeekReceita = sum(thisWeekSales);
  const lastWeekReceita = sum(lastWeekSales);
  const thisMonthReceita = sum(thisMonthSales);
  const lastMonthReceita = sum(lastMonthSales);

  const weekDelta = pctDelta(thisWeekReceita, lastWeekReceita);
  const monthDelta = pctDelta(thisMonthReceita, lastMonthReceita);

  const totalReceita = sum(sales);
  const ticketMedio = sales.length > 0 ? Math.round(totalReceita / sales.length) : 0;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Financeiro</h1>
          <p className="adm-page-sub">Ganhos por semana e por mÃªs</p>
        </div>
      </div>

      {params.error && <div className="adm-alert adm-alert--err">{params.error}</div>}
      {params.success && OK[params.success] && <div className="adm-alert adm-alert--ok">{OK[params.success]}</div>}

      <div className="fin-period-cards">
        <div className="fin-period-card">
          <div className="fin-period-head">
            <span className="fin-period-title">Esta Semana</span>
            {weekDelta && (
              <span className={`fin-delta fin-delta--${weekDelta.positive ? "up" : "down"}`}>
                {weekDelta.positive ? "â†‘" : "â†“"} {weekDelta.text} vs anterior
              </span>
            )}
          </div>
          <div className="fin-period-value">{fmt(thisWeekReceita)}</div>
          <div className="fin-period-count">
            {thisWeekSales.length} venda{thisWeekSales.length !== 1 ? "s" : ""} esta semana
          </div>
          <div className="fin-period-prev">
            Semana anterior: <strong>{fmt(lastWeekReceita)}</strong> Â· {lastWeekSales.length} venda{lastWeekSales.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="fin-period-card">
          <div className="fin-period-head">
            <span className="fin-period-title">Este MÃªs</span>
            {monthDelta && (
              <span className={`fin-delta fin-delta--${monthDelta.positive ? "up" : "down"}`}>
                {monthDelta.positive ? "â†‘" : "â†“"} {monthDelta.text} vs anterior
              </span>
            )}
          </div>
          <div className="fin-period-value">{fmt(thisMonthReceita)}</div>
          <div className="fin-period-count">
            {thisMonthSales.length} venda{thisMonthSales.length !== 1 ? "s" : ""} este mÃªs
          </div>
          <div className="fin-period-prev">
            MÃªs anterior: <strong>{fmt(lastMonthReceita)}</strong> Â· {lastMonthSales.length} venda{lastMonthSales.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="dash-kpis" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="dash-kpi">
          <div className="dash-kpi-icon">ðŸ’°</div>
          <div className="dash-kpi-value">{fmt(totalReceita)}</div>
          <div className="dash-kpi-label">Receita Total</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon">ðŸš—</div>
          <div className="dash-kpi-value">{sales.length}</div>
          <div className="dash-kpi-label">Vendas Totais</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon">ðŸ·ï¸</div>
          <div className="dash-kpi-value">{fmt(ticketMedio)}</div>
          <div className="dash-kpi-label">Ticket MÃ©dio</div>
        </div>
      </div>

      <FinanceiroCharts sales={sales} />

      <details className="adm-card adm-form-card">
        <summary className="adm-card-head">
          <h2 className="adm-card-title">Registrar Despesa</h2>
          <span className="adm-card-toggle">â€º</span>
        </summary>
        <div className="adm-card-body">
          <form className="adm-form" action={createExpenseAction}>
            <div className="adm-field">
              <label className="adm-label">DescriÃ§Ã£o</label>
              <input className="adm-input" name="description" required placeholder="Aluguel do galpÃ£o" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Valor (R$)</label>
              <input className="adm-input" name="amount" type="number" step="0.01" required placeholder="3500" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Categoria</label>
              <select className="adm-input" name="category" defaultValue="outros">
                {(Object.entries(CATEGORY_LABELS) as [ExpenseRow["category"], string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-label">Data</label>
              <input
                className="adm-input"
                name="expense_date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="adm-field adm-field--wide">
              <label className="adm-label">ObservaÃ§Ãµes</label>
              <textarea className="adm-input adm-textarea" name="notes" placeholder="Detalhe opcional..." />
            </div>
            <div className="adm-form-foot">
              <button className="adm-btn-primary" type="submit"><Plus size={15} /> Registrar Despesa</button>
            </div>
          </form>
        </div>
      </details>

      <div className="adm-card">
        <div className="adm-card-head adm-card-head--static">
          <h3 className="adm-card-title">Despesas Operacionais</h3>
          <span className="adm-tag adm-tag--muted">{expenses.length} registro{expenses.length !== 1 ? "s" : ""}</span>
        </div>
        {expenses.length === 0 ? (
          <p className="adm-empty">Nenhuma despesa cadastrada.</p>
        ) : (
          <>
            <div className="fin-table-head" style={{ gridTemplateColumns: "1fr 120px 100px 110px 60px" }}>
              <span>DescriÃ§Ã£o</span>
              <span>Categoria</span>
              <span>Data</span>
              <span style={{ textAlign: "right" }}>Valor</span>
              <span />
            </div>
            {expenses.map((e) => (
              <div key={e.id} className="fin-table-row" style={{ gridTemplateColumns: "1fr 120px 100px 110px 60px" }}>
                <div>
                  <div className="fin-td-main">{e.description}</div>
                  {e.notes && <div className="fin-td-muted">{e.notes}</div>}
                </div>
                <span className="adm-tag adm-tag--muted">{CATEGORY_LABELS[e.category]}</span>
                <span className="fin-td-muted">{new Date(e.expense_date).toLocaleDateString("pt-BR")}</span>
                <span className="fin-td-value fin-td-value--neg">
                  âˆ’ R$ {Number(e.amount).toLocaleString("pt-BR")}
                </span>
                <form action={deleteExpenseAction} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="adm-btn-danger" type="submit" style={{ height: 30, padding: "0 10px", fontSize: "0.7rem" }}>
                    <Trash2 size={13} />
                  </button>
                </form>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
