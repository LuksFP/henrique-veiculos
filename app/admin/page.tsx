export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/admin";
import { DashboardCharts } from "@/components/dashboard-charts";
import type { MonthlyData, LeadStatusData, RecentSale } from "@/components/dashboard-charts";

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  contato: "Contato",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

async function getDashboardData() {
  const supabase = await requireAdmin();

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const eightMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 7, 1).toISOString().split("T")[0];

  const [vehiclesRes, monthSalesRes, allSalesRes, leadsRes, recentSalesRes] = await Promise.all([
    supabase.from("vehicles").select("is_available, is_featured"),
    supabase.from("sales").select("sale_price").gte("sale_date", firstOfMonth),
    supabase
      .from("sales")
      .select("id, make, model, year, client_name, sale_price, cost_price, sale_date")
      .gte("sale_date", eightMonthsAgo)
      .order("sale_date", { ascending: true }),
    supabase.from("leads").select("status"),
    supabase
      .from("sales")
      .select("id, make, model, year, client_name, sale_price, cost_price, sale_date")
      .order("sale_date", { ascending: false })
      .limit(5),
  ]);

  const vehicles = vehiclesRes.data ?? [];
  const monthSales = monthSalesRes.data ?? [];
  const allSales = allSalesRes.data ?? [];
  const leadsData = leadsRes.data ?? [];
  const recentSalesData = recentSalesRes.data ?? [];

  // KPIs
  const totalVeiculos = vehicles.length;
  const disponiveis = vehicles.filter((v) => v.is_available).length;
  const vendasNoMes = monthSales.length;
  const receitaMensal = monthSales.reduce((s, v) => s + Number(v.sale_price), 0);
  const leadsAtivos = leadsData.filter((l) => ["novo", "contato", "proposta"].includes(l.status)).length;
  const ticketMedio = vendasNoMes > 0 ? Math.round(receitaMensal / vendasNoMes) : 0;

  // Monthly chart data (last 8 months)
  const monthMap = new Map<string, { receita: number; lucro: number }>();
  for (const s of allSales) {
    const d = new Date(s.sale_date);
    const label = `${MONTH_LABELS[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    const cur = monthMap.get(label) ?? { receita: 0, lucro: 0 };
    monthMap.set(label, {
      receita: cur.receita + Number(s.sale_price),
      lucro: cur.lucro + (Number(s.sale_price) - Number(s.cost_price)),
    });
  }
  const financeiroMensal: MonthlyData[] = Array.from(monthMap.entries()).map(([mes, v]) => ({ mes, ...v }));

  // Leads by status for pie chart
  const statusMap = new Map<string, number>();
  for (const l of leadsData) {
    statusMap.set(l.status, (statusMap.get(l.status) ?? 0) + 1);
  }
  const leadsByStatus: LeadStatusData[] = Array.from(statusMap.entries()).map(([key, value]) => ({
    name: STATUS_LABELS[key] ?? key,
    value,
  }));

  // Recent sales
  const recentSales: RecentSale[] = recentSalesData.map((s) => ({
    id: s.id,
    veiculoNome: `${s.make} ${s.model} ${s.year}`,
    cliente: s.client_name,
    valor: Number(s.sale_price),
    lucro: Number(s.sale_price) - Number(s.cost_price),
    data: new Date(s.sale_date).toLocaleDateString("pt-BR"),
  }));

  return {
    totalVeiculos,
    disponiveis,
    vendasNoMes,
    receitaMensal,
    leadsAtivos,
    ticketMedio,
    financeiroMensal,
    leadsByStatus,
    recentSales,
  };
}

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}k`;
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

export default async function AdminDashboard() {
  const {
    totalVeiculos,
    disponiveis,
    vendasNoMes,
    receitaMensal,
    leadsAtivos,
    ticketMedio,
    financeiroMensal,
    leadsByStatus,
    recentSales,
  } = await getDashboardData();

  const kpis = [
    { label: "Veículos em Estoque", value: totalVeiculos, sub: `${disponiveis} disponíveis`, icon: "🚗" },
    { label: "Vendas no Mês", value: vendasNoMes, icon: "📈" },
    { label: "Leads Ativos", value: leadsAtivos, icon: "📞" },
    { label: "Receita Mensal", value: formatCurrency(receitaMensal), icon: "💰" },
    { label: "Ticket Médio", value: formatCurrency(ticketMedio), icon: "🎯" },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Dashboard</h1>
          <p className="adm-page-sub">Visão geral da concessionária</p>
        </div>
      </div>

      <div className="dash-kpis">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="dash-kpi">
            <span className="dash-kpi-icon">{kpi.icon}</span>
            <div className="dash-kpi-value">{kpi.value}</div>
            <div className="dash-kpi-label">{kpi.label}</div>
            {"sub" in kpi && kpi.sub && (
              <div style={{ fontSize: "0.65rem", color: "oklch(0.45 0.01 260)", marginTop: 2 }}>{kpi.sub}</div>
            )}
          </div>
        ))}
      </div>

      <DashboardCharts
        financeiroMensal={financeiroMensal}
        leadsByStatus={leadsByStatus}
        recentSales={recentSales}
      />
    </>
  );
}
