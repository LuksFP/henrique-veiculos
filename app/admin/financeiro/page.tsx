import { createClient } from "@/lib/supabase/server";
import { deleteSaleAction } from "@/app/actions/sales";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const paymentLabel: Record<string, string> = {
  a_vista: "À Vista",
  financiado: "Financiado",
  consorcio: "Consórcio",
  troca: "Troca",
};

export default async function AdminFinanceiro() {
  const supabase = await createClient();
  const { data: sales } = await supabase!
    .from("sales")
    .select("*")
    .order("sale_date", { ascending: false });

  const all = sales ?? [];

  // Monthly aggregation
  const byMonth: Record<string, { receita: number; custo: number; lucro: number; mes: string }> = {};
  for (const s of all) {
    const mes = s.sale_date?.slice(0, 7) ?? "desconhecido";
    if (!byMonth[mes]) {
      const [y, m] = mes.split("-");
      const label = new Date(`${y}-${m}-01`).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      byMonth[mes] = { receita: 0, custo: 0, lucro: 0, mes: label };
    }
    byMonth[mes].receita += Number(s.sale_price ?? 0);
    byMonth[mes].custo += Number(s.cost_price ?? 0);
    byMonth[mes].lucro += Number(s.sale_price ?? 0) - Number(s.cost_price ?? 0);
  }
  const meses = Object.values(byMonth).slice(-6);

  const receitaTotal = all.reduce((s, v) => s + Number(v.sale_price ?? 0), 0);
  const custoTotal = all.reduce((s, v) => s + Number(v.cost_price ?? 0), 0);
  const lucroTotal = receitaTotal - custoTotal;
  const margem = receitaTotal > 0 ? ((lucroTotal / receitaTotal) * 100).toFixed(1) : "0.0";

  const kpis = [
    { label: "Receita Total", value: `R$ ${(receitaTotal / 1000).toFixed(0)}k`, icon: "💵" },
    { label: "Custo Total", value: `R$ ${(custoTotal / 1000).toFixed(0)}k`, icon: "📉" },
    { label: "Lucro Total", value: `R$ ${(lucroTotal / 1000).toFixed(0)}k`, icon: "💰" },
    { label: "Margem", value: `${margem}%`, icon: "📈" },
    { label: "Vendas", value: all.length, icon: "🧾" },
  ];

  return (
    <div>
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
      >
        Financeiro
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
        Balanços e relatórios financeiros
      </p>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{ border: "1px solid var(--border)", background: "var(--card)" }}
          >
            <span className="text-xl">{kpi.icon}</span>
            <div
              className="mt-2 text-2xl font-bold"
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

      {/* Monthly table */}
      {meses.length > 0 && (
        <div
          className="mt-8 rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}
          >
            <h3
              className="font-bold"
              style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
            >
              Resumo por Mês
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
                {["Mês", "Receita", "Custo", "Lucro", "Margem"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold"
                    style={{ color: "var(--foreground)", fontFamily: "Rajdhani, sans-serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meses.map((m, i) => {
                const margem2 = m.receita > 0 ? ((m.lucro / m.receita) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(0.28 0.01 260 / 50%)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--foreground)" }}>{m.mes}</td>
                    <td className="px-4 py-3" style={{ color: "var(--primary)" }}>R$ {m.receita.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3" style={{ color: "oklch(0.58 0.22 27)" }}>R$ {m.custo.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--foreground)" }}>R$ {m.lucro.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{margem2}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Sales list */}
      <div
        className="mt-6 rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}
        >
          <h3
            className="font-bold"
            style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
          >
            Todas as Vendas
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
              {["Veículo", "Cliente", "Data", "Pagamento", "Valor", "Lucro", ""].map((h, i) => (
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
            {all.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid oklch(0.28 0.01 260 / 50%)" }}>
                <td className="px-4 py-3 font-medium" style={{ color: "var(--foreground)" }}>
                  {s.make} {s.model} {s.year}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{s.client_name ?? "—"}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{s.sale_date ? new Date(s.sale_date).toLocaleDateString("pt-BR") : "—"}</td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{paymentLabel[s.payment_method ?? ""] ?? s.payment_method}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--primary)" }}>
                  R$ {Number(s.sale_price).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--foreground)" }}>
                  {s.cost_price ? `R$ ${(Number(s.sale_price) - Number(s.cost_price)).toLocaleString("pt-BR")}` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton action={deleteSaleAction} id={s.id} />
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
