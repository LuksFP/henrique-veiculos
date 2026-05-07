import { createVehicleAction } from "@/app/actions/vehicles";

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

export default function AdminCadastro() {
  return (
    <div>
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
      >
        Cadastrar Veículo
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
        Preencha os dados do novo veículo
      </p>

      <form
        action={createVehicleAction}
        encType="multipart/form-data"
        className="mt-6 grid gap-4 rounded-xl p-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ border: "1px solid var(--border)", background: "var(--card)" }}
      >
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Marca *</label>
          <input required name="make" placeholder="Ex: BMW" style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Modelo *</label>
          <input required name="model" placeholder="Ex: 320i M Sport" style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Ano *</label>
          <input required name="year" type="number" defaultValue="2024" style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Preço *</label>
          <input required name="price" placeholder="Ex: R$ 289.900" style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Km</label>
          <input name="km" placeholder="Ex: 12.000 km" style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Combustível *</label>
          <select name="fuel" required style={inputClass}>
            <option>Flex</option>
            <option>Gasolina</option>
            <option>Diesel</option>
            <option>Híbrido</option>
            <option>Elétrico</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Câmbio *</label>
          <select name="transmission" required style={inputClass}>
            <option>Automático</option>
            <option>Manual</option>
            <option>CVT</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Cor</label>
          <input name="color" placeholder="Ex: Preto" style={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Ordem (sort)</label>
          <input name="sort_order" type="number" defaultValue="99" style={inputClass} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Opcionais (separados por vírgula)</label>
          <input name="options" placeholder="Ex: Teto Solar, Bancos em Couro, Multimídia" style={inputClass} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Foto do Veículo</label>
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
            <input type="checkbox" name="is_featured" value="on" style={{ accentColor: "var(--primary)" }} />
            Destaque
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--foreground)" }}>
            <input type="checkbox" name="is_available" value="on" defaultChecked style={{ accentColor: "var(--primary)" }} />
            Disponível
          </label>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            className="rounded-lg px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all neon-glow"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            Salvar Veículo
          </button>
        </div>
      </form>
    </div>
  );
}
