import { Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createSaleAction, deleteSaleAction } from "@/app/actions/sales";
import type { SaleRow, VehicleRow, LeadRow } from "@/lib/database.types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const PAYMENT_LABELS: Record<string, string> = {
  a_vista: "À vista",
  financiado: "Financiado",
  consorcio: "Consórcio",
  troca: "Troca",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function getPageData() {
  const supabase = await createClient();
  if (!supabase) return { sales: [] as SaleRow[], vehicles: [] as VehicleRow[], leads: [] as LeadRow[] };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: admin } = await supabase
    .from("admin_users").select("is_admin").eq("user_id", user.id).eq("is_admin", true).maybeSingle();
  if (!admin?.is_admin) redirect("/login?error=not-admin");

  const [{ data: sales }, { data: vehicles }, { data: leads }] = await Promise.all([
    supabase.from("sales").select("*").order("sale_date", { ascending: false }),
    supabase.from("vehicles").select("id,make,model,year").eq("is_available", true).order("sort_order"),
    supabase.from("leads").select("id,name").order("created_at", { ascending: false }),
  ]);

  return { sales: sales ?? [], vehicles: vehicles ?? [], leads: leads ?? [] };
}

const successMessages: Record<string, string> = {
  created: "Venda registrada.",
  deleted: "Venda removida.",
};

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { sales, vehicles, leads } = await getPageData();
  const params = await searchParams;
  const errorMessage = params.error ?? null;
  const successMessage = params.success ? successMessages[params.success] ?? null : null;

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const salesThisMonth = sales.filter((s) => s.sale_date.startsWith(thisMonth));
  const revenueTotal = sales.reduce((sum, s) => sum + Number(s.sale_price), 0);
  const revenueMonth = salesThisMonth.reduce((sum, s) => sum + Number(s.sale_price), 0);
  const avgTicket = sales.length ? revenueTotal / sales.length : 0;

  return (
    <main className="admin-content">
      {errorMessage ? <p className="form-error" role="alert">{errorMessage}</p> : null}
      {successMessage ? <p className="form-success" role="status">{successMessage}</p> : null}

      {/* KPI cards */}
      <div className="fin-kpi-row">
        <div className="fin-kpi">
          <span className="fin-kpi-label">Vendas este mês</span>
          <strong className="fin-kpi-value">{salesThisMonth.length}</strong>
        </div>
        <div className="fin-kpi">
          <span className="fin-kpi-label">Receita este mês</span>
          <strong className="fin-kpi-value">{formatCurrency(revenueMonth)}</strong>
        </div>
        <div className="fin-kpi">
          <span className="fin-kpi-label">Total de vendas</span>
          <strong className="fin-kpi-value">{sales.length}</strong>
        </div>
        <div className="fin-kpi">
          <span className="fin-kpi-label">Ticket médio</span>
          <strong className="fin-kpi-value">{formatCurrency(avgTicket)}</strong>
        </div>
        <div className="fin-kpi">
          <span className="fin-kpi-label">Receita total</span>
          <strong className="fin-kpi-value">{formatCurrency(revenueTotal)}</strong>
        </div>
      </div>

      <div className="admin-layout">
        {/* Formulário nova venda */}
        <section className="admin-card">
          <span className="admin-card-kicker">Registrar</span>
          <h2>Nova venda</h2>
          <form className="admin-form" action={createSaleAction}>
            <label>
              Veículo (estoque)
              <select name="vehicle_id" id="vehicle_select">
                <option value="">— avulso / fora do estoque —</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} data-make={v.make} data-model={v.model} data-year={v.year}>
                    {v.make} {v.model} {v.year}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-form-row">
              <label>
                Marca *
                <input name="make" required placeholder="FIAT" />
              </label>
              <label>
                Ano *
                <input name="year" type="number" required min="1900" max="2100" defaultValue={now.getFullYear()} />
              </label>
            </div>
            <label>
              Modelo *
              <input name="model" required placeholder="ARGO 1.0" />
            </label>
            <div className="admin-form-row">
              <label>
                Preço de venda (R$) *
                <input name="sale_price" type="number" required min="0" step="0.01" placeholder="75990.00" />
              </label>
              <label>
                Data *
                <input name="sale_date" type="date" required defaultValue={now.toISOString().slice(0, 10)} />
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                Forma de pagamento
                <select name="payment_method">
                  {Object.entries(PAYMENT_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
              <label>
                Lead (cliente)
                <select name="lead_id">
                  <option value="">— sem lead —</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Observações
              <textarea name="notes" placeholder="Detalhes da negociação..." />
            </label>
            <button className="admin-button" type="submit">
              <Plus size={16} /> Registrar venda
            </button>
          </form>
        </section>

        {/* Histórico de vendas */}
        <section className="admin-card" style={{ minWidth: 0 }}>
          <span className="admin-card-kicker">Histórico</span>
          <h2>{sales.length} vendas registradas</h2>

          {sales.length === 0 ? (
            <p style={{ color: "#4a5a3a" }}>Nenhuma venda registrada ainda.</p>
          ) : (
            <div className="fin-sale-list">
              {sales.map((sale) => (
                <article className="fin-sale" key={sale.id}>
                  <div className="fin-sale-header">
                    <div>
                      <strong>{sale.make} {sale.model} {sale.year}</strong>
                      <span className="fin-sale-price">{formatCurrency(Number(sale.sale_price))}</span>
                    </div>
                    <div className="fin-sale-meta">
                      <span>{PAYMENT_LABELS[sale.payment_method] ?? sale.payment_method}</span>
                      <span>{new Date(sale.sale_date + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                  {sale.notes ? <p className="fin-sale-notes">{sale.notes}</p> : null}
                  <form action={deleteSaleAction}>
                    <input type="hidden" name="id" value={sale.id} />
                    <button type="submit" className="admin-button admin-danger" style={{ fontSize: "0.75rem", padding: "6px 10px" }}>
                      <Trash2 size={13} /> Remover
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
