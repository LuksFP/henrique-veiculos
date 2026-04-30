import type { VehicleRow } from "@/lib/database.types";

export type Vehicle = Pick<
  VehicleRow,
  | "id"
  | "make"
  | "model"
  | "year"
  | "km"
  | "fuel"
  | "transmission"
  | "color"
  | "price"
  | "options"
  | "image_url"
  | "image_path"
  | "bg"
  | "is_available"
  | "is_featured"
  | "sort_order"
>;

export function vehicleImage(vehicle: Pick<Vehicle, "image_url" | "image_path">) {
  if (vehicle.image_url) {
    return vehicle.image_url;
  }

  if (vehicle.image_path) {
    return vehicle.image_path.startsWith("/") ? vehicle.image_path : `/assets/vehicles/${vehicle.image_path}`;
  }

  return null;
}

export function vehicleSearchText(vehicle: Vehicle) {
  return [vehicle.make, vehicle.model, vehicle.year, vehicle.fuel, vehicle.transmission, vehicle.color]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
