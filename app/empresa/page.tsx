import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Conheça a Henrique Veículos | Guarujá/SP",
  description: "Mais de 10 anos atendendo clientes em Vicente de Carvalho, Guarujá. Veículos revisados, estoque variado e negociação flexível.",
};

const MAPS = "https://www.google.com/maps/search/?api=1&query=Av.+Santos+Dumont+1384+Vicente+de+Carvalho+Guaruj%C3%A1+SP";

export default function EmpresaPage() {
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
            <p className="sp-eyebrow">Empresa local</p>
            <h1 className="sp-title">Conheça a Henrique Veículos.</h1>
            <p className="sp-lede">A Henrique Veículos nasceu para trazer um novo conceito ao mercado automotivo — colocando a satisfação do cliente em primeiro lugar.</p>
          </div>

          <div className="sp-body sp-body--single">
            <ScrollReveal delay={100}>
              <div className="sp-prose">
                <p>Estamos há mais de dez anos atendendo as necessidades de todos aqueles clientes que possuem dentro de si o sonho de comprar o primeiro carro ou de trocar por um veículo melhor.</p>
                <p>Trabalhamos com um estoque selecionado de carros e motos revisados, com variedade de marcas e modelos para diferentes perfis e orçamentos. Nossa negociação é flexível e aceitamos veículos usados como parte do pagamento.</p>
                <p>Prezamos em primeiro lugar a satisfação dos nossos clientes — porque um cliente satisfeito volta e indica.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="sp-info-cards">
                <div className="sp-info-card">
                  <span className="sp-info-n">+10</span>
                  <span className="sp-info-label">Anos de experiência</span>
                </div>
                <div className="sp-info-card">
                  <span className="sp-info-n">100%</span>
                  <span className="sp-info-label">Foco na satisfação</span>
                </div>
                <div className="sp-info-card">
                  <span className="sp-info-n">GRU</span>
                  <span className="sp-info-label">Vicente de Carvalho, Guarujá</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="sp-address-block">
                <p className="sp-cta-label">Onde estamos</p>
                <p>Av. Santos Dumont, 1384, Sítio Paecara (Vicente de Carvalho) — Guarujá/SP</p>
                <p>Segunda à sexta das 9:00 às 18:00 · Sábado das 9:00 às 14:00</p>
                <div className="sp-address-links">
                  <a href={MAPS} target="_blank" rel="noreferrer" className="sp-btn-cta">Como chegar</a>
                  <a href="https://wa.me/5513974066867" target="_blank" rel="noreferrer" className="sp-btn-ghost">Falar pelo WhatsApp</a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
