import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { CrmClient } from "@/components/crm-client";
import { createLeadAction } from "@/app/actions/leads";
import type { LeadRow } from "@/lib/database.types";

async function getLeads(): Promise<LeadRow[]> {
  const supabase = await requireAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

const OK: Record<string, string> = {
  created: "Lead cadastrado.",
  updated: "Lead atualizado.",
  deleted: "Lead excluído.",
};

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const leads = await getLeads();
  const params = await searchParams;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">CRM</h1>
          <p className="adm-page-sub">{leads.length} lead{leads.length !== 1 ? "s" : ""} no sistema</p>
        </div>
      </div>

      {params.error && <div className="adm-alert adm-alert--err">{params.error}</div>}
      {params.success && OK[params.success] && <div className="adm-alert adm-alert--ok">{OK[params.success]}</div>}

      <details className="adm-card adm-form-card">
        <summary className="adm-card-head">
          <h2 className="adm-card-title">Novo Lead</h2>
          <span className="adm-card-toggle">›</span>
        </summary>
        <div className="adm-card-body">
          <form className="adm-form" action={createLeadAction}>
            <div className="adm-field">
              <label className="adm-label">Nome</label>
              <input className="adm-input" name="name" required placeholder="Pedro Augusto" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Telefone</label>
              <input className="adm-input" name="phone" required placeholder="(63) 99999-0000" />
            </div>
            <div className="adm-field">
              <label className="adm-label">E-mail</label>
              <input className="adm-input" name="email" type="email" placeholder="cliente@email.com" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Veículo de interesse</label>
              <input className="adm-input" name="vehicle_label" placeholder="Toyota Corolla XLS" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Status</label>
              <select className="adm-input" name="status">
                <option value="novo">Novo</option>
                <option value="contato">Contato</option>
                <option value="em_negociacao">Em Negociação</option>
                <option value="proposta">Proposta</option>
                <option value="fechado">Fechado</option>
                <option value="perdido">Perdido</option>
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-label">Origem</label>
              <select className="adm-input" name="source">
                <option value="whatsapp">WhatsApp</option>
                <option value="site">Site</option>
                <option value="indicacao">Indicação</option>
                <option value="instagram">Instagram</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="adm-field adm-field--wide">
              <label className="adm-label">Observações</label>
              <textarea className="adm-input adm-textarea" name="notes" placeholder="Anotações sobre o lead..." />
            </div>
            <div className="adm-form-foot">
              <button className="adm-btn-primary" type="submit">
                <Plus size={15} /> Cadastrar Lead
              </button>
            </div>
          </form>
        </div>
      </details>

      <CrmClient leads={leads} />
    </>
  );
}
