"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from "recharts";
import type { SaleRow } from "@/lib/database.types";

const tooltipStyle = {
  background: "oklch(0.17 0.008 260)",
  border: "1px solid oklch(0.28 0.01 260)",
  borderRadius: 8,
  color: "oklch(0.97 0.005 260)",
};

function buildMonthlyData(sales: SaleRow[]) {
  const map = new Map<string, { receita: number; custos: number }>();

  for (const s of sales) {
    const [year, month] = s.sale_date.split("-");
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const label = `${months[parseInt(month) - 1]}/${String(year).slice(2)}`;
    const existing = map.get(label) ?? { receita: 0, custos: 0 };
    map.set(label, {
      receita: existing.receita + Number(s.sale_price),
      custos: existing.custos + Number(s.cost_price),
    });
  }

  const entries = Array.from(map.entries())
    .map(([mes, v]) => ({ mes, ...v, lucro: v.receita - v.custos }))
    .slice(-8);

  const acumulado = entries.reduce<{ mes: string; acumulado: number }[]>((acc, item) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].acumulado : 0;
    acc.push({ mes: item.mes, acumulado: prev + item.lucro });
    return acc;
  }, []);

  return { monthly: entries, acumulado };
}

export function FinanceiroCharts({ sales }: { sales: SaleRow[] }) {
  const { monthly, acumulado } = buildMonthlyData(sales);

  if (monthly.length === 0) {
    return (
      <div className="dash-charts">
        <div className="dash-card">
          <h3 className="dash-card-title">Receita vs Custos</h3>
          <p style={{ color: "oklch(0.45 0.01 260)", fontSize: "0.85rem", padding: "40px 0", textAlign: "center" }}>
            Sem dados de vendas ainda.
          </p>
        </div>
        <div className="dash-card">
          <h3 className="dash-card-title">Fluxo de Caixa Acumulado</h3>
          <p style={{ color: "oklch(0.45 0.01 260)", fontSize: "0.85rem", padding: "40px 0", textAlign: "center" }}>
            Sem dados de vendas ainda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-charts">
      <div className="dash-card">
        <h3 className="dash-card-title">Receita vs Custos</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
            <XAxis dataKey="mes" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} />
            <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`R$ ${(Number(v) / 1000).toFixed(0)}k`]} />
            <Legend wrapperStyle={{ color: "oklch(0.6 0.02 260)", fontSize: 12 }} />
            <Bar dataKey="receita" name="Receita" fill="oklch(0.78 0.22 145)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="custos" name="Custos" fill="oklch(0.55 0.15 27)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="dash-card">
        <h3 className="dash-card-title">Fluxo de Caixa Acumulado</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={acumulado}>
            <defs>
              <linearGradient id="gradAcum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.85 0.25 125)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.85 0.25 125)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
            <XAxis dataKey="mes" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} />
            <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`R$ ${(Number(v) / 1000).toFixed(0)}k`]} />
            <Area type="monotone" dataKey="acumulado" name="Acumulado" stroke="oklch(0.85 0.25 125)" strokeWidth={2} fill="url(#gradAcum)" dot={{ fill: "oklch(0.85 0.25 125)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
