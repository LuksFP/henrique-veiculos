"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = ["image/png", "image/jpeg", "image/webp", "image/avif"];

const vehicleSchema = z.object({
  make: z.string().trim().min(1, "Marca obrigatória").max(60).transform((v) => v.toUpperCase()),
  model: z.string().trim().min(1, "Modelo obrigatório").max(120).transform((v) => v.toUpperCase()),
  year: z.coerce.number().int().min(1900).max(2100),
  km: z.string().trim().max(20).optional().transform((v) => v?.length ? v : null),
  fuel: z.string().trim().min(1, "Combustível obrigatório").max(40).transform((v) => v.toUpperCase()),
  transmission: z.string().trim().min(1, "Câmbio obrigatório").max(40).transform((v) => v.toUpperCase()),
  color: z.string().trim().max(40).optional().transform((v) => v?.length ? v.toUpperCase() : null),
  price: z.string().trim().min(1, "Preço obrigatório").max(40),
  options: z.string().optional().transform((v) =>
    String(v ?? "").split(",").map((o) => o.trim()).filter(Boolean),
  ),
  bg: z.string().trim().max(200).optional().transform((v) => v?.length ? v : null),
  sort_order: z.coerce.number().int().min(0).max(9999).default(99),
  is_featured: z.preprocess((v) => v === "on" || v === true, z.boolean()),
  is_available: z.preprocess((v) => v === "on" || v === true, z.boolean()),
});

function fail(msg: string): never {
  redirect(`/admin/veiculos?error=${encodeURIComponent(msg)}`);
}

function parsePayload(formData: FormData) {
  const parsed = vehicleSchema.safeParse({
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
  });
  if (!parsed.success) fail(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  return parsed.data;
}

async function uploadImage(supabase: Awaited<ReturnType<typeof requireAdmin>>, file: File) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_IMAGE_BYTES) fail(`Imagem maior que ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`);
  if (!ALLOWED_IMAGE_MIME.includes(file.type)) fail(`Formato inválido: ${file.type}.`);

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${crypto.randomUUID()}.${ext || "png"}`;
  const { error } = await supabase.storage.from("vehicles").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) fail(`Falha ao subir imagem: ${error.message}`);
  const { data: { publicUrl } } = supabase.storage.from("vehicles").getPublicUrl(path);
  return { url: publicUrl, path };
}

async function removeStorageFile(supabase: Awaited<ReturnType<typeof requireAdmin>>, path: string | null) {
  if (!path || path.startsWith("/")) return;
  await supabase.storage.from("vehicles").remove([path]);
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/veiculos");
}

export async function createVehicleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const data = parsePayload(formData);
  const coverFile = formData.get("image") as File | null;
  const cover = coverFile ? await uploadImage(supabase, coverFile) : null;

  const { error } = await supabase.from("vehicles").insert({
    ...data,
    image_url: cover?.url ?? null,
    image_path: cover?.path ?? null,
  });
  if (error) {
    if (cover) await removeStorageFile(supabase, cover.path);
    fail(error.message);
  }
  revalidate();
  redirect("/admin/veiculos?success=created");
}

export async function updateVehicleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID do veículo ausente.");

  const data = parsePayload(formData);
  const currentPath = String(formData.get("current_image_path") ?? "").trim() || null;
  const coverFile = formData.get("image") as File | null;
  const cover = coverFile ? await uploadImage(supabase, coverFile) : null;

  const { error } = await supabase
    .from("vehicles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
      ...(cover ? { image_url: cover.url, image_path: cover.path } : {}),
    })
    .eq("id", id);

  if (error) {
    if (cover) await removeStorageFile(supabase, cover.path);
    fail(error.message);
  }
  if (cover && currentPath) await removeStorageFile(supabase, currentPath);

  revalidate();
  redirect("/admin/veiculos?success=updated");
}

export async function deleteVehicleAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) fail("ID do veículo ausente.");

  const [vehicleRes, galleryRes] = await Promise.all([
    supabase.from("vehicles").select("image_path").eq("id", id).maybeSingle(),
    supabase.from("vehicle_images").select("path").eq("vehicle_id", id),
  ]);

  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) fail(error.message);

  const paths = [
    vehicleRes.data?.image_path,
    ...(galleryRes.data ?? []).map((img) => img.path),
  ].filter((p): p is string => !!p && !p.startsWith("/"));

  if (paths.length > 0) {
    await supabase.storage.from("vehicles").remove(paths);
  }

  revalidate();
  redirect("/admin/veiculos?success=deleted");
}

export async function addVehicleImagesAction(formData: FormData) {
  const supabase = await requireAdmin();
  const vehicleId = String(formData.get("vehicle_id") ?? "").trim();
  if (!vehicleId) fail("ID do veículo ausente.");

  const files = formData.getAll("images") as File[];
  const uploaded: { url: string; path: string }[] = [];

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    const result = await uploadImage(supabase, file);
    if (result) uploaded.push(result);
  }

  if (uploaded.length > 0) {
    const { error } = await supabase.from("vehicle_images").insert(
      uploaded.map((img, i) => ({
        vehicle_id: vehicleId,
        url: img.url,
        path: img.path,
        sort_order: i,
      })),
    );
    if (error) {
      await supabase.storage.from("vehicles").remove(uploaded.map((u) => u.path));
      fail(error.message);
    }
  }

  revalidate();
  revalidatePath(`/veiculo/${vehicleId}`);
  redirect("/admin/veiculos?success=updated");
}

export async function deleteVehicleImageAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const path = String(formData.get("path") ?? "").trim();
  const vehicleId = String(formData.get("vehicle_id") ?? "").trim();
  if (!id) fail("ID da imagem ausente.");

  const { error } = await supabase.from("vehicle_images").delete().eq("id", id);
  if (error) fail(error.message);

  await removeStorageFile(supabase, path || null);

  revalidate();
  if (vehicleId) revalidatePath(`/veiculo/${vehicleId}`);
  redirect("/admin/veiculos?success=updated");
}
