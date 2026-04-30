"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type DBClient = SupabaseClient<Database>;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = ["image/png", "image/jpeg", "image/webp", "image/avif"];

const vehicleSchema = z.object({
  make: z.string().trim().min(1, "Marca obrigatória").max(60).transform((v) => v.toUpperCase()),
  model: z.string().trim().min(1, "Modelo obrigatório").max(120).transform((v) => v.toUpperCase()),
  year: z.coerce.number().int().min(1900).max(2100),
  km: z.string().trim().max(20).optional().transform((v) => (v && v.length ? v : null)),
  fuel: z.string().trim().min(1, "Combustível obrigatório").max(40).transform((v) => v.toUpperCase()),
  transmission: z.string().trim().min(1, "Câmbio obrigatório").max(40).transform((v) => v.toUpperCase()),
  color: z.string().trim().max(40).optional().transform((v) => (v && v.length ? v.toUpperCase() : null)),
  price: z.string().trim().min(1, "Preço obrigatório").max(40),
  options: z.string().optional().transform((v) =>
    String(v ?? "")
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean),
  ),
  bg: z.string().trim().max(200).optional().transform((v) => (v && v.length ? v : null)),
  sort_order: z.coerce.number().int().min(0).max(9999).default(99),
  is_featured: z.preprocess((v) => v === "on" || v === true, z.boolean()),
  is_available: z.preprocess((v) => v === "on" || v === true, z.boolean()),
});

async function requireAdmin(): Promise<DBClient> {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=missing-env");

  const {
    data: { user },
  } = await supabase.auth.getUser();
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

function failAdmin(message: string): never {
  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

async function uploadVehicleImage(supabase: DBClient, formData: FormData) {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { image_url: null as string | null, image_path: null as string | null };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    failAdmin(`Imagem maior que ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB.`);
  }
  if (!ALLOWED_IMAGE_MIME.includes(file.type)) {
    failAdmin(`Formato não suportado (${file.type}). Use PNG, JPEG, WebP ou AVIF.`);
  }

  const extension = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${crypto.randomUUID()}.${extension || "png"}`;
  const { error } = await supabase.storage.from("vehicles").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) failAdmin(`Falha ao subir imagem: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from("vehicles").getPublicUrl(path);
  return { image_url: publicUrl, image_path: path };
}

async function removeStorageObject(supabase: DBClient, path: string | null) {
  if (!path || path.startsWith("/")) return;
  await supabase.storage.from("vehicles").remove([path]);
}

function parsePayload(formData: FormData) {
  const raw = {
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    km: formData.get("km"),
    fuel: formData.get("fuel"),
    transmission: formData.get("transmission"),
    color: formData.get("color"),
    price: formData.get("price"),
    options: formData.get("options"),
    bg: formData.get("bg"),
    sort_order: formData.get("sort_order") || 99,
    is_featured: formData.get("is_featured"),
    is_available: formData.get("is_available"),
  };
  const parsed = vehicleSchema.safeParse(raw);
  if (!parsed.success) {
    failAdmin(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }
  return parsed.data;
}

export async function createVehicleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const data = parsePayload(formData);
  const upload = await uploadVehicleImage(supabase, formData);

  const { error } = await supabase.from("vehicles").insert({ ...data, ...upload });
  if (error) {
    await removeStorageObject(supabase, upload.image_path);
    failAdmin(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?success=created");
}

export async function updateVehicleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) failAdmin("ID do veículo ausente.");

  const data = parsePayload(formData);
  const currentImagePath = String(formData.get("current_image_path") ?? "").trim() || null;
  const upload = await uploadVehicleImage(supabase, formData);
  const replacingImage = upload.image_path !== null;

  const payload = {
    ...data,
    updated_at: new Date().toISOString(),
    ...(replacingImage ? upload : {}),
  };

  const { error } = await supabase.from("vehicles").update(payload).eq("id", id);
  if (error) {
    if (replacingImage) await removeStorageObject(supabase, upload.image_path);
    failAdmin(error.message);
  }

  if (replacingImage && currentImagePath && currentImagePath !== upload.image_path) {
    await removeStorageObject(supabase, currentImagePath);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?success=updated");
}

export async function deleteVehicleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) failAdmin("ID do veículo ausente.");

  const { data: vehicle, error: fetchError } = await supabase
    .from("vehicles")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) failAdmin(fetchError.message);

  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) failAdmin(error.message);

  await removeStorageObject(supabase, vehicle?.image_path ?? null);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?success=deleted");
}
