"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const saleSchema = z.object({
  make: z.string().trim().min(1, "Marca obrigatória").max(60).transform((v) => v.toUpperCase()),
  model: z.string().trim().min(1, "Modelo obrigatório").max(120).transform((v) => v.toUpperCase()),
  year: z.coerce.number().int().min(1900).max(2100),
  client_name: z.string().trim().min(1, "Cliente obrigatório").max(120),
  sale_price: z.coerce.number().min(0),
  cost_price: z.coerce.number().min(0).default(0),
  commission: z.coerce.number().min(0).default(0),
  payment_method: z.enum(["a_vista", "financiado", "consorcio", "troca"]).default("a_vista"),
  sale_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .transform((v) => v ?? new Date().toISOString().split("T")[0]),
  notes: z.string().trim().max(500).optional().transform((v) => v || null),
  vehicle_id: z.preprocess((v) => v === "" ? null : v, z.string().uuid().nullable().optional()),
  lead_id: z.preprocess((v) => v === "" ? null : v, z.string().uuid().nullable().optional()),
});

function fail(msg: string): never {
  redirect(`/admin/vendas?error=${encodeURIComponent(msg)}`);
}

function parsePayload(formData: FormData) {
  const parsed = saleSchema.safeParse({
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    client_name: formData.get("client_name"),
    sale_price: formData.get("sale_price"),
    cost_price: formData.get("cost_price"),
    commission: formData.get("commission"),
    payment_method: formData.get("payment_method"),
    sale_date: formData.get("sale_date"),
    notes: formData.get("notes"),
    vehicle_id: formData.get("vehicle_id"),
    lead_id: formData.get("lead_id"),
  });
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  return parsed.data;
}

function revalidate() {
  revalidatePath("/admin/vendas");
  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
}

export async function createSaleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const data = parsePayload(formData);

  const { error } = await supabase.from("sales").insert(data);
  if (error) fail(error.message);

  // Marca veículo como vendido
  if (data.vehicle_id) {
    await supabase.from("vehicles").update({ is_available: false }).eq("id", data.vehicle_id);
    revalidatePath("/admin/veiculos");
  }

  // Fecha o lead vinculado
  if (data.lead_id) {
    await supabase.from("leads").update({ status: "fechado" }).eq("id", data.lead_id);
    revalidatePath("/admin/crm");
  }

  revalidate();
  redirect("/admin/vendas?success=created");
}

export async function updateSaleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID da venda ausente.");

  // Recupera vehicle_id anterior antes de atualizar
  const { data: old } = await supabase.from("sales").select("vehicle_id").eq("id", id).maybeSingle();

  const data = parsePayload(formData);
  const { error } = await supabase.from("sales").update(data).eq("id", id);
  if (error) fail(error.message);

  // Se trocou de veículo, reativa o anterior
  if (old?.vehicle_id && old.vehicle_id !== data.vehicle_id) {
    await supabase.from("vehicles").update({ is_available: true }).eq("id", old.vehicle_id);
  }
  // Marca o novo veículo como vendido
  if (data.vehicle_id) {
    await supabase.from("vehicles").update({ is_available: false }).eq("id", data.vehicle_id);
    revalidatePath("/admin/veiculos");
  }

  revalidate();
  redirect("/admin/vendas?success=updated");
}

export async function deleteSaleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID da venda ausente.");

  // Recupera vehicle_id antes de deletar
  const { data: sale } = await supabase.from("sales").select("vehicle_id").eq("id", id).maybeSingle();

  const { error } = await supabase.from("sales").delete().eq("id", id);
  if (error) fail(error.message);

  // Reativa o veículo
  if (sale?.vehicle_id) {
    await supabase.from("vehicles").update({ is_available: true }).eq("id", sale.vehicle_id);
    revalidatePath("/admin/veiculos");
  }

  revalidate();
  redirect("/admin/vendas?success=deleted");
}
