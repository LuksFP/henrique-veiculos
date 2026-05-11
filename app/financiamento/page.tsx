import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Financiamento | Henrique Veículos",
  description: "Simule seu financiamento pelo WhatsApp com a Henrique Veículos. Condições consultadas para você entender entrada, parcelas e aprovação.",
};

const WA = "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20quero%20simular%20um%20financiamento%20na%20Henrique%20Ve%C3%ADculos";

export default function FinanciamentoPage() {
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
          <div className="sp-hero">
            <p className="sp-eyebrow">Financiamento</p>
            <h1 className="sp-title">Aprove seu financiamento com facilidade.</h1>
            <p className="sp-lede">Consultamos as melhores condições do mercado para você entender entrada, parcelas e chances de aprovação antes de decidir.</p>
          </div>

          <div className="sp-body sp-body--single">
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

            <div className="sp-cta-block">
              <p className="sp-cta-label">Documentos necessários</p>
              <ul className="sp-list">
                <li>CNH (Carteira Nacional de Habilitação)</li>
                <li>Comprovante de residência (conta de água, luz, telefone ou cartão)</li>
                <li>Comprovante de renda (contracheque, extrato bancário últimos 90 dias ou IR)</li>
              </ul>
              <a href={WA} target="_blank" rel="noreferrer" className="sp-btn-cta">
                Simular financiamento pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
