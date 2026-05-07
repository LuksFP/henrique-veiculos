"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/veiculos", label: "Veículos", icon: "🚗" },
  { to: "/admin/cadastro", label: "Cadastrar", icon: "➕" },
  { to: "/admin/crm", label: "CRM", icon: "📞" },
  { to: "/admin/financeiro", label: "Financeiro", icon: "💰" },
  { to: "/admin/vendas", label: "Vendas", icon: "🧾" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col"
      style={{
        borderRight: "1px solid var(--sidebar-border)",
        background: "var(--sidebar)",
      }}
    >
      <div
        className="flex h-16 items-center gap-2 px-4"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ background: "var(--sidebar-primary)" }}
        >
          <span
            className="text-sm font-bold"
            style={{
              fontFamily: "var(--font-heading, Rajdhani, sans-serif)",
              color: "var(--sidebar-primary-foreground)",
            }}
          >
            H
          </span>
        </div>
        <div>
          <span
            className="text-sm font-bold"
            style={{
              fontFamily: "var(--font-heading, Rajdhani, sans-serif)",
              color: "var(--sidebar-foreground)",
            }}
          >
            HENRIQUE
          </span>
          <span
            className="ml-1 text-xs font-light"
            style={{ color: "var(--sidebar-primary)" }}
          >
            ADMIN
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const isActive =
            item.to === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              href={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
              style={
                isActive
                  ? {
                      background: "var(--neon-muted)",
                      color: "var(--primary)",
                    }
                  : {
                      color: "oklch(0.97 0.005 260 / 70%)",
                    }
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
          style={{ color: "oklch(0.97 0.005 260 / 70%)" }}
        >
          <span className="text-base">🌐</span>
          Ver Site
        </Link>
      </div>
    </aside>
  );
}
