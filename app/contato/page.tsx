"use client";

import { BrandLogo } from "@/components/brand-logo";
import { ScrollReveal } from "@/components/scroll-reveal";

const WA = "https://wa.me/5513974066867";

function buildMsg(data: Record<string, string>) {
  const lines = ["Olá, vim pelo site e gostaria de entrar em contato:"];
  if (data.name) lines.push(`Nome: ${data.name}`);
  if (data.phone) lines.push(`Telefone: ${data.phone}`);
  if (data.email) lines.push(`E-mail: ${data.email}`);
  if (data.notes) lines.push(`Mensagem: ${data.notes}`);
  return lines.join("\n");
}

export default function ContatoPage() {
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
            <p className="sp-eyebrow">Contato</p>
            <h1 className="sp-title">Entre em contato com a Henrique Veículos.</h1>
            <p className="sp-lede">Atendimento presencial em Vicente de Carvalho, Guarujá/SP. Também pelo WhatsApp, telefone ou e-mail.</p>
          </div>

          <div className="sp-body">
            <ScrollReveal delay={100}>
              <div className="sp-contact-info">
                <div className="sp-contact-item">
                  <span className="sp-contact-label">WhatsApp / Telefone</span>
                  <a href={WA} className="sp-contact-value">(13) 97406-6867</a>
                  <a href="tel:+551321912176" className="sp-contact-value">(13) 2191-2176</a>
                </div>
                <div className="sp-contact-item">
                  <span className="sp-contact-label">E-mail</span>
                  <a href="mailto:henrique_veiculos@hotmail.com" className="sp-contact-value">henrique_veiculos@hotmail.com</a>
                </div>
                <div className="sp-contact-item">
                  <span className="sp-contact-label">Endereço</span>
                  <span className="sp-contact-value">Av. Santos Dumont, 1384</span>
                  <span className="sp-contact-value">Sítio Paecara (Vicente de Carvalho), Guarujá/SP</span>
                </div>
                <div className="sp-contact-item">
                  <span className="sp-contact-label">Horário</span>
                  <span className="sp-contact-value">Seg–Sex: 8h às 18h</span>
                  <span className="sp-contact-value">Sábado: 8h às 14h</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="sp-form-card">
                <h2 className="sp-form-title">Envie uma mensagem</h2>
                <form className="sp-form" onSubmit={handleSubmit}>
                  <div className="sp-fields">
                    <div className="sp-field sp-field--wide"><label>Nome *</label><input name="name" required placeholder="Seu nome" /></div>
                    <div className="sp-field"><label>Telefone *</label><input name="phone" required placeholder="(13) 99999-0000" /></div>
                    <div className="sp-field"><label>E-mail</label><input name="email" type="email" placeholder="seu@email.com" /></div>
                    <div className="sp-field sp-field--wide"><label>Mensagem</label><textarea name="notes" rows={4} placeholder="Como podemos te ajudar?" /></div>
                  </div>
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
