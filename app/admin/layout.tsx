import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect("/login");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!adminUser?.is_admin) redirect("/login");

  return (
    <div className="admin-theme min-h-screen">
      <AdminSidebar />
      <main className="ml-60 min-h-screen p-6">{children}</main>
    </div>
  );
}
