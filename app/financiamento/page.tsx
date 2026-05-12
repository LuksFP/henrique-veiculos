import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { submitPublicLeadAction } from "@/app/actions/public-leads";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FinancingCalculator } from "@/components/financing-calculator";

export const metadata: Metadata = {
  title: "Financiamento | Henrique Veículos",
  description: "Simule seu financiamento pelo WhatsApp com a Henrique Veículos. Condições consultadas para você entender entrada, parcelas e aprovação.",
};

const WA = "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20quero%20simular%20um%20financiamento%20na%20Henrique%20Ve%C3%ADculos";

export default async function FinanciamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

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
                    <div>
                      <strong>{t}</strong>
                      <p>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="sp-form-card">
                <h2 className="sp-form-title">Solicitar simulação</h2>

                {params.success && (
                  <p className="sp-alert sp-alert--ok">Enviado! Entraremos em contato em breve.</p>
                )}
                {params.error && (
                  <p className="sp-alert sp-alert--err">{params.error}</p>
                )}

                <form className="sp-form" action={submitPublicLeadAction}>
                  <input type="hidden" name="_origin" value="/financiamento" />
                  <input type="hidden" name="source" value="financiamento" />
                  <input type="text" name="_hp" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <fieldset className="sp-fieldset">
                    <legend>Veículo de Interesse</legend>
                    <div className="sp-fields">
                      <div className="sp-field">
                        <label>Marca</label>
                        <input name="vehicle_marca" placeholder="Ex: Honda" />
                      </div>
                      <div className="sp-field">
                        <label>Modelo</label>
                        <input name="vehicle_modelo" placeholder="Ex: HR-V" />
                      </div>
                      <div className="sp-field">
                        <label>Ano</label>
                        <input name="vehicle_ano" placeholder="Ex: 2022" />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="sp-fieldset">
                    <legend>Dados Pessoais</legend>
                    <div className="sp-fields">
                      <div className="sp-field sp-field--wide">
                        <label>Nome *</label>
                        <input name="name" required placeholder="Seu nome completo" />
                      </div>
                      <div className="sp-field">
                        <label>Telefone / WhatsApp *</label>
                        <input name="phone" required placeholder="(13) 99999-0000" />
                      </div>
                      <div className="sp-field">
                        <label>E-mail</label>
                        <input name="email" type="email" placeholder="seu@email.com" />
                      </div>
                      <div className="sp-field sp-field--wide">
                        <label>Observações</label>
                        <textarea name="notes" rows={3} placeholder="Entrada disponível, renda aproximada..." />
                      </div>
                    </div>
                  </fieldset>

                  <button className="sp-submit" type="submit">Solicitar simulação</button>
                </form>

                <div className="sp-address-links" style={{ marginTop: "16px" }}>
                  <a href={WA} target="_blank" rel="noreferrer" className="sp-btn-ghost">Prefere o WhatsApp?</a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
