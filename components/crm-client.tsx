"use client";

import { useState, useEffect } from "react";

const PAGE_SIZE = 25;
import { Phone, Mail, Car, Calendar, X, Save, Trash2 } from "lucide-react";
import type { LeadRow } from "@/lib/database.types";
import { updateLeadAction, deleteLeadAction } from "@/app/actions/leads";

type Status = LeadRow["status"];
type FilterKey = Status | "todos";

const statusLabel: Record<Status, string> = {
  novo: "Novo",
  contato: "Contato",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

const statusCss: Record<Status, string> = {
  novo: "adm-tag--yellow",
  contato: "adm-tag--cyan",
  proposta: "adm-tag--yellow",
  fechado: "adm-tag--green",
  perdido: "adm-tag--red",
};

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "novo", label: "Novos" },
  { key: "contato", label: "Contato" },
  { key: "proposta", label: "Proposta" },
  { key: "fechado", label: "Fechados" },
  { key: "perdido", label: "Perdidos" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function CrmClient({ leads }: { leads: LeadRow[] }) {
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [editStatus, setEditStatus] = useState<Status>("novo");
  const [page, setPage] = useState(1);

  const q = search.toLowerCase();
  const filteredAll = (filter === "todos" ? leads : leads.filter((l) => l.status === filter))
    .filter((l) => !q || l.name.toLowerCase().includes(q) || l.phone.includes(q));
  useEffect(() => { setPage(1); setSelected(null); }, [filter, search]);

  const totalPages = Math.ceil(filteredAll.length / PAGE_SIZE);
  const filtered = filteredAll.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, filteredAll.length);

  function countFor(key: FilterKey) {
    return key === "todos" ? leads.length : leads.filter((l) => l.status === key).length;
  }

  function handleSelect(lead: LeadRow) {
    setSelected(lead);
    setEditStatus(lead.status);
  }

  return (
    <>
      <div className="crm-filters">
        <input
          type="search"
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="adm-input"
          style={{ minWidth: 240, marginRight: "auto" }}
        />
        {filterOptions.map(({ key, label }) => (
          <button
            key={key}
            className={`crm-chip ${filter === key ? "is-active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
            <span className="crm-chip-count">{countFor(key)}</span>
          </button>
        ))}
      </div>

      <div className="crm-split">
        <div className="crm-list adm-card">
          <div className="adm-card-head adm-card-head--static">
            <h3 className="adm-card-title">Leads ({filteredAll.length})</h3>
          </div>
          <div className="crm-rows">
            {filteredAll.length === 0 ? (
              <p className="adm-empty">Nenhum lead encontrado.</p>
            ) : (
              filtered.map((lead) => (
                <button
                  key={lead.id}
                  className={`crm-row ${selected?.id === lead.id ? "is-active" : ""}`}
                  onClick={() => handleSelect(lead)}
                >
                  <div className="crm-row-main">
                    <span className="crm-row-name">{lead.name}</span>
                    <span className={`adm-tag ${statusCss[lead.status]}`}>{statusLabel[lead.status]}</span>
                  </div>
                  <div className="crm-row-sub">{lead.vehicle_label ?? "—"}</div>
                  <div className="crm-row-meta">{formatDate(lead.created_at)}</div>
                </button>
              ))
            )}
          </div>
          {totalPages > 1 && (
            <div className="adm-pagination">
              <span>{from}–{to} de {filteredAll.length}</span>
              <div className="adm-pagination-btns">
                <button className="adm-pagination-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>← Ant.</button>
                <button className="adm-pagination-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Próx. →</button>
              </div>
            </div>
          )}
        </div>

        {selected ? (
          <div className="adm-card">
            <div className="adm-card-head adm-card-head--static">
              <h3 className="adm-card-title">{selected.name}</h3>
              <button className="crm-close" onClick={() => setSelected(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="crm-detail-body">
              <div className="crm-info-grid">
                <div className="crm-info-item">
                  <Phone size={14} />
                  <a href={`tel:${selected.phone}`} className="crm-info-link">{selected.phone}</a>
                </div>
                {selected.email && (
                  <div className="crm-info-item">
                    <Mail size={14} />
                    <a href={`mailto:${selected.email}`} className="crm-info-link">{selected.email}</a>
                  </div>
                )}
                {selected.vehicle_label && (
                  <div className="crm-info-item">
                    <Car size={14} />
                    <span>{selected.vehicle_label}</span>
                  </div>
                )}
                <div className="crm-info-item">
                  <Calendar size={14} />
                  <span>{formatDate(selected.created_at)}</span>
                </div>
              </div>

              {selected.notes && (
                <div className="crm-section">
                  <p className="crm-section-label">Observações</p>
                  <p className="crm-obs">{selected.notes}</p>
                </div>
              )}

              <form action={updateLeadAction} className="crm-section">
                <input type="hidden" name="id" value={selected.id} />
                <input type="hidden" name="name" value={selected.name} />
                <input type="hidden" name="phone" value={selected.phone} />
                <input type="hidden" name="email" value={selected.email ?? ""} />
                <input type="hidden" name="vehicle_label" value={selected.vehicle_label ?? ""} />
                <input type="hidden" name="source" value={selected.source} />
                <input type="hidden" name="notes" value={selected.notes ?? ""} />
                <p className="crm-section-label">Status</p>
                <select
                  className="adm-input"
                  name="status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Status)}
                >
                  <option value="novo">Novo</option>
                  <option value="contato">Contato</option>
                  <option value="proposta">Proposta</option>
                  <option value="fechado">Fechado</option>
                  <option value="perdido">Perdido</option>
                </select>
                <div className="crm-detail-foot">
                  <button className="adm-btn-primary" type="submit">
                    <Save size={14} /> Salvar
                  </button>
                </div>
              </form>

              <form action={deleteLeadAction} style={{ borderTop: "1px solid oklch(0.28 0.01 260 / 40%)", paddingTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                <input type="hidden" name="id" value={selected.id} />
                <button className="adm-btn-danger" type="submit">
                  <Trash2 size={14} /> Excluir lead
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="crm-placeholder adm-card">
            <div className="adm-empty">Selecione um lead para ver os detalhes</div>
          </div>
        )}
      </div>
    </>
  );
}
