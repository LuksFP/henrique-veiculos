import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { submitPublicLeadAction } from "@/app/actions/public-leads";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Avalie seu veículo | Henrique Veículos",
  description: "Traga seu carro ou moto para avaliação direta na Henrique Veículos. Proposta clara, sem etapa escondida. Vicente de Carvalho, Guarujá/SP.",
};

export default async function AvaliacaoPage({
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
            <p className="sp-eyebrow">Avaliação na loja</p>
            <h1 className="sp-title">Seu usado entra como parte do negócio.</h1>
            <p className="sp-lede">Traga seu carro ou moto para uma avaliação direta, com proposta clara e sem etapa escondida. Atendimento presencial em Vicente de Carvalho, Guarujá/SP.</p>
          </div>

          <div className="sp-body">
            <ScrollReveal delay={100}>
              <div className="sp-steps">
                {[
                  { n: "01", t: "Traga o veículo", d: "Venha até nossa loja com o documento e o veículo para inspeção visual." },
                  { n: "02", t: "Avaliação presencial", d: "Nossa equipe verifica estado, quilometragem e histórico do veículo." },
                  { n: "03", t: "Proposta na hora", d: "Você recebe uma proposta clara e direta, sem taxa escondida." },
                  { n: "04", t: "Use como entrada", d: "O valor avaliado entra no negócio de compra do seu próximo veículo." },
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
                <h2 className="sp-form-title">Formulário de Avaliação</h2>

                {params.success && (
                  <p className="sp-alert sp-alert--ok">Enviado! Entraremos em contato em breve.</p>
                )}
                {params.error && (
                  <p className="sp-alert sp-alert--err">{params.error}</p>
                )}

                <form className="sp-form" action={submitPublicLeadAction}>
                  <input type="hidden" name="_origin" value="/avaliacao" />
                  <input type="hidden" name="source" value="avaliacao" />
                  <input type="text" name="_hp" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <fieldset className="sp-fieldset">
                    <legend>Dados do Veículo</legend>
                    <div className="sp-fields">
                      <div className="sp-field">
                        <label>Marca</label>
                        <input name="vehicle_marca" placeholder="Ex: Toyota" />
                      </div>
                      <div className="sp-field">
                        <label>Modelo</label>
                        <input name="vehicle_modelo" placeholder="Ex: Corolla" />
                      </div>
                      <div className="sp-field">
                        <label>Ano</label>
                        <input name="vehicle_ano" placeholder="Ex: 2019" />
                      </div>
                      <div className="sp-field">
                        <label>Quilometragem</label>
                        <input name="vehicle_km" placeholder="Ex: 65000" />
                      </div>
                      <div className="sp-field">
                        <label>Combustível</label>
                        <select name="vehicle_combustivel">
                          <option value="">Selecione</option>
                          <option>Flex</option>
                          <option>Gasolina</option>
                          <option>Etanol</option>
                          <option>Diesel</option>
                          <option>GNV</option>
                        </select>
                      </div>
                      <div className="sp-field">
                        <label>Câmbio</label>
                        <select name="vehicle_cambio">
                          <option value="">Selecione</option>
                          <option>Manual</option>
                          <option>Automático</option>
                          <option>Automatizado</option>
                        </select>
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
                        <textarea name="notes" rows={3} placeholder="Condição do veículo, acessórios, histórico de revisões..." />
                      </div>
                    </div>
                  </fieldset>

                  <button className="sp-submit" type="submit">Enviar avaliação</button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
