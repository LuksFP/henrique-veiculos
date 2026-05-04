"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type DBClient = SupabaseClient<Database>;

const saleSchema = z.object({
  vehicle_id: z.string().uuid().optional().or(z.literal("")),
  make: z.string().trim().min(1, "Marca obrigatória").max(60).transform((v) => v.toUpperCase()),
  model: z.string().trim().min(1, "Modelo obrigatório").max(120).transform((v) => v.toUpperCase()),
  year: z.coerce.number().int().min(1900).max(2100),
  lead_id: z.string().uuid().optional().or(z.literal("")),
  sale_price: z.coerce.number().positive("Preço inválido"),
  payment_method: z.enum(["a_vista", "financiado", "consorcio", "troca"]).default("a_vista"),
  sale_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  notes: z.string().trim().max(2000).optional().transform((v) => v || null),
});

async function requireAdmin(): Promise<DBClient> {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=missing-env");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("is_admin")
    .eq("user_id", user.id)
    .eq("is_admin", true)
    .maybeSingle();

  if (!admin?.is_admin) redirect("/login?error=not-admin");
  return supabase;
}

function fail(message: string): never {
  redirect(`/admin/financeiro?error=${encodeURIComponent(message)}`);
}

export async function createSaleAction(formData: FormData) {
  const supabase = await requireAdmin();

  const raw = {
    vehicle_id: formData.get("vehicle_id") || undefined,
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    lead_id: formData.get("lead_id") || undefined,
    sale_price: formData.get("sale_price"),
    payment_method: formData.get("payment_method") || "a_vista",
    sale_date: formData.get("sale_date") || new Date().toISOString().slice(0, 10),
    notes: formData.get("notes") || undefined,
  };

  const parsed = saleSchema.safeParse(raw);
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Dados inválidos.");

  const data = {
    ...parsed.data,
    vehicle_id: parsed.data.vehicle_id || null,
    lead_id: parsed.data.lead_id || null,
  };

  const { error } = await supabase.from("sales").insert(data);
  if (error) fail(error.message);

  // Mark vehicle as sold (unavailable) when a sale is registered
  if (data.vehicle_id) {
    await supabase.from("vehicles").update({ is_available: false }).eq("id", data.vehicle_id);
    revalidatePath("/");
  }

  revalidatePath("/admin/financeiro");
  redirect("/admin/financeiro?success=created");
}

export async function deleteSaleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID da venda ausente.");

  const { error } = await supabase.from("sales").delete().eq("id", id);
  if (error) fail(error.message);

  revalidatePath("/admin/financeiro");
  redirect("/admin/financeiro?success=deleted");
}
