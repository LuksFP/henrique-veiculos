import { Plus, Trash2, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createLeadAction, updateLeadStatusAction, deleteLeadAction } from "@/app/actions/leads";
import type { LeadRow, VehicleRow } from "@/lib/database.types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  contato: "Em contato",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

const STATUS_COLORS: Record<string, string> = {
  novo: "#86e100",
  contato: "#3b82f6",
  proposta: "#f59e0b",
  fechado: "#10b981",
  perdido: "#ef4444",
};

const SOURCE_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  site: "Site",
  indicacao: "Indicação",
  instagram: "Instagram",
  outro: "Outro",
};

async function getPageData() {
  const supabase = await createClient();
  if (!supabase) return { leads: [] as LeadRow[], vehicles: [] as VehicleRow[] };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: admin } = await supabase
    .from("admin_users").select("is_admin").eq("user_id", user.id).eq("is_admin", true).maybeSingle();
  if (!admin?.is_admin) redirect("/login?error=not-admin");

  const [{ data: leads }, { data: vehicles }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("vehicles").select("id,make,model,year").order("sort_order"),
  ]);

  return { leads: leads ?? [], vehicles: vehicles ?? [] };
}

const successMessages: Record<string, string> = {
  created: "Lead criado.",
  updated: "Lead atualizado.",
  status: "Status atualizado.",
  deleted: "Lead excluído.",
};

export default async function CRMPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; status?: string }>;
}) {
  const { leads, vehicles } = await getPageData();
  const params = await searchParams;
  const errorMessage = params.error ?? null;
  const successMessage = params.success ? successMessages[params.success] ?? null : null;
  const filterStatus = params.status ?? "all";

  const statusCounts = Object.keys(STATUS_LABELS).reduce<Record<string, number>>((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s).length;
    return acc;
  }, {});

  const filtered = filterStatus === "all" ? leads : leads.filter((l) => l.status === filterStatus);

  return (
    <main className="admin-content">
      {errorMessage ? <p className="form-error" role="alert">{errorMessage}</p> : null}
      {successMessage ? <p className="form-success" role="status">{successMessage}</p> : null}

      <div className="admin-layout">
        {/* Formulário novo lead */}
        <section className="admin-card">
          <span className="admin-card-kicker">Novo lead</span>
          <h2>Adicionar contato</h2>
          <form className="admin-form" action={createLeadAction}>
            <label>
              Nome *
              <input name="name" required placeholder="João Silva" />
            </label>
            <label>
              Telefone *
              <input name="phone" required placeholder="(13) 99999-0000" />
            </label>
            <label>
              E-mail
              <input name="email" type="email" placeholder="joao@email.com" />
            </label>
            <label>
              Veículo de interesse
              <select name="vehicle_id">
                <option value="">— sem veículo —</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} {v.year}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-form-row">
              <label>
                Status
                <select name="status">
                  {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
              <label>
                Origem
                <select name="source">
                  {Object.entries(SOURCE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Observações
              <textarea name="notes" placeholder="Detalhes da conversa..." />
            </label>
            <button className="admin-button" type="submit">
              <Plus size={16} /> Adicionar lead
            </button>
          </form>
        </section>

        {/* Lista de leads */}
        <section className="admin-card" style={{ minWidth: 0 }}>
          <span className="admin-card-kicker">Pipeline</span>
          <h2>{leads.length} leads</h2>

          {/* Filtros de status */}
          <div className="crm-status-tabs">
            <a
              className={`crm-tab ${filterStatus === "all" ? "is-active" : ""}`}
              href="/admin/crm"
            >
              Todos ({leads.length})
            </a>
            {Object.entries(STATUS_LABELS).map(([s, l]) => (
              <a
                key={s}
                className={`crm-tab ${filterStatus === s ? "is-active" : ""}`}
                href={`/admin/crm?status=${s}`}
                style={{ "--tab-color": STATUS_COLORS[s] } as React.CSSProperties}
              >
                {l} ({statusCounts[s] ?? 0})
              </a>
            ))}
          </div>

          <div className="crm-lead-list">
            {filtered.length === 0 ? (
              <p style={{ color: "#4a5a3a", padding: "16px 0" }}>Nenhum lead nesta etapa.</p>
            ) : (
              filtered.map((lead) => (
                <article className="crm-lead" key={lead.id}>
                  <div className="crm-lead-header">
                    <div>
                      <strong>{lead.name}</strong>
                      <span
                        className="crm-badge"
                        style={{ "--badge-color": STATUS_COLORS[lead.status] } as React.CSSProperties}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </div>
                    <div className="crm-lead-meta">
                      <span>{SOURCE_LABELS[lead.source]}</span>
                      <span>{new Date(lead.created_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>

                  <div className="crm-lead-contacts">
                    <a href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                      <MessageCircle size={13} /> {lead.phone}
                    </a>
                    {lead.email ? <span>{lead.email}</span> : null}
                  </div>

                  {lead.vehicle_label ? (
                    <p className="crm-lead-vehicle">{lead.vehicle_label}</p>
                  ) : null}

                  {lead.notes ? <p className="crm-lead-notes">{lead.notes}</p> : null}

                  {/* Troca de status rápida */}
                  <div className="crm-lead-actions">
                    <form action={updateLeadStatusAction} style={{ display: "contents" }}>
                      <input type="hidden" name="id" value={lead.id} />
                      <select
                        name="status"
                        defaultValue={lead.status}
                        className="crm-status-select"
                        onChange={(e) => (e.currentTarget.form as HTMLFormElement).requestSubmit()}
                      >
                        {Object.entries(STATUS_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                      <button type="submit" className="admin-button secondary" style={{ fontSize: "0.75rem", padding: "6px 10px" }}>
                        Salvar status
                      </button>
                    </form>

                    <form action={deleteLeadAction}>
                      <input type="hidden" name="id" value={lead.id} />
                      <button type="submit" className="admin-button admin-danger" style={{ fontSize: "0.75rem", padding: "6px 10px" }}>
                        <Trash2 size={13} />
                      </button>
                    </form>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
