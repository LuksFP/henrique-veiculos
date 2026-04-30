import { Car, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import { createVehicleAction, deleteVehicleAction, updateVehicleAction } from "@/app/actions/vehicles";
import { logoutAction } from "@/app/actions/auth";
import { ShowroomLogo } from "@/components/showroom-logo";
import { createClient } from "@/lib/supabase/server";
import { vehicleImage } from "@/lib/vehicle-shared";
import type { VehicleRow } from "@/lib/database.types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getAdminVehicles() {
  const supabase = await createClient();

  if (!supabase) {
    return { vehicles: [] as VehicleRow[], missingEnv: true };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("is_admin")
    .eq("user_id", user.id)
    .eq("is_admin", true)
    .maybeSingle();

  if (!admin?.is_admin) {
    redirect("/login?error=not-admin");
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return { vehicles: data ?? [], missingEnv: false };
}

function VehicleFields({ vehicle }: { vehicle?: VehicleRow }) {
  return (
    <>
      {vehicle ? (
        <>
          <input type="hidden" name="id" value={vehicle.id} />
          <input type="hidden" name="current_image_path" value={vehicle.image_path ?? ""} />
        </>
      ) : null}
      <div className="admin-form-row">
        <label>
          Marca
          <input name="make" defaultValue={vehicle?.make ?? ""} required />
        </label>
        <label>
          Ano
          <input name="year" type="number" min="1900" max="2100" defaultValue={vehicle?.year ?? new Date().getFullYear()} required />
        </label>
      </div>
      <label>
        Modelo
        <input name="model" defaultValue={vehicle?.model ?? ""} required />
      </label>
      <div className="admin-form-row">
        <label>
          Preço
          <input name="price" defaultValue={vehicle?.price ?? ""} placeholder="R$ 75.990,00" required />
        </label>
        <label>
          Km
          <input name="km" defaultValue={vehicle?.km ?? ""} placeholder="44.109" />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Combustível
          <input name="fuel" defaultValue={vehicle?.fuel ?? "FLEX"} required />
        </label>
        <label>
          Câmbio
          <input name="transmission" defaultValue={vehicle?.transmission ?? "MANUAL"} required />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Cor
          <input name="color" defaultValue={vehicle?.color ?? ""} />
        </label>
        <label>
          Ordem
          <input name="sort_order" type="number" defaultValue={vehicle?.sort_order ?? 99} />
        </label>
      </div>
      <label>
        Opcionais
        <textarea name="options" defaultValue={vehicle?.options.join(", ") ?? ""} placeholder="ABS, Airbag, Ar-condicionado" />
      </label>
      <label>
        Fundo do card
        <input name="bg" defaultValue={vehicle?.bg ?? ""} placeholder="linear-gradient(135deg, #f4f4f5, #a1a1aa)" />
      </label>
      <label>
        <Upload size={16} aria-hidden="true" /> Foto
        <input name="image" type="file" accept="image/*" />
      </label>
      <div className="admin-form-row">
        <label>
          <input name="is_featured" type="checkbox" defaultChecked={vehicle?.is_featured ?? false} /> Destaque
        </label>
        <label>
          <input name="is_available" type="checkbox" defaultChecked={vehicle?.is_available ?? true} /> Disponível
        </label>
      </div>
    </>
  );
}

const successMessages: Record<string, string> = {
  created: "Veículo cadastrado com sucesso.",
  updated: "Veículo atualizado.",
  deleted: "Veículo excluído.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { vehicles, missingEnv } = await getAdminVehicles();
  const params = await searchParams;
  const errorMessage = params.error ?? null;
  const successMessage = params.success ? successMessages[params.success] ?? null : null;

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-title">
          <span>Painel</span>
          <h1>Estoque</h1>
        </div>
        <form action={logoutAction}>
          <button className="admin-button secondary" type="submit">
            <LogOut size={16} /> Sair
          </button>
        </form>
      </header>

      {errorMessage ? <p className="form-error" role="alert">{errorMessage}</p> : null}
      {successMessage ? <p className="form-success" role="status">{successMessage}</p> : null}

      <div className="admin-layout">
        <section className="admin-card">
          <span className="admin-card-kicker">Novo veículo</span>
          <h2>Cadastrar no estoque</h2>
          {missingEnv ? <p className="form-error">Configure as variáveis do Supabase antes de cadastrar.</p> : null}
          <form className="admin-form" action={createVehicleAction}>
            <VehicleFields />
            <button className="admin-button" type="submit">
              <Plus size={16} /> Publicar
            </button>
          </form>
        </section>

        <section className="admin-card">
          <span className="admin-card-kicker">Veículos cadastrados</span>
          <h2>{vehicles.length} registros</h2>
          <div className="admin-vehicle-list">
            {vehicles.map((vehicle) => {
              const image = vehicleImage(vehicle);

              return (
                <article className="admin-vehicle" key={vehicle.id}>
                  {image ? <img src={image} alt={`${vehicle.make} ${vehicle.model}`} /> : <div className="admin-vehicle-placeholder"><ShowroomLogo /></div>}
                  <div>
                    <strong>
                      {vehicle.make} {vehicle.model}
                    </strong>
                    <small>
                      {vehicle.year} · {vehicle.price} · {vehicle.is_available ? "disponível" : "oculto"}
                    </small>
                    <form className="admin-form" action={updateVehicleAction}>
                      <VehicleFields vehicle={vehicle} />
                      <div className="admin-actions">
                        <button className="admin-button" type="submit">
                          <Save size={16} /> Salvar
                        </button>
                        <button className="admin-button secondary" type="button">
                          <Car size={16} /> ID {vehicle.id.slice(0, 8)}
                        </button>
                      </div>
                    </form>
                    <form action={deleteVehicleAction}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <button className="admin-button admin-danger" type="submit">
                        <Trash2 size={16} /> Excluir
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
