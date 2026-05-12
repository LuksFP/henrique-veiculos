"use client";

import { useState, useId } from "react";

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function maskBRL(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "").slice(0, 12);
  const num = parseInt(digits || "0", 10) / 100;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function parseBRL(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) / 100 : 0;
}

const COMMISSIONS = [
  { label: "5%", rate: 0.05 },
  { label: "7%", rate: 0.07 },
  { label: "10%", rate: 0.10 },
] as const;

export function ConsignmentCalculator() {
  const id = useId();
  const [priceRaw, setPriceRaw] = useState("R$ 0,00");
  const [selectedRate, setSelectedRate] = useState(0.07);

  const salePrice = parseBRL(priceRaw);
  const hasResult = salePrice > 0;
  const commission = salePrice * selectedRate;
  const netValue = salePrice - commission;

  return (
    <div className="cc-card">
      <div className="cc-header">
        <p className="cc-eyebrow">Simulador</p>
        <h2 className="cc-title">Quanto você recebe pela venda?</h2>
        <p className="cc-subtitle">Estimativa do valor líquido após a comissão da loja. Percentual exato definido na avaliação presencial.</p>
      </div>

      <div className="cc-inputs">
        <div className="cc-field">
          <label htmlFor={`${id}-price`}>Preço de venda desejado</label>
          <input
            id={`${id}-price`}
            type="text"
            inputMode="numeric"
            value={priceRaw}
            onChange={(e) => setPriceRaw(maskBRL(e.target.value))}
            onFocus={(e) => e.target.select()}
          />
        </div>

        <div className="cc-field">
          <label>Comissão da loja</label>
          <div className="cc-rate-group">
            {COMMISSIONS.map(({ label, rate }) => (
              <button
                key={label}
                type="button"
                className={`cc-rate-btn${selectedRate === rate ? " cc-rate-btn--active" : ""}`}
                onClick={() => setSelectedRate(rate)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasResult ? (
        <div className="cc-results">
          <div className="cc-result-row">
            <div className="cc-result-item">
              <span className="cc-result-label">Preço de venda</span>
              <span className="cc-result-value">{fmt(salePrice)}</span>
            </div>
            <div className="cc-result-divider">−</div>
            <div className="cc-result-item">
              <span className="cc-result-label">Comissão ({(selectedRate * 100).toFixed(0)}%)</span>
              <span className="cc-result-value cc-result-value--dim">{fmt(commission)}</span>
            </div>
            <div className="cc-result-divider">=</div>
            <div className="cc-result-item cc-result-item--highlight">
              <span className="cc-result-label">Você recebe</span>
              <span className="cc-result-value cc-result-value--lime">{fmt(netValue)}</span>
            </div>
          </div>
          <p className="cc-disclaimer">
            Comissão negociada na avaliação presencial. Percentual pode variar conforme o veículo e condições de mercado.
          </p>
        </div>
      ) : (
        <div className="cc-empty">
          <span>Informe o preço de venda para ver o valor estimado que você recebe.</span>
        </div>
      )}
    </div>
  );
}
