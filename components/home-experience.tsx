"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/social-icons";
import { ShowroomLogo } from "@/components/showroom-logo";
import { vehicleImage, vehicleSearchText, type Vehicle } from "@/lib/vehicle-shared";

const whatsappBase =
  "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20tenho%20interesse%20no%20ve%C3%ADculo%3A%20";
const navRoutes = ["/avaliacao", "/consignacao", "/financiamento", "/empresa", "/contato"];
let activeNavScroll: number | null = null;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (activeNavScroll !== null) {
    window.cancelAnimationFrame(activeNavScroll);
    activeNavScroll = null;
  }

  const start = window.scrollY;
  const target = el.getBoundingClientRect().top + window.scrollY;
  const distance = target - start;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || Math.abs(distance) < 2) {
    window.scrollTo(0, target);
    return;
  }

  const duration = Math.min(150, Math.max(70, Math.abs(distance) / 8));
  let startTime: number | null = null;
  function easeOut(t: number) { return 1 - (1 - t) ** 3; }
  function step(ts: number) {
    if (startTime === null) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    window.scrollTo(0, start + distance * easeOut(p));
    if (p < 1) {
      activeNavScroll = requestAnimationFrame(step);
    } else {
      activeNavScroll = null;
    }
  }
  activeNavScroll = requestAnimationFrame(step);
}

function navClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  scrollToSection(id);
}

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
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    navRoutes.forEach((href) => router.prefetch(href));
  }, [router]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="site-masthead">
      <div className="masthead-grid">
        <a href="#inicio" aria-label="Henrique Veículos" onClick={(e) => navClick(e, "inicio")}>
          <BrandLogo />
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <div className="nav-grid" ref={navRef}>
            <button
              className="menu-button"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              Menu
            </button>
            <div id="site-menu" className={`menu ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(false)}>
              <a className="is-active" href="#inicio" onClick={(e) => navClick(e, "inicio")}>
                Home
              </a>
              <a href="#estoque" onClick={(e) => navClick(e, "estoque")}>Estoque</a>
              <Link href="/avaliacao">Avaliação</Link>
              <Link href="/consignacao">Consignação</Link>
              <Link href="/financiamento">Financiamento</Link>
              <Link href="/empresa">Empresa</Link>
              <Link href="/contato">Contato</Link>
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
  const images = useMemo(
    () => vehicles.map((vehicle) => vehicleImage(vehicle)).filter((src): src is string => Boolean(src)),
    [vehicles],
  );

  // Duas faixas de carros deslizando em sentidos opostos no fundo.
  // Duplicamos cada lista para o loop ficar contínuo (sem "salto").
  const half = Math.floor(images.length / 2);
  const rowTop = images.length ? [...images, ...images] : [];
  const shifted = images.length ? [...images.slice(half), ...images.slice(0, half)] : [];
  const rowBottom = shifted.length ? [...shifted, ...shifted] : [];

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-row hero-row--top">
          {rowTop.map((src, index) => (
            <span className="hero-frame" key={`t-${index}`} style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
        <div className="hero-row hero-row--bottom">
          {rowBottom.map((src, index) => (
            <span className="hero-frame" key={`b-${index}`} style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
      </div>

      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-inner reveal">
        <span className="hero-eyebrow">Henrique Veículos · Guarujá desde 2010</span>
        <h1 className="hero-headline">
          O carro certo no <span className="accent">ritmo</span>
          <br />
          da sua vida.
        </h1>
        <p className="hero-lede">
          Seminovos revisados, procedência garantida e financiamento facilitado. Você escolhe pelo site e a gente cuida
          do resto — da avaliação do seu usado à documentação.
        </p>
        <div className="hero-cta">
          <a className="button primary" href="#estoque" onClick={(event) => navClick(event, "estoque")}>
            Ver estoque <span aria-hidden="true">↗</span>
          </a>
          <a className="button ghost" href="https://wa.me/5513974066867" target="_blank" rel="noreferrer">
            Falar no WhatsApp
          </a>
        </div>
        <ul className="hero-badges" aria-label="Diferenciais">
          <li>Procedência garantida</li>
          <li>Seu usado na troca</li>
          <li>Financiamento facilitado</li>
        </ul>
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

const SERVICES: { id: string; title: string; desc: string; href: string; icon: React.ReactNode }[] = [
  {
    id: "avaliacao",
    title: "Avaliação",
    desc: "Seu usado entra na troca",
    href: "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20quero%20avaliar%20meu%20ve%C3%ADculo%20na%20Henrique%20Ve%C3%ADculos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <polyline points="8.5 11 10.5 13 14 9" />
      </svg>
    ),
  },
  {
    id: "consignacao",
    title: "Consignação",
    desc: "Venda assistida na loja",
    href: "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20consignar%20meu%20ve%C3%ADculo%20na%20Henrique%20Ve%C3%ADculos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    id: "financiamento",
    title: "Financiamento",
    desc: "Simulação rápida no Zap",
    href: "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20quero%20simular%20um%20financiamento%20na%20Henrique%20Ve%C3%ADculos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "empresa",
    title: "Empresa local",
    desc: "Desde 2010 · Guarujá",
    href: "https://www.google.com/maps/search/?api=1&query=Av.+Santos+Dumont+1384+Vicente+de+Carvalho+Guaruj%C3%A1+SP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const MARQUEE_ITEMS = [
  "Procedência garantida",
  "Seu usado na troca",
  "Financiamento facilitado",
  "Seminovos revisados",
  "Guarujá desde 2010",
  "Atendimento de verdade",
];

function Marquee() {
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loop.map((item, index) => (
          <span className="marquee__item" key={index}>
            <span className="marquee__label">{item}</span>
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

function WhyUs() {
  return (
    <section className="whyus" aria-label="Por que comprar na Henrique Veículos">
      <div className="whyus-wrap">
        <div className="whyus-lead reveal">
          <span className="whyus-eyebrow">
            <em>01</em> A Henrique
          </span>
          <h2 className="whyus-heading">
            A experiência que transforma pesquisa em <span className="accent">carro na garagem</span>.
          </h2>
          <p className="whyus-sub">
            No Guarujá desde 2010, a gente sabe que comprar carro é decisão grande. Por isso cada veículo é revisado e
            com procedência checada, e você tem acompanhamento do test-drive à documentação.
          </p>
          <a className="whyus-link" href="#estoque" onClick={(event) => navClick(event, "estoque")}>
            Ver estoque completo <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="whyus-grid">
          {SERVICES.map((service, index) => (
            <a
              className={`whyus-card ${index === 0 ? "is-highlight" : ""}`}
              key={service.id}
              id={service.id}
              href={service.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="whyus-icon" aria-hidden="true">
                {service.icon}
              </span>
              <div className="whyus-card-text">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeExperience({ vehicles }: { vehicles: Vehicle[] }) {
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => vehicleSearchText(vehicle).includes(term));
  }, [search, vehicles]);

  const showroomList = filteredVehicles;

  function handleSearch(value: string, shouldScroll = false) {
    setSearch(value);

    if (value.trim() && shouldScroll) {
      scrollToSection("estoque");
    }
  }

  return (
    <>
      <Header search={search} onSearch={handleSearch} />
      <main id="inicio">
        <Hero vehicles={vehicles} />

        <WhyUs />

        <section className="address-bar" aria-label="Endereço e horário">
          <div className="wrap address-grid">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.%20Santos%20Dumont%2C%201384%20S%C3%ADtio%20Paecara%20Guaruj%C3%A1%20SP"
              target="_blank"
              rel="noreferrer"
            >
              Av. Santos Dumont, 1384, Sítio Paecara (Vicente de Carvalho) - Guarujá/SP
            </a>
            <span>Segunda à sexta das 9:00 às 18:00 · Sábado das 9:00 às 14:00</span>
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

      <Marquee />

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
      <div className="contact-shell">
        <div className="contact-lead">
          <span className="contact-eyebrow">Visite a loja</span>
          <h2 className="contact-heading">
            Venha ver o carro <span className="contact-heading-italic">de perto</span>.
          </h2>
          <p className="contact-sub">Loja física no Guarujá · Aceitamos seu usado na troca.</p>
          <a className="contact-whats" href="https://wa.me/5513974066867" target="_blank" rel="noreferrer">
            <WhatsappIcon />
            Falar no WhatsApp
          </a>
        </div>

        <dl className="contact-facts">
          <div className="contact-fact">
            <dt>Endereço</dt>
            <dd>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.%20Santos%20Dumont%2C%201384%20S%C3%ADtio%20Paecara%20Guaruj%C3%A1%20SP"
                target="_blank"
                rel="noreferrer"
              >
                Av. Santos Dumont, 1384 — Vicente de Carvalho, Guarujá/SP
              </a>
            </dd>
          </div>
          <div className="contact-fact">
            <dt>Horário</dt>
            <dd>
              Seg a Sex · 9h–18h
              <br />
              Sábado · 9h–14h
            </dd>
          </div>
          <div className="contact-fact">
            <dt>Telefone</dt>
            <dd>
              <a href="tel:+5513974066867">(13) 97406-6867</a>
            </dd>
          </div>
          <div className="contact-fact">
            <dt>Instagram</dt>
            <dd>
              <a href="https://instagram.com/henriqueveiculos" target="_blank" rel="noreferrer">
                @henriqueveiculos
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
