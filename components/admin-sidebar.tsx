"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, Plus, Phone, DollarSign, FileText, Globe, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/veiculos", label: "Veículos", icon: Car },
  { href: "/admin/veiculos", label: "Cadastrar", icon: Plus, action: "open-form" },
  { href: "/admin/crm", label: "CRM", icon: Phone },
  { href: "/admin/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/admin/vendas", label: "Vendas", icon: FileText },
];

const bottomNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/veiculos", label: "Veículos", icon: Car },
  { href: "/admin/crm", label: "CRM", icon: Phone },
  { href: "/admin/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/admin/vendas", label: "Vendas", icon: FileText },
];

export function AdminSidebar() {
  const path = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? path === href : path.startsWith(href);

  return (
    <>
      <aside className="adm-aside">
        <div className="adm-aside-head">
          <div className="adm-aside-icon">H</div>
          <div>
            <span className="adm-aside-brand">Henrique</span>
            <span className="adm-aside-tag">Admin</span>
          </div>
        </div>

        <nav className="adm-nav">
          {nav.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={label}
              href={href}
              className={`adm-nav-item ${isActive(href, exact) && label !== "Cadastrar" ? "is-active" : ""}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="adm-aside-foot">
          <Link href="/" className="adm-nav-item">
            <Globe size={16} />
            Ver Site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="adm-nav-item">
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <nav className="adm-bottom-nav" aria-label="Navegação mobile">
        {bottomNav.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={label}
            href={href}
            className={`adm-bottom-nav-item ${isActive(href, exact) ? "is-active" : ""}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
