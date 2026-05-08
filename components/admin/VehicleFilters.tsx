"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const inputClass = {
  borderRadius: "0.5rem",
  border: "1px solid var(--input)",
  background: "var(--input)",
  color: "var(--foreground)",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  outline: "none",
} as const;

export function VehicleFilters({
  q,
  status,
  total,
  showing,
}: {
  q: string;
  status: string;
  total: number;
  showing: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <input
        type="search"
        placeholder="Buscar por marca ou modelo..."
        defaultValue={q}
        onChange={(e) => update("q", e.target.value)}
        style={{ ...inputClass, minWidth: "220px" }}
      />
      <select
        defaultValue={status}
        onChange={(e) => update("status", e.target.value)}
        style={inputClass}
      >
        <option value="">Todos os status</option>
        <option value="available">Disponível</option>
        <option value="sold">Vendido</option>
        <option value="featured">Destaque</option>
      </select>
      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        Mostrando {showing} de {total}
      </span>
    </div>
  );
}
