"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { getSupabaseEnv } from "@/lib/env";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(30),
  email: z.string().trim().max(120).optional().transform((v) => (v?.includes("@") ? v : null)),
  vehicle_label: z.string().trim().max(160).optional().transform((v) => v || null),
  source: z.enum(["whatsapp", "site", "indicacao", "instagram", "outro", "avaliacao", "consignacao", "financiamento"]).default("site"),
  notes: z.string().trim().max(2000).optional().transform((v) => v || null),
});

export async function submitPublicLeadAction(formData: FormData) {
  const vehicleParts = [
    formData.get("vehicle_marca"),
    formData.get("vehicle_modelo"),
    formData.get("vehicle_ano"),
    formData.get("vehicle_km") ? `${formData.get("vehicle_km")}km` : null,
    formData.get("vehicle_combustivel"),
    formData.get("vehicle_cambio"),
    formData.get("vehicle_cor"),
  ].filter((v): v is string => typeof v === "string" && v.trim().length > 0);

  const vehicleLabel =
    formData.get("vehicle_label")?.toString().trim() ||
    (vehicleParts.length > 0 ? vehicleParts.join(" ") : undefined);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    vehicle_label: vehicleLabel,
    source: formData.get("source") ?? "site",
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    redirect(`${formData.get("_origin") ?? "/"}?error=${encodeURIComponent(msg)}`);
  }

  const env = getSupabaseEnv();
  if (!env) redirect(`${formData.get("_origin") ?? "/"}?error=${encodeURIComponent("Serviço indisponível.")}`);
  const supabase = createSupabaseClient<Database>(env.url, env.anonKey);

  const { error } = await supabase.from("leads").insert({ ...parsed.data, status: "novo" });

  if (error) redirect(`${formData.get("_origin") ?? "/"}?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/crm");
  redirect(`${formData.get("_origin") ?? "/"}?success=1`);
}
