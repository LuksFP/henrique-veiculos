"use client";

import { updateLeadStatusAction } from "@/app/actions/leads";
import { useRef } from "react";

const statusLabels: Record<string, string> = {
  novo: "Novo",
  contato: "Em Contato",
  em_negociacao: "Em Negociação",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateLeadStatusAction} className="flex items-center">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        className="rounded-md px-1 py-0.5 text-xs"
        style={{
          border: "1px solid var(--border)",
          background: "var(--input)",
          color: "var(--foreground)",
        }}
        onChange={() => formRef.current?.requestSubmit()}
      >
        {Object.entries(statusLabels).map(([v, label]) => (
          <option key={v} value={v}>{label}</option>
        ))}
      </select>
    </form>
  );
}
