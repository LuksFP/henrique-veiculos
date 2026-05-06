"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

export interface MonthlyData {
  mes: string;
  receita: number;
  lucro: number;
}

export interface LeadStatusData {
  name: string;
  value: number;
}

export interface RecentSale {
  id: string;
  veiculoNome: string;
  cliente: string;
  valor: number;
  lucro: number;
  data: string;
}

interface Props {
  financeiroMensal: MonthlyData[];
  leadsByStatus: LeadStatusData[];
  recentSales: RecentSale[];
}

const PIE_COLORS = ["#4ade80", "#facc15", "#22d3ee", "#f87171", "#a78bfa"];

const tooltipStyle = {
  background: "oklch(0.17 0.008 260)",
  border: "1px solid oklch(0.28 0.01 260)",
  borderRadius: 8,
  color: "oklch(0.97 0.005 260)",
};

export function DashboardCharts({ financeiroMensal, leadsByStatus, recentSales }: Props) {
  return (
    <div className="dash-charts">
      <div className="dash-card">
        <h3 className="dash-card-title">Receita por Mês</h3>
        {financeiroMensal.length === 0 ? (
          <p style={{ color: "oklch(0.45 0.01 260)", fontSize: "0.85rem", padding: "40px 0", textAlign: "center" }}>
            Sem vendas registradas.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={financeiroMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
              <XAxis dataKey="mes" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} />
              <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`R$ ${(Number(v) / 1000).toFixed(0)}k`]} />
              <Bar dataKey="receita" fill="oklch(0.78 0.22 145)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="dash-card">
        <h3 className="dash-card-title">Lucro por Mês</h3>
        {financeiroMensal.length === 0 ? (
          <p style={{ color: "oklch(0.45 0.01 260)", fontSize: "0.85rem", padding: "40px 0", textAlign: "center" }}>
            Sem vendas registradas.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={financeiroMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
              <XAxis dataKey="mes" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} />
              <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`R$ ${(Number(v) / 1000).toFixed(0)}k`]} />
              <Line type="monotone" dataKey="lucro" stroke="oklch(0.78 0.22 145)" strokeWidth={2} dot={{ fill: "oklch(0.78 0.22 145)" }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="dash-card">
        <h3 className="dash-card-title">Leads por Status</h3>
        {leadsByStatus.length === 0 ? (
          <p style={{ color: "oklch(0.45 0.01 260)", fontSize: "0.85rem", padding: "40px 0", textAlign: "center" }}>
            Sem leads cadastrados.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={leadsByStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name ?? ""}: ${value ?? ""}`}
              >
                {leadsByStatus.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="dash-card">
        <h3 className="dash-card-title">Vendas Recentes</h3>
        {recentSales.length === 0 ? (
          <p style={{ color: "oklch(0.45 0.01 260)", fontSize: "0.85rem", padding: "20px 0", textAlign: "center" }}>
            Sem vendas registradas.
          </p>
        ) : (
          <div className="dash-sales">
            {recentSales.map((v) => (
              <div key={v.id} className="dash-sale-row">
                <div>
                  <div className="dash-sale-name">{v.veiculoNome}</div>
                  <div className="dash-sale-sub">{v.cliente} · {v.data}</div>
                </div>
                <div className="dash-sale-right">
                  <div className="dash-sale-value">R$ {v.valor.toLocaleString("pt-BR")}</div>
                  <div className="dash-sale-profit">+R$ {v.lucro.toLocaleString("pt-BR")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
