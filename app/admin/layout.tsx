import { Car, DollarSign, Users } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { ShowroomLogo } from "@/components/showroom-logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-title">
          <span>Painel</span>
          <h1>Admin</h1>
        </div>
        <form action={logoutAction}>
          <button className="admin-button secondary" type="submit">
            Sair
          </button>
        </form>
      </header>

      <nav className="admin-nav" aria-label="Seções do painel">
        <a className="admin-nav-item" href="/admin">
          <Car size={15} aria-hidden="true" /> Estoque
        </a>
        <a className="admin-nav-item" href="/admin/crm">
          <Users size={15} aria-hidden="true" /> CRM
        </a>
        <a className="admin-nav-item" href="/admin/financeiro">
          <DollarSign size={15} aria-hidden="true" /> Financeiro
        </a>
      </nav>

      {children}
    </div>
  );
}
