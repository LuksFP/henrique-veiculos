"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const expenseSchema = z.object({
  description: z.string().trim().min(1, "Descrição obrigatória").max(120),
  amount: z.coerce.number().min(0.01, "Valor deve ser positivo"),
  category: z.enum(["aluguel", "folha", "manutencao", "marketing", "outros"]).default("outros"),
  expense_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .transform((v) => v ?? new Date().toISOString().split("T")[0]),
  notes: z.string().trim().max(500).optional().transform((v) => v || null),
});

function fail(msg: string): never {
  redirect(`/admin/financeiro?error=${encodeURIComponent(msg)}`);
}

function revalidate() {
  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
}

export async function createExpenseAction(formData: FormData) {
  const supabase = await requireAdmin();

  const parsed = expenseSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    expense_date: formData.get("expense_date"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Dados inválidos.");

  const { error } = await supabase.from("expenses").insert(parsed.data);
  if (error) fail(error.message);

  revalidate();
  redirect("/admin/financeiro?success=expense_created");
}

export async function deleteExpenseAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID da despesa ausente.");

  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) fail(error.message);

  revalidate();
  redirect("/admin/financeiro?success=expense_deleted");
}
