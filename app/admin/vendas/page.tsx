import { createClient } from "@/lib/supabase/server";
import { createSaleAction, deleteSaleAction } from "@/app/actions/sales";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const paymentLabel: Record<string, string> = {
  a_vista: "À Vista",
  financiado: "Financiado",
  consorcio: "Consórcio",
  troca: "Troca",
};

const inputClass = {
  width: "100%",
  borderRadius: "0.5rem",
  border: "1px solid var(--input)",
  background: "var(--input)",
  color: "var(--foreground)",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
} as const;

export default async function AdminVendas() {
  const supabase = await createClient();
  const [{ data: sales }, { data: vehicles }] = await Promise.all([
    supabase!.from("sales").select("*").order("sale_date", { ascending: false }),
    supabase!.from("vehicles").select("id, make, model, year").eq("is_available", true),
  ]);

  const all = sales ?? [];
  const totalVendas = all.reduce((s, v) => s + Number(v.sale_price ?? 0), 0);
  const totalLucro = all.reduce((s, v) => s + (Number(v.sale_price ?? 0) - Number(v.cost_price ?? 0)), 0);
  const totalComissao = all.reduce((s, v) => s + Number(v.commission ?? 0), 0);
  const ticketMedio = all.length > 0 ? totalVendas / all.length : 0;

  return (
    <div>
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
      >
        Histórico de Vendas
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
        {all.length} vendas registradas
      </p>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Vendido", value: `R$ ${(totalVendas / 1000).toFixed(0)}k` },
          { label: "Lucro Total", value: `R$ ${(totalLucro / 1000).toFixed(0)}k` },
          { label: "Comissões", value: `R$ ${(totalComissao / 1000).toFixed(1)}k` },
          { label: "Ticket Médio", value: `R$ ${(ticketMedio / 1000).toFixed(0)}k` },
        ].map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{ border: "1px solid var(--border)", background: "var(--card)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
            >
              {kpi.value}
            </div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Register new sale */}
      <div
        className="mt-8 rounded-xl p-6"
        style={{ border: "1px solid var(--border)", background: "var(--card)" }}
      >
        <h3
          className="mb-4 text-lg font-bold"
          style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
        >
          Registrar Nova Venda
        </h3>
        <form action={createSaleAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
              Veículo do Estoque
            </label>
            <select name="vehicle_id" style={inputClass}>
              <option value="">— Não vincular —</option>
              {vehicles?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} {v.year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Marca *</label>
            <input required name="make" placeholder="Ex: TOYOTA" style={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Modelo *</label>
            <input required name="model" placeholder="Ex: COROLLA" style={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Ano *</label>
            <input required name="year" type="number" placeholder="2023" style={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Cliente *</label>
            <input required name="client_name" placeholder="Nome do cliente" style={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Valor de Venda *</label>
            <input required name="sale_price" type="number" placeholder="85000" style={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Custo de Compra</label>
            <input name="cost_price" type="number" placeholder="72000" style={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Comissão</label>
            <input name="commission" type="number" placeholder="2500" style={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Pagamento</label>
            <select name="payment_method" style={inputClass}>
              <option value="a_vista">À Vista</option>
              <option value="financiado">Financiado</option>
              <option value="consorcio">Consórcio</option>
              <option value="troca">Troca</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Data da Venda *</label>
            <input required name="sale_date" type="date" style={inputClass} defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Observações</label>
            <textarea name="notes" rows={2} placeholder="Observações da venda..." style={{ ...inputClass, minHeight: "64px", resize: "vertical" }} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <SubmitButton
              label="Salvar Venda"
              pendingLabel="Salvando..."
              className="rounded-lg px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all neon-glow"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                fontFamily: "Rajdhani, sans-serif",
              }}
            />
          </div>
        </form>
      </div>

      {/* Sales table */}
      <div
        className="mt-6 overflow-x-auto rounded-xl"
        style={{ border: "1px solid var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
              {["Veículo", "Cliente", "Data", "Pagamento", "Valor", "Lucro", "Comissão", ""].map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-left font-semibold ${h === "" ? "text-right" : ""}`}
                  style={{ color: "var(--foreground)", fontFamily: "Rajdhani, sans-serif" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {all.map((v) => (
              <tr key={v.id} style={{ borderBottom: "1px solid oklch(0.28 0.01 260 / 50%)" }}>
                <td className="px-4 py-3 font-medium" style={{ color: "var(--foreground)" }}>
                  {v.make} {v.model} {v.year}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{v.client_name ?? "—"}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>
                  {v.sale_date ? new Date(v.sale_date).toLocaleDateString("pt-BR") : "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>
                  {paymentLabel[v.payment_method ?? ""] ?? v.payment_method}
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--foreground)" }}>
                  R$ {Number(v.sale_price).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--primary)" }}>
                  {v.cost_price ? `R$ ${(Number(v.sale_price) - Number(v.cost_price)).toLocaleString("pt-BR")}` : "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>
                  {v.commission ? `R$ ${Number(v.commission).toLocaleString("pt-BR")}` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton action={deleteSaleAction} id={v.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {all.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            Nenhuma venda registrada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
