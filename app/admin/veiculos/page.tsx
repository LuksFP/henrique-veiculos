import { createClient } from "@/lib/supabase/server";
import { deleteVehicleAction, updateVehicleAction } from "@/app/actions/vehicles";
import Link from "next/link";

export const dynamic = "force-dynamic";

const cell = "px-4 py-3";
const th = `${cell} text-left text-sm font-semibold`;

export default async function AdminVeiculos() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase!
    .from("vehicles")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
          >
            Gestão de Veículos
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            {vehicles?.length ?? 0} veículos no sistema
          </p>
        </div>
        <Link
          href="/admin/cadastro"
          className="rounded-lg px-4 py-2 text-sm font-bold transition-all neon-glow"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            fontFamily: "Rajdhani, sans-serif",
          }}
        >
          + Cadastrar
        </Link>
      </div>

      <div
        className="mt-6 overflow-x-auto rounded-xl"
        style={{ border: "1px solid var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
              <th className={th} style={{ color: "var(--foreground)" }}>Veículo</th>
              <th className={th} style={{ color: "var(--foreground)" }}>Preço</th>
              <th className={th} style={{ color: "var(--foreground)" }}>Ano</th>
              <th className={th} style={{ color: "var(--foreground)" }}>Km</th>
              <th className={th} style={{ color: "var(--foreground)" }}>Status</th>
              <th className={th} style={{ color: "var(--foreground)" }}>Destaque</th>
              <th className={`${cell} text-right text-sm font-semibold`} style={{ color: "var(--foreground)" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vehicles?.map((v) => (
              <tr
                key={v.id}
                style={{ borderBottom: "1px solid oklch(0.28 0.01 260 / 50%)" }}
              >
                <td className={cell}>
                  <div className="flex items-center gap-3">
                    {v.image_url ? (
                      <img
                        src={v.image_url}
                        alt={`${v.make} ${v.model}`}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                    ) : (
                      <div
                        className="h-10 w-14 rounded-md flex items-center justify-center text-xs"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                      >
                        sem foto
                      </div>
                    )}
                    <div>
                      <div className="font-medium" style={{ color: "var(--foreground)" }}>
                        {v.make} {v.model}
                      </div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {v.fuel} • {v.transmission}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`${cell} font-semibold`} style={{ color: "var(--primary)" }}>
                  {v.price}
                </td>
                <td className={cell} style={{ color: "var(--muted-foreground)" }}>{v.year}</td>
                <td className={cell} style={{ color: "var(--muted-foreground)" }}>{v.km ?? "—"}</td>
                <td className={cell}>
                  <span
                    className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={
                      v.is_available
                        ? { background: "var(--neon-muted)", color: "var(--primary)" }
                        : { background: "oklch(0.58 0.22 27 / 10%)", color: "oklch(0.58 0.22 27)" }
                    }
                  >
                    {v.is_available ? "Disponível" : "Vendido"}
                  </span>
                </td>
                <td className={cell}>
                  {v.is_featured && <span style={{ color: "var(--primary)" }}>⭐</span>}
                </td>
                <td className={`${cell} text-right`}>
                  <div className="flex items-center justify-end gap-2">
                    {/* Toggle destaque */}
                    <form action={async () => {
                      "use server";
                      const { revalidatePath } = await import("next/cache");
                      const supabase2 = await createClient();
                      await supabase2!.from("vehicles").update({ is_featured: !v.is_featured }).eq("id", v.id);
                      revalidatePath("/admin/veiculos");
                    }}>
                      <button
                        type="submit"
                        className="rounded-md px-2 py-1 text-xs transition-all"
                        style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                        title="Destaque"
                      >
                        ⭐
                      </button>
                    </form>
                    {/* Toggle disponível */}
                    <form action={async () => {
                      "use server";
                      const { revalidatePath } = await import("next/cache");
                      const supabase2 = await createClient();
                      await supabase2!.from("vehicles").update({ is_available: !v.is_available }).eq("id", v.id);
                      revalidatePath("/admin/veiculos");
                    }}>
                      <button
                        type="submit"
                        className="rounded-md px-2 py-1 text-xs transition-all"
                        style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                      >
                        {v.is_available ? "Vender" : "Disponib."}
                      </button>
                    </form>
                    {/* Deletar */}
                    <form action={deleteVehicleAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <button
                        type="submit"
                        className="rounded-md px-2 py-1 text-xs transition-all"
                        style={{ border: "1px solid var(--border)", color: "oklch(0.58 0.22 27)" }}
                      >
                        🗑️
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
