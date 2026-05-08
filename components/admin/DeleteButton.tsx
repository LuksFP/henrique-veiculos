"use client";

import { useFormStatus } from "react-dom";

function Inner({ label = "🗑️" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md px-2 py-1 text-xs transition-all"
      style={{
        border: "1px solid var(--border)",
        color: "oklch(0.58 0.22 27)",
        opacity: pending ? 0.5 : 1,
        cursor: pending ? "not-allowed" : "pointer",
      }}
      onClick={(e) => {
        if (!window.confirm("Tem certeza que deseja excluir? Esta ação não pode ser desfeita.")) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "..." : label}
    </button>
  );
}

export function DeleteButton({
  action,
  id,
  extraFields,
  label,
}: {
  action: (formData: FormData) => Promise<void> | void;
  id: string;
  extraFields?: Record<string, string>;
  label?: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {extraFields &&
        Object.entries(extraFields).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      <Inner label={label} />
    </form>
  );
}
