import { createClient } from "@/lib/supabase/server";
import { deleteLeadAction, createLeadAction } from "@/app/actions/leads";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SubmitButton } from "@/components/admin/SubmitButton";

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

const inputClass = {
  width: "100%",
  borderRadius: "0.5rem",
  border: "1px solid var(--input)",
  background: "var(--input)",
  color: "var(--foreground)",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
} as const;

export default async function AdminCRM() {
  const supabase = await createClient();
  const [{ data: leads }, { data: vehicles }] = await Promise.all([
    supabase!.from("leads").select("*").order("created_at", { ascending: false }),
    supabase!.from("vehicles").select("id, make, model, year").eq("is_available", true),
  ]);

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

      {/* Novo Lead */}
      <div
        className="mt-6 rounded-xl p-5"
        style={{ border: "1px solid var(--border)", background: "var(--card)" }}
      >
        <h3
          className="mb-4 text-base font-bold"
          style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--foreground)" }}
        >
          Cadastrar Novo Lead
        </h3>
        <form action={createLeadAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Nome *</label>
            <input required name="name" placeholder="Nome do cliente" style={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Telefone *</label>
            <input required name="phone" placeholder="(13) 99999-9999" style={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>E-mail</label>
            <input name="email" type="email" placeholder="cliente@email.com" style={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Origem</label>
            <select name="source" style={inputClass}>
              <option value="whatsapp">WhatsApp</option>
              <option value="site">Site</option>
              <option value="indicacao">Indicação</option>
              <option value="instagram">Instagram</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Interesse (veículo)</label>
            <select name="vehicle_id" style={inputClass}>
              <option value="">— Nenhum —</option>
              {vehicles?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} {v.year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Interesse (texto livre)</label>
            <input name="vehicle_label" placeholder="Ex: SUV até R$ 80k" style={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Status</label>
            <select name="status" style={inputClass}>
              {Object.entries(statusLabels).map(([v, label]) => (
                <option key={v} value={v}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Observações</label>
            <input name="notes" placeholder="Anotações..." style={inputClass} />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <SubmitButton
              label="Cadastrar Lead"
              pendingLabel="Salvando..."
              className="rounded-lg px-6 py-2.5 text-sm font-bold uppercase tracking-wider transition-all neon-glow"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                fontFamily: "Rajdhani, sans-serif",
              }}
            />
          </div>
        </form>
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
                    <DeleteButton action={deleteLeadAction} id={l.id} />
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
