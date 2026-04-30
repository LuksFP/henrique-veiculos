import { fallbackVehicles } from "@/data/vehicles";
import { createClient } from "@/lib/supabase/server";
import type { Vehicle } from "@/lib/vehicle-shared";

export async function getVehicles(): Promise<Vehicle[]> {
  const supabase = await createClient();

  if (!supabase) {
    return fallbackVehicles;
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select(
      "id,make,model,year,km,fuel,transmission,color,price,options,image_url,image_path,bg,is_available,is_featured,sort_order",
    )
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return fallbackVehicles;
  }

  return data;
}
export type { Vehicle } from "@/lib/vehicle-shared";
