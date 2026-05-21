import { XMLParser } from "fast-xml-parser";
import type { Vehicle } from "@/lib/vehicle-shared";

const XML_URL =
  "http://app.revendamais.com.br/application/index.php/apiGeneratorXml/generator/sitedaloja/5e683f76d9dc70ce206baf0bb01cdc3c5626.xml";

const parser = new XMLParser({
  isArray: (name) => name === "AD" || name === "IMAGE",
  ignoreAttributes: false,
});

function formatPrice(raw: string | number): string {
  const num = typeof raw === "number" ? raw : parseFloat(String(raw));
  if (isNaN(num)) return String(raw);
  return `R$ ${num.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function parseImages(images: unknown): string[] {
  if (!images) return [];
  if (typeof images === "string") {
    return images.split(",").map((u) => u.trim()).filter(Boolean);
  }
  if (typeof images === "object" && images !== null) {
    const obj = images as Record<string, unknown>;
    if ("IMAGE" in obj) {
      const imgs = obj.IMAGE;
      return Array.isArray(imgs) ? (imgs as string[]) : [String(imgs)];
    }
  }
  return [];
}

function cap(str: string) {
  return str.toUpperCase();
}

type RawAd = {
  ID: string | number;
  MAKE?: string;
  MODEL?: string;
  YEAR?: string | number;
  MILEAGE?: string | number;
  FUEL?: string;
  GEAR?: string;
  COLOR?: string;
  PRICE?: string | number;
  ACCESSORIES?: string;
  IMAGES?: unknown;
  DESTAQUE?: string | number;
};

let cache: { vehicles: Vehicle[]; at: number } | null = null;
const TTL = 5 * 60 * 1000; // 5 minutes

export async function getVehicles(): Promise<Vehicle[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.vehicles;

  try {
    const res = await fetch(XML_URL, { cache: "no-store" });
    const xml = await res.text();
    const data = parser.parse(xml);
    const ads: RawAd[] = data?.ADS?.AD ?? [];

    const vehicles: Vehicle[] = ads.map((ad) => ({
      id: String(ad.ID),
      make: cap(String(ad.MAKE ?? "")),
      model: cap(String(ad.MODEL ?? "")),
      year: Number(ad.YEAR),
      km: ad.MILEAGE ? Number(ad.MILEAGE).toLocaleString("pt-BR") : null,
      fuel: ad.FUEL ? cap(String(ad.FUEL)) : null,
      transmission: ad.GEAR ? cap(String(ad.GEAR)) : null,
      color: ad.COLOR ? cap(String(ad.COLOR)) : null,
      price: formatPrice(ad.PRICE ?? ""),
      options: ad.ACCESSORIES
        ? String(ad.ACCESSORIES).split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)
        : [],
      images: parseImages(ad.IMAGES),
      is_featured: String(ad.DESTAQUE).toLowerCase() === "sim" || String(ad.DESTAQUE) === "1",
    }));

    cache = { vehicles, at: Date.now() };
    return vehicles;
  } catch {
    return cache?.vehicles ?? [];
  }
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const vehicles = await getVehicles();
  return vehicles.find((v) => v.id === id) ?? null;
}

export type { Vehicle } from "@/lib/vehicle-shared";
