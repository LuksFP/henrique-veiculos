"use client";

import { BrandLogo } from "@/components/brand-logo";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FinancingCalculator } from "@/components/financing-calculator";

const WA = "https://wa.me/5513974066867";

function buildMsg(data: Record<string, string>) {
  const lines = ["Olá, vim pelo site e quero solicitar uma *Simulação de Financiamento*:"];
  if (data.vehicle_marca) lines.push(`Marca: ${data.vehicle_marca}`);
  if (data.vehicle_modelo) lines.push(`Modelo: ${data.vehicle_modelo}`);
  if (data.vehicle_ano) lines.push(`Ano: ${data.vehicle_ano}`);
  lines.push("---");
  if (data.name) lines.push(`Nome: ${data.name}`);
  if (data.phone) lines.push(`Telefone: ${data.phone}`);
  if (data.email) lines.push(`E-mail: ${data.email}`);
  if (data.notes) lines.push(`Obs: ${data.notes}`);
  return lines.join("\n");
}

export default function FinanciamentoPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    window.open(`${WA}?text=${encodeURIComponent(buildMsg(data))}`, "_blank");
  }

  return (
    <>
      <header className="vp-header">
        <div className="vp-header-inner">
          <a href="/" aria-label="Henrique Veículos"><BrandLogo /></a>
          <a className="vp-back" href="/">← Voltar ao início</a>
        </div>
      </header>

      <main className="sp-main">
        <div className="sp-wrap">
          <div className="sp-hero sp-animate-in">
            <p className="sp-eyebrow">Financiamento</p>
            <h1 className="sp-title">Aprove seu financiamento com facilidade.</h1>
            <p className="sp-lede">Consultamos as melhores condições do mercado para você entender entrada, parcelas e chances de aprovação antes de decidir.</p>
          </div>

          <ScrollReveal delay={80}>
            <FinancingCalculator />
          </ScrollReveal>

          <div className="sp-body">
            <ScrollReveal delay={100}>
              <div className="sp-steps">
                {[
                  { n: "01", t: "Simulação pelo WhatsApp", d: "Fale com nossa equipe e informe o veículo de interesse para iniciar a simulação." },
                  { n: "02", t: "Documentação necessária", d: "CNH, comprovante de residência e comprovante de renda (contracheque, extrato ou IR)." },
                  { n: "03", t: "Análise de crédito", d: "Trabalhamos com os principais bancos e financeiras para buscar a melhor taxa." },
                  { n: "04", t: "Aprovação e retirada", d: "Com o crédito aprovado, o veículo é seu. Atendimento presencial em Vicente de Carvalho." },
                ].map(({ n, t, d }) => (
                  <div key={n} className="sp-step">
                    <span className="sp-step-n">{n}</span>
                    <div><strong>{t}</strong><p>{d}</p></div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="sp-form-card">
                <h2 className="sp-form-title">Solicitar simulação</h2>
                <form className="sp-form" onSubmit={handleSubmit}>
                  <fieldset className="sp-fieldset">
                    <legend>Veículo de Interesse</legend>
                    <div className="sp-fields">
                      <div className="sp-field"><label>Marca</label><input name="vehicle_marca" placeholder="Ex: Honda" /></div>
                      <div className="sp-field"><label>Modelo</label><input name="vehicle_modelo" placeholder="Ex: HR-V" /></div>
                      <div className="sp-field"><label>Ano</label><input name="vehicle_ano" placeholder="Ex: 2022" /></div>
                    </div>
                  </fieldset>
                  <fieldset className="sp-fieldset">
                    <legend>Dados Pessoais</legend>
                    <div className="sp-fields">
                      <div className="sp-field sp-field--wide"><label>Nome *</label><input name="name" required placeholder="Seu nome completo" /></div>
                      <div className="sp-field"><label>Telefone / WhatsApp *</label><input name="phone" required placeholder="(13) 99999-0000" /></div>
                      <div className="sp-field"><label>E-mail</label><input name="email" type="email" placeholder="seu@email.com" /></div>
                      <div className="sp-field sp-field--wide"><label>Observações</label><textarea name="notes" rows={3} placeholder="Entrada disponível, renda aproximada..." /></div>
                    </div>
                  </fieldset>
                  <button className="sp-submit" type="submit">Solicitar pelo WhatsApp</button>
                </form>
                <div className="sp-address-links" style={{ marginTop: "16px" }}>
                  <a href={`${WA}?text=${encodeURIComponent("Olá, quero simular um financiamento na Henrique Veículos")}`} target="_blank" rel="noreferrer" className="sp-btn-ghost">Prefere o WhatsApp direto?</a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
