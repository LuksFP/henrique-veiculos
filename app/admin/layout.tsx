import type { ReactNode } from "react";
import { Rajdhani } from "next/font/google";
import { AdminSidebar } from "@/components/admin-sidebar";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-raj",
  display: "swap",
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`adm-shell ${rajdhani.variable}`}>
      <AdminSidebar />
      <main className="adm-main">{children}</main>
    </div>
  );
}
