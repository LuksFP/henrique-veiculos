import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { WhatsappIcon } from "@/components/social-icons";
import { ShowroomLogo } from "@/components/showroom-logo";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { getVehicleById } from "@/lib/vehicles";
import { vehicleImage } from "@/lib/vehicle-shared";

const BASE_URL = "https://www.henriqueveiculos.com.br";
const WHATSAPP_BASE =
  "https://wa.me/5513974066867?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20tenho%20interesse%20no%20ve%C3%ADculo%3A%20";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    return { title: "Veículo não encontrado | Henrique Veículos" };
  }

  const title = `${vehicle.make} ${vehicle.model} ${vehicle.year} | Henrique Veículos`;
  const description = [
    vehicle.price,
    vehicle.km ? `${vehicle.km} km` : null,
    vehicle.fuel,
    vehicle.transmission,
    "Guarujá/SP",
  ]
    .filter(Boolean)
    .join(" · ");

  const image = vehicleImage(vehicle);

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${BASE_URL}/veiculo/${id}`,
      siteName: "Henrique Veículos",
      title,
      description,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) notFound();

  const coverUrl = vehicleImage(vehicle);
  const galleryImages = [
    ...(coverUrl ? [{ id: "cover", url: coverUrl }] : []),
    ...(vehicle.vehicle_images ?? []),
  ];

  const whatsappUrl = `${WHATSAPP_BASE}${encodeURIComponent(`${vehicle.make} ${vehicle.model} ${vehicle.year}`)}`;
  const financingUrl = `${whatsappUrl}%20-%20Quero%20simular%20financiamento`;

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
    <>
      <header className="vp-header">
        <div className="vp-header-inner">
          <a href="/" aria-label="Henrique Veículos — página inicial">
            <BrandLogo />
          </a>
          <a className="vp-back" href="/#estoque">
            ← Voltar ao estoque
          </a>
        </div>
      </header>

      <main className="vp-main">
        <article className="vp-card">
          <div className="vp-gallery">
            {galleryImages.length > 0 ? (
              <VehicleGallery
                images={galleryImages}
                alt={`${vehicle.make} ${vehicle.model}`}
                year={vehicle.year}
              />
            ) : (
              <div className="vp-gallery-wrap">
                <div className="vp-gallery-main">
                  <ShowroomLogo />
                  <span className="year-badge">{vehicle.year}</span>
                </div>
              </div>
            )}
          </div>

          <div className="modal-info">
            <span className="modal-eyebrow">{vehicle.make}</span>
            <h1 className="modal-title">{vehicle.model}</h1>
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
              <a className="modal-cta primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                <WhatsappIcon />
                Solicitar proposta
              </a>
              <a className="modal-cta secondary" href={financingUrl} target="_blank" rel="noreferrer">
                Simular financiamento
              </a>
            </div>
          </div>
        </article>
      </main>

      <footer className="vp-footer">
        <div>© 2026 Henrique Veículos — Guarujá / SP</div>
        <a href="/#estoque">Ver estoque completo →</a>
      </footer>
    </>
  );
}
