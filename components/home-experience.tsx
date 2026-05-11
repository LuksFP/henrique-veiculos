"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/social-icons";
import { ShowroomLogo } from "@/components/showroom-logo";
import { vehicleImage, vehicleSearchText, type Vehicle } from "@/lib/vehicle-shared";

const whatsappBase =
  "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20tenho%20interesse%20no%20ve%C3%ADculo%3A%20";

function whatsappVehicleUrl(vehicle: Vehicle, suffix = "") {
  return `${whatsappBase}${encodeURIComponent(`${vehicle.make} ${vehicle.model} ${vehicle.year}`)}${suffix}`;
}

function VehicleImage({ vehicle }: { vehicle: Vehicle }) {
  const image = vehicleImage(vehicle);

  if (!image) {
    return <ShowroomLogo />;
  }

  return <img src={image} alt={`${vehicle.make} ${vehicle.model}`} loading="lazy" />;
}

function Header({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (value: string, shouldScroll?: boolean) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-masthead">
      <div className="masthead-grid">
        <a href="#inicio" aria-label="Henrique Veículos">
          <BrandLogo />
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <div className="nav-grid">
            <button
              className="menu-button"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              Menu
            </button>
            <div id="site-menu" className={`menu ${menuOpen ? "is-open" : ""}`}>
              <a className="is-active" href="#inicio">
                Home
              </a>
              <a href="#estoque">Estoque</a>
              <a href="#avaliacao">Avaliação</a>
              <a href="#consignacao">Consignação</a>
              <a href="#financiamento">Financiamento</a>
              <a href="#empresa">Empresa</a>
              <a href="#contato">Contato</a>
            </div>
            <form
              className="nav-search"
              onSubmit={(event) => {
                event.preventDefault();
                onSearch(search, true);
              }}
            >
              <label>
                <span className="sr-only">Digite o veículo que procura</span>
                <input
                  type="search"
                  value={search}
                  placeholder="Digite o veículo que procura!"
                  autoComplete="off"
                  onChange={(event) => onSearch(event.target.value)}
                />
              </label>
              <button type="submit">Buscar</button>
            </form>
          </div>
        </nav>

        <div className="social-top" aria-label="Redes sociais">
          <a className="social instagram" href="#contato" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a className="social facebook" href="#contato" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a className="social whatsapp" href="https://wa.me/5513974066867" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <WhatsappIcon />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ vehicles }: { vehicles: Vehicle[] }) {
  const highlights = vehicles.filter((vehicle) => vehicle.is_featured).slice(0, 3);
  const slides = highlights.length ? highlights : vehicles.slice(0, 3);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveSlide((value) => (value + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="hero-stage">
        <div className="lime-panel" aria-hidden="true" />
        <div className="hero-carousel reveal" aria-label="Destaques da semana em carrossel">
          <button
            className="carousel-arrow carousel-prev"
            type="button"
            aria-label="Destaque anterior"
            onClick={() => setActiveSlide((value) => (value - 1 + slides.length) % slides.length)}
          >
            ‹
          </button>
          <div className="carousel-slides">
            {slides.map((vehicle, index) => (
              <article className={`carousel-slide ${index === activeSlide ? "is-active" : ""}`} key={vehicle.id}>
                <div className="carousel-copy">
                  <span className="title-flame" aria-hidden="true" />
                  <p>Destaque da Semana</p>
                  <h1>
                    {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="carousel-actions">
                    <strong>{vehicle.price}</strong>
                    <a className="button primary" href={whatsappVehicleUrl(vehicle)} target="_blank" rel="noreferrer">
                      Consultar no WhatsApp
                    </a>
                  </div>
                  <div className="carousel-meta">
                    <span>{vehicle.year}</span>
                    <span>{vehicle.transmission}</span>
                    <span>{vehicle.fuel}</span>
                    <span>{vehicle.color || "Consulte"}</span>
                  </div>
                </div>
                <div className="carousel-photo">
                  <VehicleImage vehicle={vehicle} />
                </div>
              </article>
            ))}
          </div>
          <div className="carousel-dots" aria-label="Navegação do carrossel">
            {slides.map((vehicle, index) => (
              <button
                key={vehicle.id}
                className={`carousel-dot ${index === activeSlide ? "is-active" : ""}`}
                type="button"
                aria-label={`Ver destaque ${index + 1}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
          <button
            className="carousel-arrow carousel-next"
            type="button"
            aria-label="Próximo destaque"
            onClick={() => setActiveSlide((value) => (value + 1) % slides.length)}
          >
            ›
          </button>
        </div>
      </div>
      <div className="floating-social" aria-label="Redes sociais fixas">
        <a className="social facebook" href="#contato" aria-label="Facebook">
          f
        </a>
        <a className="social whatsapp" href="https://wa.me/5513974066867" target="_blank" rel="noreferrer" aria-label="WhatsApp">
          ☎
        </a>
        <a className="social instagram" href="#contato" aria-label="Instagram">
          ◎
        </a>
        <a className="social email" href="mailto:henrique_veiculos@hotmail.com" aria-label="Email">
          ✉
        </a>
      </div>
    </section>
  );
}

function StockRow({ vehicle, onOpen }: { vehicle: Vehicle; onOpen: () => void }) {
  return (
    <article className="stock-row" data-search={vehicleSearchText(vehicle)}>
      <div className="showroom-media">
        <VehicleImage vehicle={vehicle} />
        <span className="year-badge">{vehicle.year}</span>
      </div>
      <div className="stock-copy">
        <span className="stock-brand">{vehicle.make}</span>
        <strong>{vehicle.model}</strong>
      </div>
      <div className="stock-specs" aria-label="Resumo do veículo">
        <span>{vehicle.transmission}</span>
        <span>{vehicle.fuel}</span>
        <span>{vehicle.km ? `${vehicle.km} km` : "Km consulte"}</span>
      </div>
      <span className="price">{vehicle.price}</span>
      <a
        className="open-detail"
        href={`/veiculo/${vehicle.id}`}
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
      >
        Ver detalhes →
      </a>
    </article>
  );
}

function VehicleModal({ vehicle, onClose }: { vehicle: Vehicle | null; onClose: () => void }) {
  useEffect(() => {
    if (!vehicle) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, vehicle]);

  if (!vehicle) {
    return null;
  }

  const specs = [
    ["Marca", vehicle.make],
    ["Modelo", vehicle.model],
    ["Ano", String(vehicle.year)],
    ["Câmbio", vehicle.transmission],
    ["Combustível", vehicle.fuel],
    ["Km", vehicle.km || "—"],
    ["Cor", vehicle.color || "—"],
  ] as const;

  return (
    <div className="vehicle-modal is-open" aria-hidden="false" role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title">
      <button className="vehicle-modal-backdrop" type="button" onClick={onClose} aria-label="Fechar detalhes" />
      <div className="vehicle-modal-content">
        <button type="button" className="vehicle-modal-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <div className="vehicle-modal-body">
          <div className="modal-gallery">
            <VehicleImage vehicle={vehicle} />
            <span className="year-badge">{vehicle.year}</span>
          </div>
          <div className="modal-info">
            <span className="modal-eyebrow">{vehicle.make}</span>
            <h2 id="vehicle-modal-title" className="modal-title">
              {vehicle.model}
            </h2>
            <div className="modal-price">{vehicle.price}</div>
            <div className="modal-specs">
              {specs.map(([label, value]) => (
                <div className="modal-spec" key={label}>
                  <span className="modal-spec-label">{label}</span>
                  <span className="modal-spec-value">{value}</span>
                </div>
              ))}
            </div>
            {vehicle.options.length > 0 ? (
              <div className="modal-options">
                <h4>Opcionais</h4>
                <div className="modal-options-list">
                  {vehicle.options.map((option) => (
                    <span key={option}>{option}</span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="modal-actions">
              <a className="modal-cta primary" href={whatsappVehicleUrl(vehicle)} target="_blank" rel="noreferrer">
                <WhatsappIcon />
                Solicitar proposta
              </a>
              <a
                className="modal-cta secondary"
                href={whatsappVehicleUrl(vehicle, "%20-%20Quero%20simular%20financiamento")}
                target="_blank"
                rel="noreferrer"
              >
                Simular financiamento
              </a>
              <a className="modal-cta ghost" href={`/veiculo/${vehicle.id}`}>
                Abrir página do veículo ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEAL_COUNT = 4;

export function HomeExperience({ vehicles }: { vehicles: Vehicle[] }) {
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const dealScrollRef = useRef<HTMLDivElement>(null);
  const [dealSlide, setDealSlide] = useState(0);
  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => vehicleSearchText(vehicle).includes(term));
  }, [search, vehicles]);

  const showroomList = useMemo(() => {
    const showroomPriority = ["HB20 1.0 CONFOR", "ARGO", "HB20S", "PCX"];

    return [...filteredVehicles].sort((first, second) => {
      const firstIndex = showroomPriority.findIndex((term) => first.model.includes(term));
      const secondIndex = showroomPriority.findIndex((term) => second.model.includes(term));

      return (firstIndex === -1 ? 99 : firstIndex) - (secondIndex === -1 ? 99 : secondIndex);
    });
  }, [filteredVehicles]);

  useEffect(() => {
    const el = dealScrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      const cardW = el.scrollWidth / DEAL_COUNT;
      setDealSlide(Math.min(DEAL_COUNT - 1, Math.round(el.scrollLeft / cardW)));
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDealSlide((prev) => {
        const next = (prev + 1) % DEAL_COUNT;
        const el = dealScrollRef.current;
        const card = el?.children[next] as HTMLElement | undefined;
        card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
        return next;
      });
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  function scrollToDeal(idx: number) {
    const el = dealScrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setDealSlide(idx);
  }

  function handleSearch(value: string, shouldScroll = false) {
    setSearch(value);

    if (value.trim() && shouldScroll) {
      document.querySelector("#estoque")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      <Header search={search} onSearch={handleSearch} />
      <main id="inicio">
        <Hero vehicles={vehicles} />

        <section className="address-bar" aria-label="Endereço e horário">
          <div className="wrap address-grid">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.%20Santos%20Dumont%2C%201384%20S%C3%ADtio%20Paecara%20Guaruj%C3%A1%20SP"
              target="_blank"
              rel="noreferrer"
            >
              Av. Santos Dumont, 1384, Sítio Paecara (Vicente de Carvalho) - Guarujá/SP
            </a>
            <span>Segunda à sexta das 8:00 às 18:00 · Sábado das 8:00 às 14:00</span>
          </div>
        </section>

        <section className="deal-strip" aria-label="Serviços da Henrique Veículos">
          <div className="deal-wrap" ref={dealScrollRef}>
            <article id="avaliacao" className="deal-card deal-card-feature">
              <span className="deal-number">01</span>
              <div>
                <p className="deal-kicker">Avaliação na loja</p>
                <h2>Seu usado entra como parte do negócio.</h2>
              </div>
              <p>Traga seu carro ou moto para uma avaliação direta, com proposta clara e sem etapa escondida.</p>
              <a
                href="https://wa.me/5513974066867?text=Ol%C3%A1%2C%20quero%20avaliar%20meu%20ve%C3%ADculo%20na%20Henrique%20Ve%C3%ADculos"
                target="_blank"
                rel="noreferrer"
              >
                Avaliar meu veículo
              </a>
            </article>
            <article id="consignacao" className="deal-card">
              <span className="deal-number">02</span>
              <p className="deal-kicker">Consignação</p>
              <h3>Venda assistida</h3>
              <p>Anuncie com apoio da loja, atendimento no ponto físico e negociação acompanhada.</p>
              <a
                href="https://wa.me/5513974066867?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20consignar%20meu%20ve%C3%ADculo%20na%20Henrique%20Ve%C3%ADculos"
                target="_blank"
                rel="noreferrer"
              >
                Quero consignar
              </a>
            </article>
            <article id="financiamento" className="deal-card">
              <span className="deal-number">03</span>
              <p className="deal-kicker">Financiamento</p>
              <h3>Simulação rápida</h3>
              <p>Condições consultadas por WhatsApp para você entender entrada, parcelas e aprovação.</p>
              <a
                href="https://wa.me/5513974066867?text=Ol%C3%A1%2C%20quero%20simular%20um%20financiamento%20na%20Henrique%20Ve%C3%ADculos"
                target="_blank"
                rel="noreferrer"
              >
                Simular financiamento
              </a>
            </article>
            <article id="empresa" className="deal-card">
              <span className="deal-number">04</span>
              <p className="deal-kicker">Empresa local</p>
              <h3>Desde 2010</h3>
              <p>Atendimento presencial em Vicente de Carvalho, Guarujá, com estoque selecionado.</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+Santos+Dumont+1384+Vicente+de+Carvalho+Guaruj%C3%A1+SP"
                target="_blank"
                rel="noreferrer"
              >
                Como chegar
              </a>
            </article>
          </div>
          <div className="deal-nav">
            <button
              className="deal-arrow"
              type="button"
              aria-label="Anterior"
              onClick={() => scrollToDeal((dealSlide - 1 + DEAL_COUNT) % DEAL_COUNT)}
            >
              ‹
            </button>
            <div className="deal-dots">
              {Array.from({ length: DEAL_COUNT }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir para slide ${i + 1}`}
                  className={`deal-dot${dealSlide === i ? " is-active" : ""}`}
                  onClick={() => scrollToDeal(i)}
                />
              ))}
            </div>
            <button
              className="deal-arrow"
              type="button"
              aria-label="Próximo"
              onClick={() => scrollToDeal((dealSlide + 1) % DEAL_COUNT)}
            >
              ›
            </button>
          </div>
        </section>

        <section id="estoque" className="showroom-section">
          <div className="showroom-wrap">
            <header className="showroom-header">
              <div>
                <span className="showroom-eyebrow">Estoque completo</span>
                <h2 className="showroom-title">Encontre seu próximo carro</h2>
                <p className="showroom-lede">Use a busca no topo ou abra um veículo para ver os detalhes antes de chamar no WhatsApp.</p>
              </div>
              <div className="showroom-count">
                {showroomList.length ? (
                  <>
                    <strong>{showroomList.length}</strong> {showroomList.length === 1 ? "veículo disponível" : "veículos disponíveis"}
                  </>
                ) : (
                  "Nenhum veículo encontrado"
                )}
              </div>
            </header>
            <div className="showroom-layout">
              <div className="stock-list">
                {showroomList.length ? (
                  showroomList.map((vehicle) => <StockRow key={vehicle.id} vehicle={vehicle} onOpen={() => setSelectedVehicle(vehicle)} />)
                ) : (
                  <p className="empty-stock">Nenhum veículo encontrado. Tente buscar por marca, modelo ou ano.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <a className="whatsapp-float" href="https://wa.me/5513974066867" target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp">
        <WhatsappIcon />
      </a>

      <footer className="footer">
        <div className="wrap footer-grid">
          <span>© 2026 Henrique Veículos - www.henriqueveiculos.com.br</span>
        </div>
      </footer>

      <VehicleModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </>
  );
}

function Contact() {
  return (
    <section id="contato" className="contact">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {["Encontre · Negocie · Leve pra casa", "Desde 2010", "Guarujá - SP", "Seminovos selecionados", "Financiamento próprio"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="outro">
        <div className="outro-head">
          <div className="outro-kicker">
            <span className="outro-num">04</span>
            <span className="outro-label">Visite · Conecte</span>
          </div>
          <h2 className="outro-title">
            Venha <span className="outro-italic">tomar um café</span> e ver o <span className="outro-stamp">carro</span> de perto.
          </h2>
          <p className="outro-lede">Loja física no Guarujá. Atendimento de segunda a sábado. Aceitamos seu usado na troca.</p>
        </div>
        <ol className="outro-list">
          {[
            ["01", "Instagram", "@henriqueveiculos", "#", "novidades · ofertas"],
            ["02", "Facebook", "Henrique Veículos", "#", "vídeos · estoque"],
            ["03", "WhatsApp", "(13) 97406-6867", "https://wa.me/5513974066867", "resposta rápida"],
            [
              "04",
              "Endereço",
              "Av. Santos Dumont, 1384",
              "https://www.google.com/maps/search/?api=1&query=Av.%20Santos%20Dumont%2C%201384%20S%C3%ADtio%20Paecara%20Guaruj%C3%A1%20SP",
              "Guarujá / SP",
            ],
          ].map(([num, label, value, href, meta]) => (
            <li className="outro-item" key={num}>
              <span className="outro-item-num">{num}</span>
              <div className="outro-item-body">
                <span className="outro-item-label">{label}</span>
                <a className="outro-item-link" href={href} target="_blank" rel="noreferrer">
                  {value}
                  <span className="arrow">↗</span>
                </a>
              </div>
              <span className="outro-item-meta">{meta}</span>
            </li>
          ))}
        </ol>
        <a className="outro-cta" href="#estoque">
          <span className="outro-cta-label">Ver estoque completo</span>
          <span className="outro-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
      <div className="footer-main">
        <div className="footer-wordmark" aria-hidden="true">
          <span className="footer-wordmark-text">HENRIQUE</span>
          <span className="footer-wordmark-flag" />
          <span className="footer-wordmark-text light">VEÍCULOS</span>
        </div>
        <div className="footer-meta">
          <div className="footer-meta-col">
            <span className="footer-meta-label">Telefone</span>
            <a href="tel:+551321912176">(13) 2191-2176</a>
            <a href="tel:+5513974066867">(13) 97406-6867</a>
          </div>
          <div className="footer-meta-col">
            <span className="footer-meta-label">E-mail</span>
            <a href="mailto:henrique_veiculos@hotmail.com">henrique_veiculos@hotmail.com</a>
          </div>
          <div className="footer-meta-col">
            <span className="footer-meta-label">Horário</span>
            <span>Seg-Sex / 8h-18h</span>
            <span>Sáb / 8h-14h</span>
          </div>
          <div className="footer-meta-col">
            <span className="footer-meta-label">Loja</span>
            <span>Av. Santos Dumont, 1384</span>
            <span>Vicente de Carvalho · Guarujá / SP</span>
          </div>
        </div>
      </div>
    </section>
  );
}
