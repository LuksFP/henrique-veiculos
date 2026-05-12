"use client";

import { useState, useId } from "react";

function pmt(pv: number, i: number, n: number): number {
  if (pv <= 0 || n <= 0) return 0;
  if (i === 0) return pv / n;
  return (pv * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function parseBRL(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) / 100 : 0;
}

function maskBRL(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "").slice(0, 12);
  const num = parseInt(digits || "0", 10) / 100;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

const SCENARIOS = [
  { label: "Melhor caso", rate: 0.0129, tag: "1,29% a.m." },
  { label: "Típico", rate: 0.0179, tag: "1,79% a.m." },
  { label: "Conservador", rate: 0.0219, tag: "2,19% a.m." },
] as const;

const INSTALLMENT_OPTIONS = [12, 24, 36, 48, 60, 72] as const;

export function FinancingCalculator() {
  const id = useId();
  const [vehicleRaw, setVehicleRaw] = useState("R$ 0,00");
  const [entradaRaw, setEntradaRaw] = useState("R$ 0,00");
  const [parcelas, setParcelas] = useState<number>(48);

  const vehicleValue = parseBRL(vehicleRaw);
  const entradaValue = parseBRL(entradaRaw);
  const financed = Math.max(0, vehicleValue - entradaValue);
  const hasResult = financed > 0 && parcelas > 0;

  return (
    <div className="fc-card">
      <div className="fc-header">
        <p className="fc-eyebrow">Simulador</p>
        <h2 className="fc-title">Quanto ficam as parcelas?</h2>
        <p className="fc-subtitle">Estimativa com base em taxas de mercado. Valores reais dependem de análise de crédito.</p>
      </div>

      <div className="fc-inputs">
        <div className="fc-field">
          <label htmlFor={`${id}-vehicle`}>Valor do veículo</label>
          <input
            id={`${id}-vehicle`}
            type="text"
            inputMode="numeric"
            value={vehicleRaw}
            onChange={(e) => setVehicleRaw(maskBRL(e.target.value))}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <div className="fc-field">
          <label htmlFor={`${id}-entrada`}>Entrada</label>
          <input
            id={`${id}-entrada`}
            type="text"
            inputMode="numeric"
            value={entradaRaw}
            onChange={(e) => setEntradaRaw(maskBRL(e.target.value))}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <div className="fc-field">
          <label htmlFor={`${id}-parcelas`}>Número de parcelas</label>
          <select
            id={`${id}-parcelas`}
            value={parcelas}
            onChange={(e) => setParcelas(Number(e.target.value))}
          >
            {INSTALLMENT_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}x</option>
            ))}
          </select>
        </div>
      </div>

      {hasResult ? (
        <div className="fc-results">
          <div className="fc-financed">
            <span className="fc-financed-label">Valor financiado</span>
            <span className="fc-financed-value">{fmt(financed)}</span>
          </div>
          <div className="fc-scenarios">
            {SCENARIOS.map(({ label, rate, tag }) => {
              const monthly = pmt(financed, rate, parcelas);
              const total = monthly * parcelas;
              return (
                <div key={tag} className="fc-scenario">
                  <div className="fc-scenario-top">
                    <span className="fc-scenario-label">{label}</span>
                    <span className="fc-scenario-rate">{tag}</span>
                  </div>
                  <div className="fc-scenario-pmt">{fmt(monthly)}<span>/mês</span></div>
                  <div className="fc-scenario-total">Total: {fmt(total)}</div>
                </div>
              );
            })}
          </div>
          <p className="fc-disclaimer">
            Simulação meramente estimativa. A taxa real depende de perfil de crédito, banco e condições do veículo.
          </p>
        </div>
      ) : (
        <div className="fc-empty">
          <span>Preencha o valor do veículo e a entrada para ver a simulação.</span>
        </div>
      )}
    </div>
  );
}
