import { createClient } from "@/lib/supabase/server";
import { deleteLeadAction } from "@/app/actions/leads";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  novo: "Novo",
  contato: "Em Contato",
  em_negociacao: "Em Negociação",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

const statusStyle: Record<string, { background: string; color: string }> = {
  novo: { background: "oklch(0.45 0.15 240 / 15%)", color: "oklch(0.7 0.15 240)" },
  contato: { background: "oklch(0.65 0.15 200 / 15%)", color: "oklch(0.7 0.15 200)" },
  em_negociacao: { background: "oklch(0.72 0.15 80 / 15%)", color: "oklch(0.8 0.15 80)" },
  proposta: { background: "oklch(0.72 0.15 60 / 15%)", color: "oklch(0.8 0.15 60)" },
  fechado: { background: "var(--neon-muted)", color: "var(--primary)" },
  perdido: { background: "oklch(0.58 0.22 27 / 10%)", color: "oklch(0.58 0.22 27)" },
};

export default async function AdminCRM() {
  const supabase = await createClient();
  const { data: leads } = await supabase!
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const all = leads ?? [];

  return (
    <div>
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
      >
        CRM — Gestão de Leads
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
        {all.length} leads no sistema
      </p>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["novo", "em_negociacao", "fechado", "perdido"] as const).map((s) => (
          <div
            key={s}
            className="rounded-xl p-3"
            style={{ border: "1px solid var(--border)", background: "var(--card)" }}
          >
            <div
              className="text-xl font-bold"
              style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
            >
              {all.filter((l) => l.status === s).length}
            </div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {statusLabels[s]}
            </div>
          </div>
        ))}
      </div>

      {/* Lead Table */}
      <div
        className="mt-6 overflow-x-auto rounded-xl"
        style={{ border: "1px solid var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
              {["Lead", "Interesse", "Origem", "Status", "Data", "Ações"].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-left font-semibold ${h === "Ações" ? "text-right" : ""}`}
                  style={{ color: "var(--foreground)", fontFamily: "Rajdhani, sans-serif" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {all.map((l) => (
              <tr
                key={l.id}
                style={{ borderBottom: "1px solid oklch(0.28 0.01 260 / 50%)" }}
              >
                <td className="px-4 py-3">
                  <div className="font-medium" style={{ color: "var(--foreground)" }}>
                    {l.name}
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {l.phone}
                  </div>
                  {l.email && (
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {l.email}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>
                  {l.vehicle_label ?? "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>
                  {l.source}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={statusStyle[l.status] ?? statusStyle.novo}
                  >
                    {statusLabels[l.status] ?? l.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {new Date(l.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`https://wa.me/55${l.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md px-2 py-1 text-xs transition-all"
                      style={{ border: "1px solid var(--border)", color: "var(--primary)" }}
                    >
                      WA
                    </a>
                    <LeadStatusSelect id={l.id} status={l.status} />
                    <form action={deleteLeadAction}>
                      <input type="hidden" name="id" value={l.id} />
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
        {all.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            Nenhum lead encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
