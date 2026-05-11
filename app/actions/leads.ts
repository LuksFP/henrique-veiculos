"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(120),
  phone: z.string().trim().min(1, "Telefone obrigatório").max(30),
  email: z
    .string().trim().max(120)
    .optional()
    .transform((v) => (v?.includes("@") ? v : null)),
  vehicle_label: z.string().trim().max(160).optional().transform((v) => v || null),
  status: z.enum(["novo", "contato", "em_negociacao", "proposta", "fechado", "perdido"]).default("novo"),
  source: z.enum(["whatsapp", "site", "indicacao", "instagram", "outro", "avaliacao", "consignacao", "financiamento"]).default("outro"),
  notes: z.string().trim().max(1000).optional().transform((v) => v || null),
});

function fail(msg: string): never {
  redirect(`/admin/crm?error=${encodeURIComponent(msg)}`);
}

function parsePayload(formData: FormData) {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    vehicle_label: formData.get("vehicle_label"),
    status: formData.get("status"),
    source: formData.get("source"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  return parsed.data;
}

export async function createLeadAction(formData: FormData) {
  const supabase = await requireAdmin();
  const data = parsePayload(formData);
  const { error } = await supabase.from("leads").insert(data);
  if (error) fail(error.message);
  revalidatePath("/admin/crm");
  revalidatePath("/admin");
  redirect("/admin/crm?success=created");
}

export async function updateLeadAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID do lead ausente.");
  const data = parsePayload(formData);
  const { error } = await supabase.from("leads").update(data).eq("id", id);
  if (error) fail(error.message);
  revalidatePath("/admin/crm");
  revalidatePath("/admin");
  redirect("/admin/crm?success=updated");
}

export async function updateLeadStatusAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as "novo" | "contato" | "em_negociacao" | "proposta" | "fechado" | "perdido";
  if (!id || !status) fail("Dados ausentes.");
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) fail(error.message);
  revalidatePath("/admin/crm");
  revalidatePath("/admin");
  redirect("/admin/crm");
}

export async function deleteLeadAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID do lead ausente.");
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) fail(error.message);
  revalidatePath("/admin/crm");
  revalidatePath("/admin");
  redirect("/admin/crm?success=deleted");
}
