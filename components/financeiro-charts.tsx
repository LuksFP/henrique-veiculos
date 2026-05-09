"use client";

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { SaleRow } from "@/lib/database.types";
import { MONTH_LABELS, pad, toISO } from "@/lib/fmt";

const tooltipStyle = {
  background: "oklch(0.17 0.008 260)",
  border: "1px solid oklch(0.28 0.01 260)",
  borderRadius: 8,
  color: "oklch(0.97 0.005 260)",
};

const fmtK = (v: number | string) => `R$ ${(Number(v) / 1000).toFixed(0)}k`;

function buildWeeklyData(sales: SaleRow[]) {
  const now = new Date();
  const daysSinceMonday = (now.getDay() + 6) % 7;

  return Array.from({ length: 8 }, (_, i) => {
    const weeksBack = 7 - i;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysSinceMonday - weeksBack * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const s = toISO(weekStart);
    const e = toISO(weekEnd);
    const w = sales.filter((v) => v.sale_date >= s && v.sale_date <= e);
    const receita = w.reduce((sum, v) => sum + Number(v.sale_price), 0);
    const lucro = w.reduce((sum, v) => sum + Number(v.sale_price) - Number(v.cost_price), 0);

    const label =
      weeksBack === 0 ? "Esta sem."
      : weeksBack === 1 ? "Ant."
      : `${pad(weekStart.getDate())}/${pad(weekStart.getMonth() + 1)}`;

    return { semana: label, receita, lucro, vendas: w.length, isCurrent: weeksBack === 0 };
  });
}

function buildMonthlyData(sales: SaleRow[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const monthsBack = 5 - i;
    const d = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    const prefix = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    const m = sales.filter((v) => v.sale_date.startsWith(prefix));
    const receita = m.reduce((sum, v) => sum + Number(v.sale_price), 0);
    const lucro = m.reduce((sum, v) => sum + Number(v.sale_price) - Number(v.cost_price), 0);
    return { mes: MONTH_LABELS[d.getMonth()], receita, lucro, vendas: m.length, isCurrent: monthsBack === 0 };
  });
}

export function FinanceiroCharts({ sales }: { sales: SaleRow[] }) {
  const weekly = buildWeeklyData(sales);
  const monthly = buildMonthlyData(sales);

  if (sales.length === 0) {
    return (
      <div className="dash-charts">
        {["Receita por Semana", "Receita por Mês"].map((title) => (
          <div key={title} className="dash-card">
            <h3 className="dash-card-title">{title}</h3>
            <p style={{ color: "oklch(0.45 0.01 260)", fontSize: "0.85rem", padding: "40px 0", textAlign: "center" }}>
              Sem dados ainda.
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dash-charts">
      <div className="dash-card">
        <h3 className="dash-card-title">Receita por Semana</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
            <XAxis dataKey="semana" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 11 }} />
            <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 11 }} tickFormatter={fmtK} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v, name) => [fmtK(v as number), name === "receita" ? "Receita" : "Lucro"]}
              labelFormatter={(l) => `Semana: ${l}`}
            />
            <Legend wrapperStyle={{ color: "oklch(0.6 0.02 260)", fontSize: 12 }} />
            <Bar dataKey="receita" name="Receita" radius={[4, 4, 0, 0]}>
              {weekly.map((entry) => (
                <Cell key={entry.semana} fill={entry.isCurrent ? "oklch(0.78 0.22 145)" : "oklch(0.78 0.22 145 / 40%)"} />
              ))}
            </Bar>
            <Bar dataKey="lucro" name="Lucro" radius={[4, 4, 0, 0]}>
              {weekly.map((entry) => (
                <Cell key={entry.semana} fill={entry.isCurrent ? "oklch(0.85 0.25 125)" : "oklch(0.85 0.25 125 / 40%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="dash-card">
        <h3 className="dash-card-title">Receita por Mês</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
            <XAxis dataKey="mes" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} />
            <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} tickFormatter={fmtK} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v, name) => [fmtK(v as number), name === "receita" ? "Receita" : "Lucro"]}
            />
            <Legend wrapperStyle={{ color: "oklch(0.6 0.02 260)", fontSize: 12 }} />
            <Bar dataKey="receita" name="Receita" radius={[4, 4, 0, 0]}>
              {monthly.map((entry) => (
                <Cell key={entry.mes} fill={entry.isCurrent ? "oklch(0.78 0.22 145)" : "oklch(0.78 0.22 145 / 40%)"} />
              ))}
            </Bar>
            <Bar dataKey="lucro" name="Lucro" radius={[4, 4, 0, 0]}>
              {monthly.map((entry) => (
                <Cell key={entry.mes} fill={entry.isCurrent ? "oklch(0.85 0.25 125)" : "oklch(0.85 0.25 125 / 40%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
