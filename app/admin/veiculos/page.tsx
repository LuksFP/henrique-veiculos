import { Plus, Save, Trash2 } from "lucide-react";
import { createVehicleAction, deleteVehicleAction, updateVehicleAction } from "@/app/actions/vehicles";
import { ShowroomLogo } from "@/components/showroom-logo";
import { requireAdmin } from "@/lib/admin";
import { vehicleImage } from "@/lib/vehicle-shared";
import type { VehicleRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

async function getVehicles() {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("vehicles").select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

function Fields({ v }: { v?: VehicleRow }) {
  return (
    <>
      {v && (
        <>
          <input type="hidden" name="id" value={v.id} />
          <input type="hidden" name="current_image_path" value={v.image_path ?? ""} />
        </>
      )}
      <div className="adm-field"><label className="adm-label">Marca</label><input className="adm-input" name="make" defaultValue={v?.make ?? ""} required /></div>
      <div className="adm-field"><label className="adm-label">Ano</label><input className="adm-input" name="year" type="number" min="1900" max="2100" defaultValue={v?.year ?? new Date().getFullYear()} required /></div>
      <div className="adm-field"><label className="adm-label">Modelo</label><input className="adm-input" name="model" defaultValue={v?.model ?? ""} required /></div>
      <div className="adm-field"><label className="adm-label">Preço</label><input className="adm-input" name="price" defaultValue={v?.price ?? ""} placeholder="R$ 75.990" required /></div>
      <div className="adm-field"><label className="adm-label">Km</label><input className="adm-input" name="km" defaultValue={v?.km ?? ""} placeholder="44.109" /></div>
      <div className="adm-field"><label className="adm-label">Combustível</label><input className="adm-input" name="fuel" defaultValue={v?.fuel ?? "FLEX"} required /></div>
      <div className="adm-field"><label className="adm-label">Câmbio</label><input className="adm-input" name="transmission" defaultValue={v?.transmission ?? "MANUAL"} required /></div>
      <div className="adm-field"><label className="adm-label">Cor</label><input className="adm-input" name="color" defaultValue={v?.color ?? ""} /></div>
      <div className="adm-field"><label className="adm-label">Ordem</label><input className="adm-input" name="sort_order" type="number" defaultValue={v?.sort_order ?? 99} /></div>
      <div className="adm-field adm-field--wide"><label className="adm-label">Opcionais</label><textarea className="adm-input adm-textarea" name="options" defaultValue={v?.options.join(", ") ?? ""} placeholder="ABS, Airbag, Ar-condicionado" /></div>
      <div className="adm-field"><label className="adm-label">Fundo do card</label><input className="adm-input" name="bg" defaultValue={v?.bg ?? ""} placeholder="linear-gradient(...)" /></div>
      <div className="adm-field"><label className="adm-label">Foto</label><input className="adm-input" name="image" type="file" accept="image/*" /></div>
      <div className="adm-checks">
        <label className="adm-check"><input name="is_featured" type="checkbox" defaultChecked={v?.is_featured ?? false} />Destaque</label>
        <label className="adm-check"><input name="is_available" type="checkbox" defaultChecked={v?.is_available ?? true} />Disponível</label>
      </div>
    </>
  );
}

const OK: Record<string, string> = { created: "Veículo cadastrado.", updated: "Atualizado.", deleted: "Excluído." };

export default async function VeiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const vehicles = await getVehicles();
  const params = await searchParams;

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

      <details className="adm-card adm-form-card">
        <summary className="adm-card-head">
          <h2 className="adm-card-title">Cadastrar Veículo</h2>
          <span className="adm-card-toggle">›</span>
        </summary>
        <div className="adm-card-body">
          <form className="adm-form" action={createVehicleAction}>
            <Fields />
            <div className="adm-form-foot">
              <button className="adm-btn-primary" type="submit"><Plus size={15} /> Salvar Veículo</button>
            </div>
          </form>
        </div>
      </details>

      <div className="adm-card">
        <div className="adm-card-head adm-card-head--static">
          <h2 className="adm-card-title">Estoque</h2>
        </div>
        {vehicles.length === 0 ? (
          <p className="adm-empty">Nenhum veículo cadastrado.</p>
        ) : (
          <div className="adm-table">
            <div className="adm-table-head">
              <span>Veículo</span>
              <span>Preço</span>
              <span>Ano</span>
              <span>Km</span>
              <span>Status</span>
              <span style={{ textAlign: "right" }}>Ações</span>
            </div>
            {vehicles.map((vehicle) => {
              const img = vehicleImage(vehicle);
              return (
                <details className="adm-table-row" key={vehicle.id}>
                  <summary className="adm-table-cells">
                    <div className="adm-tc-vehicle">
                      <div className="adm-tc-thumb">
                        {img ? <img src={img} alt={`${vehicle.make} ${vehicle.model}`} /> : <div className="adm-tc-placeholder"><ShowroomLogo /></div>}
                      </div>
                      <div>
                        <div className="adm-tc-name">{vehicle.make} {vehicle.model}</div>
                        <div className="adm-tc-sub">{vehicle.fuel} · {vehicle.transmission}</div>
                      </div>
                    </div>
                    <span className="adm-tc-price">{vehicle.price}</span>
                    <span className="adm-tc-muted">{vehicle.year}</span>
                    <span className="adm-tc-muted">{vehicle.km ? `${vehicle.km} km` : "—"}</span>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      <span className={vehicle.is_available ? "adm-tag adm-tag--green" : "adm-tag adm-tag--red"}>
                        {vehicle.is_available ? "Disponível" : "Vendido"}
                      </span>
                      {vehicle.is_featured && <span className="adm-tag adm-tag--lime">★</span>}
                    </div>
                    <span className="adm-tc-edit-hint">Editar ›</span>
                  </summary>
                  <div className="adm-row-edit">
                    <form className="adm-form" action={updateVehicleAction}>
                      <Fields v={vehicle} />
                      <div className="adm-form-foot">
                        <button className="adm-btn-primary" type="submit"><Save size={15} /> Salvar</button>
                      </div>
                    </form>
                    <form className="adm-row-delete" action={deleteVehicleAction}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <button className="adm-btn-danger" type="submit"><Trash2 size={15} /> Excluir veículo</button>
                    </form>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
