"use client";

import { BrandLogo } from "@/components/brand-logo";
import { ScrollReveal } from "@/components/scroll-reveal";

const WA = "https://wa.me/5513974066867";

const STEPS = [
  { n: "01", t: "Traga o veículo", d: "Venha até nossa loja com o documento e o veículo para inspeção visual." },
  { n: "02", t: "Avaliação presencial", d: "Nossa equipe verifica estado, quilometragem e histórico do veículo." },
  { n: "03", t: "Proposta na hora", d: "Você recebe uma proposta clara e direta, sem taxa escondida." },
  { n: "04", t: "Use como entrada", d: "O valor avaliado entra no negócio de compra do seu próximo veículo." },
];

// Ordem dos campos na mensagem do WhatsApp — rótulo + chave do formulário.
const VEHICLE_FIELDS: [string, string][] = [
  ["Marca", "vehicle_marca"],
  ["Modelo", "vehicle_modelo"],
  ["Ano", "vehicle_ano"],
  ["Renavam", "vehicle_renavam"],
  ["Quilometragem", "vehicle_km"],
  ["Revisões na autorizada", "vehicle_revisoes"],
  ["Cor", "vehicle_cor"],
  ["Sinistro", "vehicle_sinistro"],
  ["Combustível", "vehicle_combustivel"],
  ["Câmbio", "vehicle_cambio"],
  ["Estado dos pneus", "vehicle_pneus"],
  ["Acessório extra", "vehicle_acessorio"],
];

const PERSON_FIELDS: [string, string][] = [
  ["Nome", "name"],
  ["Telefone", "phone_full"],
  ["E-mail", "email"],
  ["Data de nascimento", "birth"],
  ["Endereço", "address"],
  ["Profissão", "job"],
  ["CPF", "cpf"],
  ["Como conheceu a loja", "origin"],
  ["Intenção", "intent"],
  ["Veículo de interesse", "interest"],
];

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function maskCpf(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

function maskDate(value: string) {
  const d = onlyDigits(value).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function maskPhone(value: string) {
  const d = onlyDigits(value).slice(0, 9);
  if (d.length <= 4) return d;
  if (d.length <= 8) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function buildMsg(data: Record<string, string>) {
  const lines = ["Olá, vim pelo site e quero solicitar uma *Avaliação de Veículo*:", "", "*DADOS DO VEÍCULO*"];

  for (const [label, key] of VEHICLE_FIELDS) {
    if (data[key]) lines.push(`${label}: ${data[key]}`);
  }

  lines.push("", "*DADOS PESSOAIS*");

  for (const [label, key] of PERSON_FIELDS) {
    if (data[key]) lines.push(`${label}: ${data[key]}`);
  }

  if (data.notes) lines.push("", `Obs: ${data.notes}`);

  return lines.join("\n");
}

function Choice({ name, options, defaultValue }: { name: string; options: string[]; defaultValue: string }) {
  return (
    <div className="sp-choice">
      {options.map((option) => (
        <label className="sp-choice-opt" key={option}>
          <input type="radio" name={name} value={option} defaultChecked={option === defaultValue} />
          <span className="sp-choice-box" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="sp-choice-label">{option}</span>
        </label>
      ))}
    </div>
  );
}

export default function AvaliacaoPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const ddd = onlyDigits(data.phone_ddd ?? "");
    if (ddd || data.phone) {
      data.phone_full = `(${ddd}) ${data.phone ?? ""}`.trim();
    }

    window.open(`${WA}?text=${encodeURIComponent(buildMsg(data))}`, "_blank");
  }

  function handleMask(e: React.ChangeEvent<HTMLInputElement>, fn: (value: string) => string) {
    e.currentTarget.value = fn(e.currentTarget.value);
  }

  return (
    <>
      <header className="vp-header">
        <div className="vp-header-inner">
          <a href="/" aria-label="Henrique Veículos"><BrandLogo /></a>
          <a className="vp-back" href="/">Voltar ao início</a>
        </div>
      </header>

      <main className="sp-main">
        <div className="sp-wrap sp-wrap--wide">
          <div className="sp-hero sp-animate-in">
            <p className="sp-eyebrow">Avaliação na loja</p>
            <h1 className="sp-title">Seu usado entra como parte do negócio.</h1>
            <p className="sp-lede">Traga seu carro ou moto para uma avaliação direta, com proposta clara e sem etapa escondida. Atendimento presencial em Vicente de Carvalho, Guarujá/SP.</p>
          </div>

          <div className="sp-body sp-body--form">
            <ScrollReveal delay={100}>
              <div className="sp-steps">
                {STEPS.map(({ n, t, d }, i) => (
                  <div key={n} className="sp-step" style={{ "--i": i } as React.CSSProperties}>
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
                      <div className="sp-field"><label htmlFor="av-marca">Marca</label><input id="av-marca" name="vehicle_marca" placeholder="Ex: Jeep" /></div>
                      <div className="sp-field"><label htmlFor="av-modelo">Modelo</label><input id="av-modelo" name="vehicle_modelo" placeholder="Ex: Compass" /></div>

                      <div className="sp-field"><label htmlFor="av-ano">Ano</label><input id="av-ano" name="vehicle_ano" inputMode="numeric" maxLength={9} placeholder="Ex: 2019/2020" /></div>
                      <div className="sp-field"><label htmlFor="av-renavam">Renavam</label><input id="av-renavam" name="vehicle_renavam" inputMode="numeric" maxLength={11} placeholder="11 dígitos" /></div>

                      <div className="sp-field"><label htmlFor="av-km">Quilometragem</label><input id="av-km" name="vehicle_km" inputMode="numeric" placeholder="Ex: 65000" /></div>
                      <div className="sp-field sp-field--choice">
                        <label>Revisões na autorizada</label>
                        <Choice name="vehicle_revisoes" options={["Sim", "Não"]} defaultValue="Não" />
                      </div>

                      <div className="sp-field"><label htmlFor="av-cor">Cor (manual do veículo)</label><input id="av-cor" name="vehicle_cor" placeholder="Ex: Azul" /></div>
                      <div className="sp-field sp-field--choice">
                        <label>Sinistro</label>
                        <Choice name="vehicle_sinistro" options={["Sim", "Não"]} defaultValue="Não" />
                      </div>

                      <div className="sp-field">
                        <label htmlFor="av-combustivel">Combustível</label>
                        <select id="av-combustivel" name="vehicle_combustivel">
                          <option value="">Selecione</option>
                          <option>Flex</option><option>Gasolina</option><option>Etanol</option><option>Diesel</option><option>GNV</option><option>Híbrido</option><option>Elétrico</option>
                        </select>
                      </div>
                      <div className="sp-field">
                        <label htmlFor="av-cambio">Câmbio</label>
                        <select id="av-cambio" name="vehicle_cambio">
                          <option value="">Selecione</option>
                          <option>Manual</option><option>Automático</option><option>Automatizado</option><option>CVT</option>
                        </select>
                      </div>

                      <div className="sp-field">
                        <label htmlFor="av-pneus">Estado dos pneus</label>
                        <select id="av-pneus" name="vehicle_pneus">
                          <option value="">Selecione</option>
                          <option>Novos</option><option>Bom</option><option>Regular</option><option>Precisa trocar</option>
                        </select>
                      </div>
                      <div className="sp-field"><label htmlFor="av-acessorio">Acessório extra</label><input id="av-acessorio" name="vehicle_acessorio" placeholder="Ex: Airbag duplo, som, teto solar" /></div>
                    </div>
                  </fieldset>

                  <fieldset className="sp-fieldset">
                    <legend>Dados Pessoais</legend>
                    <div className="sp-fields">
                      <div className="sp-field sp-field--wide"><label htmlFor="av-nome">Nome *</label><input id="av-nome" name="name" required placeholder="Seu nome completo" /></div>

                      <div className="sp-field sp-field--phone">
                        <label htmlFor="av-fone">Telefone / WhatsApp *</label>
                        <div className="sp-phone">
                          <input
                            name="phone_ddd"
                            required
                            inputMode="numeric"
                            maxLength={2}
                            placeholder="DDD"
                            aria-label="DDD"
                            onChange={(e) => handleMask(e, (v) => onlyDigits(v).slice(0, 2))}
                          />
                          <input
                            id="av-fone"
                            name="phone"
                            required
                            inputMode="numeric"
                            placeholder="99999-0000"
                            onChange={(e) => handleMask(e, maskPhone)}
                          />
                        </div>
                      </div>
                      <div className="sp-field"><label htmlFor="av-email">E-mail</label><input id="av-email" name="email" type="email" placeholder="seu@email.com" /></div>

                      <div className="sp-field">
                        <label htmlFor="av-nasc">Data de nascimento</label>
                        <input id="av-nasc" name="birth" inputMode="numeric" placeholder="dd/mm/aaaa" onChange={(e) => handleMask(e, maskDate)} />
                      </div>
                      <div className="sp-field"><label htmlFor="av-end">Endereço</label><input id="av-end" name="address" placeholder="Rua, número, bairro — cidade" /></div>

                      <div className="sp-field"><label htmlFor="av-prof">Profissão</label><input id="av-prof" name="job" placeholder="Sua profissão" /></div>
                      <div className="sp-field">
                        <label htmlFor="av-cpf">CPF</label>
                        <input id="av-cpf" name="cpf" inputMode="numeric" placeholder="000.000.000-00" onChange={(e) => handleMask(e, maskCpf)} />
                      </div>

                      <div className="sp-field sp-field--wide"><label htmlFor="av-origem">Como conheceu a Henrique Veículos?</label><input id="av-origem" name="origin" placeholder="Ex: Internet, indicação, passei em frente" /></div>

                      <div className="sp-field sp-field--wide sp-field--choice">
                        <label>O que você pretende fazer?</label>
                        <Choice
                          name="intent"
                          options={["Deseja somente vender", "Deseja vender e comprar"]}
                          defaultValue="Deseja vender e comprar"
                        />
                      </div>

                      <div className="sp-field sp-field--wide"><label htmlFor="av-interesse">Qual veículo lhe interessou em nosso estoque?</label><input id="av-interesse" name="interest" placeholder="Ex: Jeep Compass 2020" /></div>

                      <div className="sp-field sp-field--wide"><label htmlFor="av-obs">Observações</label><textarea id="av-obs" name="notes" rows={3} placeholder="Condição do veículo, acessórios, histórico de revisões..." /></div>
                    </div>
                  </fieldset>

                  <button className="sp-submit" type="submit">
                    Enviar avaliação
                    <span className="sp-submit-arrow" aria-hidden="true">→</span>
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
