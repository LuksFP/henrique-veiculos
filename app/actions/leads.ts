"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type DBClient = SupabaseClient<Database>;

const leadSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(120),
  phone: z.string().trim().min(1, "Telefone obrigatório").max(30),
  email: z.string().trim().email("E-mail inválido").max(120).optional().or(z.literal("")),
  vehicle_id: z.string().uuid().optional().or(z.literal("")),
  vehicle_label: z.string().trim().max(200).optional(),
  status: z.enum(["novo", "contato", "em_negociacao", "proposta", "fechado", "perdido"]).default("novo"),
  source: z.enum(["whatsapp", "site", "indicacao", "instagram", "outro"]).default("whatsapp"),
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
  redirect(`/admin/crm?error=${encodeURIComponent(message)}`);
}

function parseLead(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    vehicle_id: formData.get("vehicle_id") || undefined,
    vehicle_label: formData.get("vehicle_label") || undefined,
    status: formData.get("status") || "novo",
    source: formData.get("source") || "whatsapp",
    notes: formData.get("notes") || undefined,
  };
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  return {
    ...parsed.data,
    email: parsed.data.email || null,
    vehicle_id: parsed.data.vehicle_id || null,
    vehicle_label: parsed.data.vehicle_label || null,
  };
}

export async function createLeadAction(formData: FormData) {
  const supabase = await requireAdmin();
  const data = parseLead(formData);

  const { error } = await supabase.from("leads").insert(data);
  if (error) fail(error.message);

  revalidatePath("/admin/crm");
  redirect("/admin/crm?success=created");
}

export async function updateLeadAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID do lead ausente.");

  const data = parseLead(formData);
  const { error } = await supabase
    .from("leads")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) fail(error.message);

  revalidatePath("/admin/crm");
  redirect("/admin/crm?success=updated");
}

export async function updateLeadStatusAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  if (!id || !status) fail("Dados incompletos.");

  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) fail(error.message);

  revalidatePath("/admin/crm");
  redirect("/admin/crm?success=status");
}

export async function deleteLeadAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID do lead ausente.");

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) fail(error.message);

  revalidatePath("/admin/crm");
  redirect("/admin/crm?success=deleted");
}
