export const dynamic = "force-dynamic";

import { Plus, Save, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createSaleAction, updateSaleAction, deleteSaleAction } from "@/app/actions/sales";
import type { SaleRow, VehicleRow, LeadRow } from "@/lib/database.types";

async function getPageData() {
  const supabase = await requireAdmin();

  const [salesRes, vehiclesRes, leadsRes] = await Promise.all([
    supabase
      .from("sales")
      .select("*")
      .order("sale_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("vehicles")
      .select("id, make, model, year, is_available")
      .order("make").order("model"),
    supabase
      .from("leads")
      .select("id, name, status")
      .not("status", "in", '("fechado","perdido")')
      .order("name"),
  ]);

  return {
    sales: salesRes.data ?? [],
    vehicles: vehiclesRes.data ?? [],
    leads: leadsRes.data ?? [],
  };
}

type VehicleOption = Pick<VehicleRow, "id" | "make" | "model" | "year" | "is_available">;
type LeadOption = Pick<LeadRow, "id" | "name" | "status">;

function Fields({
  s,
  vehicles,
  leads,
}: {
  s?: SaleRow;
  vehicles: VehicleOption[];
  leads: LeadOption[];
}) {
  const availableVehicles = vehicles.filter((v) => v.is_available || v.id === s?.vehicle_id);

  return (
    <>
      {s && <input type="hidden" name="id" value={s.id} />}
      <div className="adm-field">
        <label className="adm-label">Marca</label>
        <input className="adm-input" name="make" defaultValue={s?.make ?? ""} required placeholder="TOYOTA" />
      </div>
      <div className="adm-field">
        <label className="adm-label">Modelo</label>
        <input className="adm-input" name="model" defaultValue={s?.model ?? ""} required placeholder="COROLLA XLS" />
      </div>
      <div className="adm-field">
        <label className="adm-label">Ano</label>
        <input className="adm-input" name="year" type="number" defaultValue={s?.year ?? new Date().getFullYear()} required />
      </div>
      <div className="adm-field">
        <label className="adm-label">Cliente</label>
        <input className="adm-input" name="client_name" defaultValue={s?.client_name ?? ""} required placeholder="Pedro Augusto" />
      </div>
      <div className="adm-field">
        <label className="adm-label">Valor de Venda (R$)</label>
        <input className="adm-input" name="sale_price" type="number" step="0.01" defaultValue={s?.sale_price ?? ""} required placeholder="89900" />
      </div>
      <div className="adm-field">
        <label className="adm-label">Custo de Aquisição (R$)</label>
        <input className="adm-input" name="cost_price" type="number" step="0.01" defaultValue={s?.cost_price ?? 0} placeholder="75000" />
      </div>
      <div className="adm-field">
        <label className="adm-label">Comissão (R$)</label>
        <input className="adm-input" name="commission" type="number" step="0.01" defaultValue={s?.commission ?? 0} placeholder="900" />
      </div>
      <div className="adm-field">
        <label className="adm-label">Forma de Pagamento</label>
        <select className="adm-input" name="payment_method" defaultValue={s?.payment_method ?? "a_vista"}>
          <option value="a_vista">À Vista</option>
          <option value="financiado">Financiado</option>
          <option value="consorcio">Consórcio</option>
          <option value="troca">Troca</option>
        </select>
      </div>
      <div className="adm-field">
        <label className="adm-label">Data da Venda</label>
        <input
          className="adm-input"
          name="sale_date"
          type="date"
          defaultValue={s?.sale_date ?? new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="adm-field">
        <label className="adm-label">Veículo do Estoque</label>
        <select className="adm-input" name="vehicle_id" defaultValue={s?.vehicle_id ?? ""}>
          <option value="">— Nenhum —</option>
          {availableVehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.make} {v.model} {v.year}
              {!v.is_available && v.id === s?.vehicle_id ? " (vendido)" : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="adm-field">
        <label className="adm-label">Lead Vinculado</label>
        <select className="adm-input" name="lead_id" defaultValue={s?.lead_id ?? ""}>
          <option value="">— Nenhum —</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>
      <div className="adm-field adm-field--wide">
        <label className="adm-label">Observações</label>
        <textarea className="adm-input adm-textarea" name="notes" defaultValue={s?.notes ?? ""} placeholder="Anotações da venda..." />
      </div>
    </>
  );
}

const paymentLabel: Record<SaleRow["payment_method"], string> = {
  a_vista: "À Vista",
  financiado: "Financiado",
  consorcio: "Consórcio",
  troca: "Troca",
};

const OK: Record<string, string> = {
  created: "Venda registrada.",
  updated: "Venda atualizada.",
  deleted: "Venda excluída.",
};

export default async function VendasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { sales, vehicles, leads } = await getPageData();
  const params = await searchParams;

  const totalVendas = sales.reduce((s, v) => s + Number(v.sale_price), 0);
  const totalLucro = sales.reduce((s, v) => s + (Number(v.sale_price) - Number(v.cost_price)), 0);
  const totalComissao = sales.reduce((s, v) => s + Number(v.commission), 0);
  const ticketMedio = sales.length > 0 ? Math.round(totalVendas / sales.length) : 0;

  function fmt(v: number) {
    if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
    return `R$ ${v.toLocaleString("pt-BR")}`;
  }

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Vendas</h1>
          <p className="adm-page-sub">{sales.length} venda{sales.length !== 1 ? "s" : ""} registrada{sales.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {params.error && <div className="adm-alert adm-alert--err">{params.error}</div>}
      {params.success && OK[params.success] && <div className="adm-alert adm-alert--ok">{OK[params.success]}</div>}

      <div className="dash-kpis" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="dash-kpi">
          <div className="dash-kpi-icon">🚗</div>
          <div className="dash-kpi-value">{sales.length}</div>
          <div className="dash-kpi-label">Veículos Vendidos</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon">💵</div>
          <div className="dash-kpi-value">{fmt(totalVendas)}</div>
          <div className="dash-kpi-label">Receita Total</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon">📈</div>
          <div className="dash-kpi-value">{fmt(totalLucro)}</div>
          <div className="dash-kpi-label">Lucro Total</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-icon">🏷️</div>
          <div className="dash-kpi-value">{fmt(ticketMedio)}</div>
          <div className="dash-kpi-label">Ticket Médio</div>
        </div>
      </div>

      <details className="adm-card adm-form-card">
        <summary className="adm-card-head">
          <h2 className="adm-card-title">Registrar Venda</h2>
          <span className="adm-card-toggle">›</span>
        </summary>
        <div className="adm-card-body">
          <form className="adm-form" action={createSaleAction}>
            <Fields vehicles={vehicles} leads={leads} />
            <div className="adm-form-foot">
              <button className="adm-btn-primary" type="submit">
                <Plus size={15} /> Registrar Venda
              </button>
            </div>
          </form>
        </div>
      </details>

      <div className="adm-card">
        <div className="adm-card-head adm-card-head--static">
          <h3 className="adm-card-title">Histórico</h3>
          <span className="adm-tag adm-tag--muted">Comissões: R$ {totalComissao.toLocaleString("pt-BR")}</span>
        </div>

        {sales.length === 0 ? (
          <p className="adm-empty">Nenhuma venda registrada.</p>
        ) : (
          <>
            <div className="vend-table-head">
              <span>Veículo</span>
              <span>Cliente</span>
              <span>Data</span>
              <span>Valor</span>
              <span>Lucro</span>
              <span>Comissão</span>
            </div>
            {sales.map((v) => {
              const lucro = Number(v.sale_price) - Number(v.cost_price);
              return (
                <details className="adm-table-row" key={v.id}>
                  <summary className="vend-table-row" style={{ cursor: "pointer", listStyle: "none" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "oklch(0.97 0.005 260)" }}>
                        {v.make} {v.model} {v.year}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "oklch(0.55 0.015 260)" }}>{paymentLabel[v.payment_method]}</div>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "oklch(0.75 0.015 260)" }}>{v.client_name}</div>
                    <div style={{ fontSize: "0.78rem", color: "oklch(0.55 0.015 260)" }}>
                      {new Date(v.sale_date).toLocaleDateString("pt-BR")}
                    </div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "oklch(0.85 0.25 125)" }}>
                      R$ {Number(v.sale_price).toLocaleString("pt-BR")}
                    </div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: lucro >= 0 ? "oklch(0.65 0.18 145)" : "oklch(0.82 0.14 27)" }}>
                      {lucro >= 0 ? "+" : ""}R$ {lucro.toLocaleString("pt-BR")}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "oklch(0.75 0.2 90)" }}>
                      R$ {Number(v.commission).toLocaleString("pt-BR")}
                    </div>
                  </summary>
                  <div className="adm-row-edit">
                    <form className="adm-form" action={updateSaleAction}>
                      <Fields s={v} vehicles={vehicles} leads={leads} />
                      <div className="adm-form-foot">
                        <button className="adm-btn-primary" type="submit"><Save size={15} /> Salvar</button>
                      </div>
                    </form>
                    <form className="adm-row-delete" action={deleteSaleAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <button className="adm-btn-danger" type="submit"><Trash2 size={15} /> Excluir</button>
                    </form>
                  </div>
                </details>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
