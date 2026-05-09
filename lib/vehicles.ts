import { fallbackVehicles } from "@/data/vehicles";
import { createStaticClient } from "@/lib/supabase/static";
import type { Vehicle } from "@/lib/vehicle-shared";
import type { VehicleImageRow, VehicleRow } from "@/lib/database.types";

export type VehicleWithImages = VehicleRow & { vehicle_images: VehicleImageRow[] };

const VEHICLE_SELECT =
  "id,make,model,year,km,fuel,transmission,color,price,options,image_url,image_path,bg,is_available,is_featured,sort_order";

export async function getVehicles(): Promise<Vehicle[]> {
  const supabase = createStaticClient();
  if (!supabase) return fallbackVehicles;

  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_SELECT)
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data?.length) return fallbackVehicles;
  return data;
}

export async function getVehicleById(id: string): Promise<VehicleWithImages | null> {
  const supabase = createStaticClient();
  if (!supabase) return null;

  const [vehicleRes, imagesRes] = await Promise.all([
    supabase.from("vehicles").select("*").eq("id", id).eq("is_available", true).maybeSingle(),
    supabase
      .from("vehicle_images")
      .select("id,vehicle_id,url,path,sort_order,created_at")
      .eq("vehicle_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (!vehicleRes.data) return null;

  return {
    ...vehicleRes.data,
    vehicle_images: imagesRes.data ?? [],
  };
}

export type { Vehicle } from "@/lib/vehicle-shared";
