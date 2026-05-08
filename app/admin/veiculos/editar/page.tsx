import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateVehicleAction } from "@/app/actions/vehicles";
import { SubmitButton } from "@/components/admin/SubmitButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

const inputClass = {
  width: "100%",
  borderRadius: "0.5rem",
  border: "1px solid var(--input)",
  background: "var(--input)",
  color: "var(--foreground)",
  padding: "0.625rem 0.75rem",
  fontSize: "0.875rem",
  outline: "none",
} as const;

export default async function EditarVeiculo({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) redirect("/admin/veiculos");

  const supabase = await createClient();
  const { data: v } = await supabase!.from("vehicles").select("*").eq("id", id).single();
  if (!v) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Link
          href="/admin/veiculos"
          className="text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          ← Veículos
        </Link>
      </div>
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
      >
        Editar Veículo
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
        {v.make} {v.model} {v.year}
      </p>

      <form
        action={updateVehicleAction}
        encType="multipart/form-data"
        className="mt-6 grid gap-4 rounded-xl p-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ border: "1px solid var(--border)", background: "var(--card)" }}
      >
        <input type="hidden" name="id" value={v.id} />
        <input type="hidden" name="current_image_path" value={v.image_path ?? ""} />

        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Marca *</label>
          <input required name="make" defaultValue={v.make} style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Modelo *</label>
          <input required name="model" defaultValue={v.model} style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Ano *</label>
          <input required name="year" type="number" defaultValue={v.year} style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Preço *</label>
          <input required name="price" defaultValue={v.price} style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Km</label>
          <input name="km" defaultValue={v.km ?? ""} style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Combustível *</label>
          <select name="fuel" required defaultValue={v.fuel} style={inputClass}>
            <option>Flex</option>
            <option>Gasolina</option>
            <option>Diesel</option>
            <option>Híbrido</option>
            <option>Elétrico</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Câmbio *</label>
          <select name="transmission" required defaultValue={v.transmission} style={inputClass}>
            <option>Automático</option>
            <option>Manual</option>
            <option>CVT</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Cor</label>
          <input name="color" defaultValue={v.color ?? ""} style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Ordem (sort)</label>
          <input name="sort_order" type="number" defaultValue={v.sort_order} style={inputClass} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Opcionais (separados por vírgula)</label>
          <input name="options" defaultValue={v.options?.join(", ") ?? ""} style={inputClass} />
        </div>

        {/* Foto atual */}
        {v.image_url && (
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Foto atual</label>
            <img
              src={v.image_url}
              alt={`${v.make} ${v.model}`}
              className="h-32 rounded-lg object-cover"
            />
          </div>
        )}

        <div className="sm:col-span-2 lg:col-span-3">
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
            {v.image_url ? "Nova foto (deixe vazio para manter a atual)" : "Foto do Veículo"}
          </label>
          <input
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="text-sm"
            style={{ ...inputClass, paddingTop: "0.4rem" }}
          />
        </div>

        <div className="flex items-center gap-6 sm:col-span-2 lg:col-span-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--foreground)" }}>
            <input type="checkbox" name="is_featured" value="on" defaultChecked={v.is_featured} style={{ accentColor: "var(--primary)" }} />
            Destaque
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--foreground)" }}>
            <input type="checkbox" name="is_available" value="on" defaultChecked={v.is_available} style={{ accentColor: "var(--primary)" }} />
            Disponível
          </label>
        </div>

        <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-3">
          <SubmitButton
            label="Salvar Alterações"
            pendingLabel="Salvando..."
            className="rounded-lg px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all neon-glow"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              fontFamily: "Rajdhani, sans-serif",
            }}
          />
          <Link
            href="/admin/veiculos"
            className="rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wider"
            style={{
              border: "1px solid var(--border)",
              color: "var(--muted-foreground)",
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
