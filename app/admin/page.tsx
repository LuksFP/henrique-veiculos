import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: vehicles }, { data: leads }, { data: sales }] = await Promise.all([
    supabase!.from("vehicles").select("id, is_available, is_featured"),
    supabase!.from("leads").select("id, status, created_at"),
    supabase!.from("sales").select("id, sale_price, cost_price, sale_date, vehicle_id, make, model, client_name"),
  ]);

  const totalEstoque = vehicles?.filter((v) => v.is_available).length ?? 0;
  const leadsAtivos = leads?.filter((l) => l.status === "novo" || l.status === "em_negociacao").length ?? 0;
  const vendasMes = (() => {
    const now = new Date();
    const mes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return sales?.filter((s) => s.sale_date?.startsWith(mes)) ?? [];
  })();
  const receitaMes = vendasMes.reduce((s, v) => s + Number(v.sale_price ?? 0), 0);
  const ticketMedio = vendasMes.length > 0 ? receitaMes / vendasMes.length : 0;

  const kpis = [
    { label: "Veículos em Estoque", value: totalEstoque, icon: "🚗" },
    { label: "Vendas no Mês", value: vendasMes.length, icon: "📈" },
    { label: "Leads Ativos", value: leadsAtivos, icon: "📞" },
    { label: "Receita Mensal", value: `R$ ${(receitaMes / 1000).toFixed(0)}k`, icon: "💰" },
    { label: "Ticket Médio", value: `R$ ${(ticketMedio / 1000).toFixed(0)}k`, icon: "🎯" },
  ];

  const recentSales = (sales ?? []).slice(0, 5);

  return (
    <div>
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
      >
        Dashboard
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
        Visão geral da concessionária
      </p>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{ border: "1px solid var(--border)", background: "var(--card)" }}
          >
            <span className="text-2xl">{kpi.icon}</span>
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

      {/* Vendas recentes */}
      <div className="mt-8">
        <div
          className="rounded-xl p-5"
          style={{ border: "1px solid var(--border)", background: "var(--card)" }}
        >
          <h3
            className="mb-4 text-lg font-bold"
            style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
          >
            Vendas Recentes
          </h3>
          {recentSales.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Nenhuma venda registrada ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {recentSales.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-lg p-3"
                  style={{ border: "1px solid var(--border)", background: "var(--background)" }}
                >
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {v.make} {v.model}
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {v.client_name} • {v.sale_date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                      R$ {Number(v.sale_price).toLocaleString("pt-BR")}
                    </div>
                    {v.cost_price && (
                      <div className="text-xs" style={{ color: "var(--chart-2)" }}>
                        custo R$ {Number(v.cost_price).toLocaleString("pt-BR")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lead breakdown */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {(["novo", "em_negociacao", "fechado", "perdido"] as const).map((s) => {
          const count = leads?.filter((l) => l.status === s).length ?? 0;
          const labels: Record<string, string> = {
            novo: "Novos",
            em_negociacao: "Em Negociação",
            fechado: "Fechados",
            perdido: "Perdidos",
          };
          return (
            <div
              key={s}
              className="rounded-xl p-4"
              style={{ border: "1px solid var(--border)", background: "var(--card)" }}
            >
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
              >
                {count}
              </div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {labels[s]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
