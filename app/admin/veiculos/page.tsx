import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { deleteVehicleAction } from "@/app/actions/vehicles";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AlertBanner } from "@/components/admin/AlertBanner";
import { VehicleFilters } from "@/components/admin/VehicleFilters";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const cell = "px-4 py-3";
const th = `${cell} text-left text-sm font-semibold`;

export default async function AdminVeiculos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; success?: string; error?: string }>;
}) {
  const { q = "", status = "", page = "1", success, error } = await searchParams;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const from = (pageNum - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase!.from("vehicles").select("*", { count: "exact" });

  if (q) {
    query = query.or(`make.ilike.%${q}%,model.ilike.%${q}%`);
  }
  if (status === "available") query = query.eq("is_available", true);
  if (status === "sold") query = query.eq("is_available", false);
  if (status === "featured") query = query.eq("is_featured", true);

  const { data: vehicles, count } = await query
    .order("sort_order", { ascending: true })
    .range(from, to);

  const total = count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

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
            {total} veículo{total !== 1 ? "s" : ""} no sistema
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

      <AlertBanner success={success} error={error} />

      <Suspense>
        <VehicleFilters
          q={q}
          status={status}
          total={total}
          showing={vehicles?.length ?? 0}
        />
      </Suspense>

      <div
        className="mt-4 overflow-x-auto rounded-xl"
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
              <th className={th} style={{ color: "var(--foreground)" }}>⭐</th>
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
                      <Image
                        src={v.image_url}
                        alt={`${v.make} ${v.model}`}
                        width={56}
                        height={40}
                        className="h-10 w-14 rounded-md object-cover"
                        unoptimized={false}
                      />
                    ) : (
                      <div
                        className="h-10 w-14 rounded-md flex items-center justify-center text-xs flex-shrink-0"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                      >
                        foto
                      </div>
                    )}
                    <div>
                      <div className="font-medium" style={{ color: "var(--foreground)" }}>
                        {v.make} {v.model}
                      </div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {v.fuel} • {v.transmission}
                        {v.color ? ` • ${v.color}` : ""}
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
                  {v.is_featured ? (
                    <span style={{ color: "var(--primary)" }}>⭐</span>
                  ) : (
                    <span style={{ color: "var(--muted-foreground)", opacity: 0.3 }}>⭐</span>
                  )}
                </td>
                <td className={`${cell} text-right`}>
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/veiculos/editar?id=${v.id}`}
                      className="rounded-md px-2 py-1 text-xs transition-all"
                      style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                      title="Editar"
                    >
                      ✏️
                    </Link>
                    {/* Toggle destaque */}
                    <form action={async () => {
                      "use server";
                      const { revalidatePath } = await import("next/cache");
                      const { createClient: cc } = await import("@/lib/supabase/server");
                      const sb = await cc();
                      await sb!.from("vehicles").update({ is_featured: !v.is_featured }).eq("id", v.id);
                      revalidatePath("/admin/veiculos");
                    }}>
                      <button
                        type="submit"
                        className="rounded-md px-2 py-1 text-xs transition-all"
                        style={{
                          border: "1px solid var(--border)",
                          color: v.is_featured ? "var(--primary)" : "var(--muted-foreground)",
                        }}
                        title={v.is_featured ? "Remover destaque" : "Marcar destaque"}
                      >
                        ⭐
                      </button>
                    </form>
                    {/* Toggle disponível */}
                    <form action={async () => {
                      "use server";
                      const { revalidatePath } = await import("next/cache");
                      const { createClient: cc } = await import("@/lib/supabase/server");
                      const sb = await cc();
                      await sb!.from("vehicles").update({ is_available: !v.is_available }).eq("id", v.id);
                      revalidatePath("/admin/veiculos");
                    }}>
                      <button
                        type="submit"
                        className="rounded-md px-2 py-1 text-xs transition-all"
                        style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                        title={v.is_available ? "Marcar como vendido" : "Marcar como disponível"}
                      >
                        {v.is_available ? "Vendido" : "Disponib."}
                      </button>
                    </form>
                    <DeleteButton action={deleteVehicleAction} id={v.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!vehicles || vehicles.length === 0) && (
          <div className="py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            {q || status ? "Nenhum veículo encontrado com esses filtros." : "Nenhum veículo cadastrado ainda."}
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span style={{ color: "var(--muted-foreground)" }}>
            Página {pageNum} de {totalPages}
          </span>
          <div className="flex gap-2">
            {pageNum > 1 && (
              <Link
                href={`/admin/veiculos?q=${q}&status=${status}&page=${pageNum - 1}`}
                className="rounded-md px-3 py-1.5"
                style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                ← Anterior
              </Link>
            )}
            {pageNum < totalPages && (
              <Link
                href={`/admin/veiculos?q=${q}&status=${status}&page=${pageNum + 1}`}
                className="rounded-md px-3 py-1.5"
                style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                Próxima →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
