"use client";

import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { ScrollReveal } from "@/components/scroll-reveal";

const WA = "https://wa.me/5513974066867";

function buildMsg(data: Record<string, string>) {
  const lines = ["Olá, vim pelo site e quero solicitar uma *Avaliação de Veículo*:"];
  if (data.vehicle_marca) lines.push(`Marca: ${data.vehicle_marca}`);
  if (data.vehicle_modelo) lines.push(`Modelo: ${data.vehicle_modelo}`);
  if (data.vehicle_ano) lines.push(`Ano: ${data.vehicle_ano}`);
  if (data.vehicle_km) lines.push(`KM: ${data.vehicle_km}`);
  if (data.vehicle_combustivel) lines.push(`Combustível: ${data.vehicle_combustivel}`);
  if (data.vehicle_cambio) lines.push(`Câmbio: ${data.vehicle_cambio}`);
  lines.push("---");
  if (data.name) lines.push(`Nome: ${data.name}`);
  if (data.phone) lines.push(`Telefone: ${data.phone}`);
  if (data.email) lines.push(`E-mail: ${data.email}`);
  if (data.notes) lines.push(`Obs: ${data.notes}`);
  return lines.join("\n");
}

export default function AvaliacaoPage() {
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
                    <div><strong>{t}</strong><p>{d}</p></div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="sp-form-card">
                <h2 className="sp-form-title">Formulário de Avaliação</h2>
                <form className="sp-form" onSubmit={handleSubmit}>
                  <fieldset className="sp-fieldset">
                    <legend>Dados do Veículo</legend>
                    <div className="sp-fields">
                      <div className="sp-field"><label>Marca</label><input name="vehicle_marca" placeholder="Ex: Toyota" /></div>
                      <div className="sp-field"><label>Modelo</label><input name="vehicle_modelo" placeholder="Ex: Corolla" /></div>
                      <div className="sp-field"><label>Ano</label><input name="vehicle_ano" placeholder="Ex: 2019" /></div>
                      <div className="sp-field"><label>Quilometragem</label><input name="vehicle_km" placeholder="Ex: 65000" /></div>
                      <div className="sp-field">
                        <label>Combustível</label>
                        <select name="vehicle_combustivel">
                          <option value="">Selecione</option>
                          <option>Flex</option><option>Gasolina</option><option>Etanol</option><option>Diesel</option><option>GNV</option>
                        </select>
                      </div>
                      <div className="sp-field">
                        <label>Câmbio</label>
                        <select name="vehicle_cambio">
                          <option value="">Selecione</option>
                          <option>Manual</option><option>Automático</option><option>Automatizado</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="sp-fieldset">
                    <legend>Dados Pessoais</legend>
                    <div className="sp-fields">
                      <div className="sp-field sp-field--wide"><label>Nome *</label><input name="name" required placeholder="Seu nome completo" /></div>
                      <div className="sp-field"><label>Telefone / WhatsApp *</label><input name="phone" required placeholder="(13) 99999-0000" /></div>
                      <div className="sp-field"><label>E-mail</label><input name="email" type="email" placeholder="seu@email.com" /></div>
                      <div className="sp-field sp-field--wide"><label>Observações</label><textarea name="notes" rows={3} placeholder="Condição do veículo, acessórios, histórico de revisões..." /></div>
                    </div>
                  </fieldset>
                  <button className="sp-submit" type="submit">Enviar pelo WhatsApp</button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
