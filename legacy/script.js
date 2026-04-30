const vehicles = [
  {
    make: "FIAT",
    model: "ARGO 1.0 FIREFLY FLEX DRIVE MANUAL",
    year: "2025",
    km: "44.109",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "BRANCO",
    price: "R$ 75.990,00",
    options: ["ABS", "Airbag", "Ar-condicionado", "Outros opcionais"],
    image: "./assets/vehicles/fiat-argo-ai.png",
    bg: "linear-gradient(135deg, #f4f4f5, #a1a1aa)",
  },
  {
    make: "HYUNDAI",
    model: "HB20S 1.0 M COMFORT",
    year: "2025",
    km: "37.927",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "PRATA",
    price: "R$ 83.990,00",
    options: ["ABS", "Airbag", "Ar-condicionado", "Outros opcionais"],
    image: "./assets/vehicles/hyundai-hb20s-ai.png",
    bg: "linear-gradient(135deg, #9ca3af, #3f3f46)",
  },
  {
    make: "HONDA",
    model: "PCX 160 DLX ABS",
    year: "2025",
    km: "1.600",
    fuel: "GASOLINA",
    transmission: "AUTOMÁTICO",
    color: "BRANCO",
    price: "R$ 21.990,00",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/honda-pcx-ai.png",
    bg: "linear-gradient(135deg, #f8fafc, #64748b)",
  },
  {
    make: "HYUNDAI",
    model: "HB20 1.0 CONFOR",
    year: "2025",
    km: "43.848",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "CINZA",
    price: "R$ Consulte",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/hyundai-hb20-ai.png",
    bg: "linear-gradient(135deg, #71717a, #18181b)",
  },
  {
    make: "HONDA",
    model: "BIZ 125",
    year: "2024",
    km: "12.394",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "BRANCO",
    price: "R$ 17.490,00",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/honda-biz-ai.png",
    bg: "linear-gradient(135deg, #f5f5f4, #78716c)",
  },
  {
    make: "CHEVROLET",
    model: "ONIX 1.0 TURBO FLEX PLUS LT MANUAL",
    year: "2023",
    km: "24.000",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "CINZA",
    price: "R$ 74.990,00",
    options: ["ABS", "Airbag", "Ar-condicionado"],
    image: "./assets/vehicles/chevrolet-onix-ai.png",
    bg: "linear-gradient(135deg, #6b7280, #111827)",
  },
  {
    make: "HONDA",
    model: "BIZ 125 +",
    year: "2022",
    km: "23.335",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "BRANCO",
    price: "R$ 15.990,00",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/honda-biz-ai.png",
    bg: "linear-gradient(135deg, #fafafa, #737373)",
  },
  {
    make: "FIAT",
    model: "NOVA STRADA FREEDOM CP 1.3",
    year: "2021",
    km: "76.526",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "PRETO",
    price: "R$ 75.990,00",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/fiat-strada-ai.png",
    bg: "linear-gradient(135deg, #1f2937, #020617)",
  },
  {
    make: "VOLKSWAGEN",
    model: "FOX 1.6 MSI TOTAL FLEX XTREME 4P MANUAL",
    year: "2020",
    km: "62.687",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "PRETO",
    price: "R$ 69.900,00",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/volkswagen-fox-ai.png",
    bg: "linear-gradient(135deg, #27272a, #09090b)",
  },
  {
    make: "HYUNDAI",
    model: "CRETA 1.6 16V FLEX ATTITUDE AUT",
    year: "2020",
    km: "70.330",
    fuel: "FLEX",
    transmission: "AUTOMÁTICO",
    color: "PRATA",
    price: "R$ 86.990,00",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/hyundai-creta-ai.png",
    bg: "linear-gradient(135deg, #a1a1aa, #27272a)",
  },
  {
    make: "CHEVROLET",
    model: "ONIX HATCH LT 1.0 12V TB FLEX 5P AUT.",
    year: "2020",
    km: "78.000",
    fuel: "FLEX",
    transmission: "AUTOMÁTICO",
    color: "CINZA",
    price: "R$ 68.990,00",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/chevrolet-onix-ai.png",
    bg: "linear-gradient(135deg, #52525b, #18181b)",
  },
  {
    make: "VOLKSWAGEN",
    model: "NOVA SAVEIRO TL MBVS",
    year: "2019",
    km: "83.281",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "BRANCO",
    price: "R$ 63.990,00",
    options: ["Outros opcionais"],
    image: "./assets/vehicles/volkswagen-saveiro-ai.png",
    bg: "linear-gradient(135deg, #f4f4f5, #71717a)",
  },
  {
    make: "VOLKSWAGEN",
    model: "FOX 1.6 MI XTREME 4P",
    year: "2018",
    km: "",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "",
    price: "R$ 64.990,00",
    options: [],
    image: "./assets/vehicles/volkswagen-fox-ai.png",
    bg: "linear-gradient(135deg, #404040, #171717)",
  },
  {
    make: "SUZUKI",
    model: "JIMNY 4SUN 1.3 16V",
    year: "2015",
    km: "",
    fuel: "GASOLINA",
    transmission: "MANUAL",
    color: "",
    price: "R$ 69.999,99",
    options: [],
    bg: "linear-gradient(135deg, #57534e, #1c1917)",
  },
  {
    make: "CHEVROLET",
    model: "SPIN 1.8 LT 8V FLEX 4P AUTOMATICO",
    year: "2015",
    km: "",
    fuel: "FLEX",
    transmission: "AUTOMÁTICO",
    color: "",
    price: "R$ 49.990,00",
    options: [],
    image: "./assets/vehicles/chevrolet-spin-ai.png",
    bg: "linear-gradient(135deg, #78716c, #292524)",
  },
  {
    make: "FIAT",
    model: "PALIO ATTRACT 1.4",
    year: "2013",
    km: "",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "",
    price: "R$ 39.990,00",
    options: [],
    bg: "linear-gradient(135deg, #d6d3d1, #57534e)",
  },
  {
    make: "CHEVROLET",
    model: "CLASSIC",
    year: "2010",
    km: "",
    fuel: "FLEX",
    transmission: "MANUAL",
    color: "",
    price: "R$ 24.990,00",
    options: [],
    bg: "linear-gradient(135deg, #a8a29e, #44403c)",
  },
  {
    make: "WILLYS",
    model: "JEEP",
    year: "1956",
    km: "",
    fuel: "GASOLINA",
    transmission: "MANUAL",
    color: "",
    price: "R$ 30.000,00",
    options: [],
    bg: "linear-gradient(135deg, #365314, #1a2e05)",
  },
];

const whatsappBase =
  "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20tenho%20interesse%20no%20ve%C3%ADculo%3A%20";

const carouselSlides = document.querySelector("#carousel-slides");
const carouselDots = document.querySelector("#carousel-dots");
const carouselPrev = document.querySelector(".carousel-prev");
const carouselNext = document.querySelector(".carousel-next");
const stockList = document.querySelector("#stock-list");
const stockCount = document.querySelector("#stock-count");
const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector("#site-menu");
const form = document.querySelector("#vehicle-search");
const input = document.querySelector("#search-input");

function vehicleCard(vehicle) {
  const options = vehicle.options.length ? vehicle.options : ["Outros opcionais"];
  const text = encodeURIComponent(`${vehicle.make} ${vehicle.model} ${vehicle.year}`);

  return `
    <article class="vehicle-card reveal" data-search="${[
      vehicle.make,
      vehicle.model,
      vehicle.year,
      vehicle.fuel,
      vehicle.transmission,
      vehicle.color,
    ]
      .join(" ")
      .toLowerCase()}">
      <div class="vehicle-media" style="--card-bg:${vehicle.bg}">
        ${vehicle.image ? `<img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}" loading="lazy" />` : ""}
        <span>${vehicle.year}</span>
      </div>
      <div class="vehicle-body">
        <h3>${vehicle.make} ${vehicle.model}</h3>
        <div class="meta-grid">
          <span>▣ ${vehicle.make}</span>
          <span>✓ ${options[0] || "Outros opcionais"}</span>
          <span>${vehicle.fuel}</span>
          <span>✓ ${options[1] || "Outros opcionais"}</span>
          <span>${vehicle.color || vehicle.transmission}</span>
          <span>✓ ${options[2] || "Outros opcionais"}</span>
          <span>${vehicle.year}</span>
          <span>+ ${options[3] || "Outros opcionais"}</span>
        </div>
        <div class="price">${vehicle.price}</div>
        <div class="card-actions">
          <a class="button primary" href="${whatsappBase}${text}" target="_blank" rel="noreferrer">Consultar no WhatsApp</a>
        </div>
      </div>
    </article>
  `;
}

function stockRow(vehicle, index) {
  const imageMarkup = vehicle.image
    ? `<img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}" loading="lazy" />`
    : `<div class="showroom-logo"><span>Henrique</span><small>Veículos</small><i></i></div>`;
  const mileage = vehicle.km ? `${vehicle.km} km` : "Km consulte";

  return `
    <article class="stock-row" data-search="${[
      vehicle.make,
      vehicle.model,
      vehicle.year,
      vehicle.fuel,
      vehicle.transmission,
      vehicle.color,
    ]
      .join(" ")
      .toLowerCase()}">
      <div class="showroom-media">
        ${imageMarkup}
        <span class="year-badge">${vehicle.year}</span>
      </div>
      <div class="stock-copy">
        <span class="stock-brand">${vehicle.make}</span>
        <strong>${vehicle.model}</strong>
      </div>
      <div class="stock-specs" aria-label="Resumo do veículo">
        <span>${vehicle.transmission}</span>
        <span>${vehicle.fuel}</span>
        <span>${mileage}</span>
      </div>
      <span class="price">${vehicle.price}</span>
      <button type="button" class="open-detail" data-vehicle-index="${index}">Ver detalhes →</button>
    </article>
  `;
}

let activeSlide = 0;
let carouselTimer;

function carouselSlide(vehicle, index) {
  const text = encodeURIComponent(`${vehicle.make} ${vehicle.model} ${vehicle.year}`);
  const image = vehicle.image || "";

  return `
    <article class="carousel-slide ${index === activeSlide ? "is-active" : ""}" data-slide="${index}">
      <div class="carousel-copy">
        <span class="title-flame" aria-hidden="true"></span>
        <p>Destaque da Semana</p>
        <h1>${vehicle.make} ${vehicle.model}</h1>
        <div class="carousel-actions">
          <strong>${vehicle.price}</strong>
          <a class="button primary" href="${whatsappBase}${text}" target="_blank" rel="noreferrer">Consultar no WhatsApp</a>
        </div>
        <div class="carousel-meta">
          <span>${vehicle.year}</span>
          <span>${vehicle.transmission}</span>
          <span>${vehicle.fuel}</span>
          <span>${vehicle.color || "Consulte"}</span>
        </div>
      </div>
      <div class="carousel-photo">
        ${image ? `<img src="${image}" alt="${vehicle.make} ${vehicle.model}" />` : `<div class="showroom-logo"><span>Henrique</span><small>Veículos</small><i></i></div>`}
      </div>
    </article>
  `;
}

function setActiveSlide(index) {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  if (!slides.length) {
    return;
  }
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
  });
}

function renderCarousel(list) {
  const highlights = list.slice(0, 3);
  activeSlide = 0;

  if (!highlights.length) {
    carouselSlides.innerHTML = "";
    carouselDots.innerHTML = "";
    return;
  }

  carouselSlides.innerHTML = highlights.map(carouselSlide).join("");
  carouselDots.innerHTML = highlights
    .map((_, index) => `<button class="carousel-dot ${index === activeSlide ? "is-active" : ""}" type="button" aria-label="Ver destaque ${index + 1}" data-dot="${index}"></button>`)
    .join("");

  carouselDots.querySelectorAll(".carousel-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      clearInterval(carouselTimer);
      setActiveSlide(Number(dot.dataset.dot));
      startCarousel();
    });
  });
}

function startCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    setActiveSlide(activeSlide + 1);
  }, 4200);
}

function renderVehicles(list) {
  const showroomPriority = ["HB20 1.0 CONFOR", "ARGO", "HB20S", "PCX"];
  const showroomList = [...list].sort((first, second) => {
    const firstIndex = showroomPriority.findIndex((term) => first.model.includes(term));
    const secondIndex = showroomPriority.findIndex((term) => second.model.includes(term));
    return (firstIndex === -1 ? 99 : firstIndex) - (secondIndex === -1 ? 99 : secondIndex);
  });

  renderCarousel(vehicles.slice(0, 3));
  stockList.innerHTML = showroomList.length
    ? showroomList
        .map((vehicle) => stockRow(vehicle, vehicles.indexOf(vehicle)))
        .join("")
    : '<p class="empty-stock">Nenhum veículo encontrado. Tente buscar por marca, modelo ou ano.</p>';

  if (stockCount) {
    const total = showroomList.length;
    stockCount.innerHTML = total
      ? `<strong>${total}</strong> ${total === 1 ? "veículo disponível" : "veículos disponíveis"}`
      : "Nenhum veículo encontrado";
  }
}

menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

carouselPrev.addEventListener("click", () => {
  clearInterval(carouselTimer);
  setActiveSlide(activeSlide - 1);
  startCarousel();
});

carouselNext.addEventListener("click", () => {
  clearInterval(carouselTimer);
  setActiveSlide(activeSlide + 1);
  startCarousel();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  applySearch(input.value, true);
});

input.addEventListener("input", () => {
  applySearch(input.value);
});

function applySearch(value, shouldScroll = false) {
  const term = value.trim().toLowerCase();
  const filtered = term
    ? vehicles.filter((vehicle) =>
        [vehicle.make, vehicle.model, vehicle.year, vehicle.fuel, vehicle.transmission, vehicle.color]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
    : vehicles;

  renderVehicles(filtered);
  if (term && shouldScroll) {
    document.querySelector("#estoque").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function vehicleModalContent(vehicle) {
  const text = encodeURIComponent(`${vehicle.make} ${vehicle.model} ${vehicle.year}`);
  const imageMarkup = vehicle.image
    ? `<img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}" />`
    : `<div class="showroom-logo"><span>Henrique</span><small>Veículos</small><i></i></div>`;

  const specs = [
    { label: "Marca", value: vehicle.make },
    { label: "Modelo", value: vehicle.model },
    { label: "Ano", value: vehicle.year },
    { label: "Câmbio", value: vehicle.transmission },
    { label: "Combustível", value: vehicle.fuel },
    { label: "Km", value: vehicle.km || "—" },
    { label: "Cor", value: vehicle.color || "—" },
  ];

  const optionsMarkup = vehicle.options.length
    ? `<div class="modal-options">
        <h4>Opcionais</h4>
        <div class="modal-options-list">
          ${vehicle.options.map((opt) => `<span>${opt}</span>`).join("")}
        </div>
      </div>`
    : "";

  return `
    <div class="modal-gallery">
      ${imageMarkup}
      <span class="year-badge">${vehicle.year}</span>
    </div>
    <div class="modal-info">
      <span class="modal-eyebrow">${vehicle.make}</span>
      <h2 id="vehicle-modal-title" class="modal-title">${vehicle.model}</h2>
      <div class="modal-price">${vehicle.price}</div>
      <div class="modal-specs">
        ${specs
          .map(
            (spec) => `
          <div class="modal-spec">
            <span class="modal-spec-label">${spec.label}</span>
            <span class="modal-spec-value">${spec.value}</span>
          </div>`,
          )
          .join("")}
      </div>
      ${optionsMarkup}
      <div class="modal-actions">
        <a class="modal-cta primary" href="${whatsappBase}${text}" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor">
            <path d="M12 4.2a7.6 7.6 0 0 0-6.5 11.5L4.7 20l4.4-1.1A7.6 7.6 0 1 0 12 4.2Zm3.4 9.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.4-.1-.5.1s-.6.7-.7.9c-.1.1-.3.1-.5.1a5 5 0 0 1-1.5-.9 5.5 5.5 0 0 1-1-1.3c-.1-.2 0-.3.1-.5l.4-.4c.1-.1.1-.2.2-.4v-.4c-.1-.1-.5-1.1-.7-1.5-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.4.5.2 1 .1 1.4.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1l-.4-.3Z"/>
          </svg>
          Solicitar proposta
        </a>
        <a class="modal-cta secondary" href="${whatsappBase}${text}%20-%20Quero%20simular%20financiamento" target="_blank" rel="noreferrer">Simular financiamento</a>
      </div>
    </div>
  `;
}

const vehicleModal = document.querySelector("#vehicle-modal");
const vehicleModalBody = document.querySelector("#vehicle-modal-body");

function openVehicleModal(index) {
  const vehicle = vehicles[index];
  if (!vehicle || !vehicleModal) return;
  vehicleModalBody.innerHTML = vehicleModalContent(vehicle);
  vehicleModal.classList.add("is-open");
  vehicleModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeVehicleModal() {
  if (!vehicleModal) return;
  vehicleModal.classList.remove("is-open");
  vehicleModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (vehicleModal) {
  vehicleModal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close]")) closeVehicleModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && vehicleModal.classList.contains("is-open")) {
      closeVehicleModal();
    }
  });
}

if (stockList) {
  stockList.addEventListener("click", (event) => {
    const trigger = event.target.closest(".open-detail");
    if (!trigger) return;
    event.preventDefault();
    openVehicleModal(Number(trigger.dataset.vehicleIndex));
  });
}

renderVehicles(vehicles);
startCarousel();
