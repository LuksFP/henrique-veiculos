export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  km: string | null;
  fuel: string | null;
  transmission: string | null;
  color: string | null;
  price: string;
  options: string[];
  images: string[];
  is_featured: boolean;
};

export function vehicleImage(vehicle: Pick<Vehicle, "images">) {
  return vehicle.images[0] ?? null;
}

export function vehicleSearchText(vehicle: Vehicle) {
  return [vehicle.make, vehicle.model, vehicle.year, vehicle.fuel, vehicle.transmission, vehicle.color]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
