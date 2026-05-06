import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type AdminClient = SupabaseClient<Database>;

export async function requireAdmin(): Promise<AdminClient> {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=missing-env");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("is_admin")
    .eq("user_id", user.id)
    .eq("is_admin", true)
    .maybeSingle();
  if (!admin?.is_admin) redirect("/login?error=not-admin");

  return supabase;
}
