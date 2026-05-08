"use client";

import { useEffect, useState } from "react";

const messages: Record<string, string> = {
  created: "Veículo cadastrado com sucesso!",
  updated: "Veículo atualizado com sucesso!",
  deleted: "Registro excluído com sucesso!",
  status: "Status atualizado!",
};

export function AlertBanner({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!visible || (!success && !error)) return null;

  const isSuccess = !!success;
  return (
    <div
      className="mb-4 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium"
      style={
        isSuccess
          ? { background: "var(--neon-muted)", color: "var(--primary)", border: "1px solid var(--primary)" }
          : { background: "oklch(0.58 0.22 27 / 10%)", color: "oklch(0.7 0.22 27)", border: "1px solid oklch(0.58 0.22 27 / 30%)" }
      }
    >
      <span>{isSuccess ? (messages[success!] ?? "Operação concluída!") : (error ?? "Ocorreu um erro.")}</span>
      <button onClick={() => setVisible(false)} className="ml-4 opacity-60 hover:opacity-100 text-base leading-none">×</button>
    </div>
  );
}
