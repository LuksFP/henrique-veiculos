import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: vehicles, error } = await supabase
  .from("vehicles")
  .select("id,image_path")
  .like("image_path", "/assets/vehicles/%");

if (error) {
  console.error(error.message);
  process.exit(1);
}

for (const vehicle of vehicles ?? []) {
  if (!vehicle.image_path) continue;

  const filename = basename(vehicle.image_path);
  const source = join(process.cwd(), "public", "assets", "vehicles", filename);
  const buffer = await readFile(source);
  const storagePath = filename;

  const { error: uploadError } = await supabase.storage.from("vehicles").upload(storagePath, buffer, {
    cacheControl: "31536000",
    contentType: "image/png",
    upsert: true,
  });

  if (uploadError) {
    console.error(`${filename}: ${uploadError.message}`);
    process.exitCode = 1;
    continue;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("vehicles").getPublicUrl(storagePath);

  const { error: updateError } = await supabase
    .from("vehicles")
    .update({ image_path: storagePath, image_url: publicUrl })
    .eq("id", vehicle.id);

  if (updateError) {
    console.error(`${filename}: ${updateError.message}`);
    process.exitCode = 1;
    continue;
  }

  console.log(`Uploaded ${filename}`);
}
