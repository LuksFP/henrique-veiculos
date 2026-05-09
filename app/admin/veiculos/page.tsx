import { Plus } from "lucide-react";
import { createVehicleAction } from "@/app/actions/vehicles";
import { VehiclesTable } from "@/components/vehicles-table";
import { requireAdmin } from "@/lib/admin";
import type { VehicleImageRow, VehicleRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

type VehicleWithImages = VehicleRow & { vehicle_images: VehicleImageRow[] };

async function getVehicles(): Promise<VehicleWithImages[]> {
  const supabase = await requireAdmin();

  const [vehiclesRes, imagesRes] = await Promise.all([
    supabase.from("vehicles").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
    supabase.from("vehicle_images").select("id,vehicle_id,url,path,sort_order,created_at").order("sort_order", { ascending: true }),
  ]);

  if (vehiclesRes.error) throw new Error(vehiclesRes.error.message);

  const byVehicle = new Map<string, VehicleImageRow[]>();
  for (const img of imagesRes.data ?? []) {
    const arr = byVehicle.get(img.vehicle_id) ?? [];
    arr.push(img);
    byVehicle.set(img.vehicle_id, arr);
  }

  return (vehiclesRes.data ?? []).map((v) => ({ ...v, vehicle_images: byVehicle.get(v.id) ?? [] }));
}

function CreateForm() {
  return (
    <details className="adm-card adm-form-card">
      <summary className="adm-card-head">
        <h2 className="adm-card-title">Cadastrar Veículo</h2>
        <span className="adm-card-toggle">›</span>
      </summary>
      <div className="adm-card-body">
        <form className="adm-form" action={createVehicleAction}>
          <div className="adm-field"><label className="adm-label">Marca</label><input className="adm-input" name="make" required /></div>
          <div className="adm-field"><label className="adm-label">Ano</label><input className="adm-input" name="year" type="number" min="1900" max="2100" defaultValue={new Date().getFullYear()} required /></div>
          <div className="adm-field"><label className="adm-label">Modelo</label><input className="adm-input" name="model" required /></div>
          <div className="adm-field"><label className="adm-label">Preço</label><input className="adm-input" name="price" placeholder="R$ 75.990" required /></div>
          <div className="adm-field"><label className="adm-label">Km</label><input className="adm-input" name="km" placeholder="44.109" /></div>
          <div className="adm-field"><label className="adm-label">Combustível</label><input className="adm-input" name="fuel" defaultValue="FLEX" required /></div>
          <div className="adm-field"><label className="adm-label">Câmbio</label><input className="adm-input" name="transmission" defaultValue="MANUAL" required /></div>
          <div className="adm-field"><label className="adm-label">Cor</label><input className="adm-input" name="color" /></div>
          <div className="adm-field"><label className="adm-label">Ordem</label><input className="adm-input" name="sort_order" type="number" defaultValue={99} /></div>
          <div className="adm-field adm-field--wide"><label className="adm-label">Opcionais</label><textarea className="adm-input adm-textarea" name="options" placeholder="ABS, Airbag, Ar-condicionado" /></div>
          <div className="adm-field"><label className="adm-label">Fundo do card</label><input className="adm-input" name="bg" placeholder="linear-gradient(...)" /></div>
          <div className="adm-field"><label className="adm-label">Foto principal</label><input className="adm-input" name="image" type="file" accept="image/*" /></div>
          <div className="adm-checks">
            <label className="adm-check"><input name="is_featured" type="checkbox" />Destaque</label>
            <label className="adm-check"><input name="is_available" type="checkbox" defaultChecked />Disponível</label>
          </div>
          <div className="adm-form-foot">
            <button className="adm-btn-primary" type="submit"><Plus size={15} /> Salvar Veículo</button>
          </div>
        </form>
      </div>
    </details>
  );
}

const OK: Record<string, string> = { created: "Veículo cadastrado.", updated: "Atualizado.", deleted: "Excluído." };

export default async function VeiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const [vehicles, params] = await Promise.all([getVehicles(), searchParams]);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Gestão de Veículos</h1>
          <p className="adm-page-sub">{vehicles.length} veículo{vehicles.length !== 1 ? "s" : ""} no sistema</p>
        </div>
      </div>

      {params.error && <div className="adm-alert adm-alert--err">{params.error}</div>}
      {params.success && OK[params.success] && <div className="adm-alert adm-alert--ok">{OK[params.success]}</div>}

      <CreateForm />

      <VehiclesTable vehicles={vehicles} />
    </>
  );
}
