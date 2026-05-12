import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { submitPublicLeadAction } from "@/app/actions/public-leads";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Consignação | Henrique Veículos",
  description: "Venda seu veículo com apoio da Henrique Veículos. Atendimento no ponto físico e negociação acompanhada em Vicente de Carvalho, Guarujá/SP.",
};

export default async function ConsignacaoPage({
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
            <p className="sp-eyebrow">Consignação</p>
            <h1 className="sp-title">Venda assistida com apoio da loja.</h1>
            <p className="sp-lede">Anuncie seu veículo com o suporte da Henrique Veículos. Atendimento no ponto físico, negociação acompanhada e mais visibilidade para o seu carro ou moto.</p>
          </div>

          <div className="sp-body">
            <ScrollReveal delay={100}>
              <div className="sp-steps">
                {[
                  { n: "01", t: "Traga o veículo", d: "Venha até nossa loja para uma avaliação inicial e definição do preço de venda." },
                  { n: "02", t: "Anúncio na loja", d: "Seu veículo fica exposto no nosso showroom e divulgado no nosso site." },
                  { n: "03", t: "Negociação acompanhada", d: "Nossa equipe cuida do atendimento e da negociação com os compradores." },
                  { n: "04", t: "Receba seu valor", d: "Após a venda, você recebe o valor acordado diretamente." },
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
                <h2 className="sp-form-title">Formulário de Consignação</h2>

                {params.success && (
                  <p className="sp-alert sp-alert--ok">Enviado! Entraremos em contato em breve.</p>
                )}
                {params.error && (
                  <p className="sp-alert sp-alert--err">{params.error}</p>
                )}

                <form className="sp-form" action={submitPublicLeadAction}>
                  <input type="hidden" name="_origin" value="/consignacao" />
                  <input type="hidden" name="source" value="consignacao" />
                  <input type="text" name="_hp" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <fieldset className="sp-fieldset">
                    <legend>Dados do Veículo</legend>
                    <div className="sp-fields">
                      <div className="sp-field">
                        <label>Marca</label>
                        <input name="vehicle_marca" placeholder="Ex: Honda" />
                      </div>
                      <div className="sp-field">
                        <label>Modelo</label>
                        <input name="vehicle_modelo" placeholder="Ex: Civic" />
                      </div>
                      <div className="sp-field">
                        <label>Ano/Modelo</label>
                        <input name="vehicle_ano" placeholder="Ex: 2020/2021" />
                      </div>
                      <div className="sp-field">
                        <label>Quilometragem</label>
                        <input name="vehicle_km" placeholder="Ex: 42000" />
                      </div>
                      <div className="sp-field">
                        <label>Cor</label>
                        <input name="vehicle_cor" placeholder="Ex: Prata" />
                      </div>
                      <div className="sp-field">
                        <label>Combustível</label>
                        <select name="vehicle_combustivel">
                          <option value="">Selecione</option>
                          <option>Flex</option>
                          <option>Gasolina</option>
                          <option>Etanol</option>
                          <option>Diesel</option>
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
                        <label>Informações adicionais</label>
                        <textarea name="notes" rows={3} placeholder="Acessórios, revisões, estado geral do veículo..." />
                      </div>
                    </div>
                  </fieldset>

                  <button className="sp-submit" type="submit">Enviar consignação</button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
