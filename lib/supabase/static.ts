import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { getSupabaseEnv } from "@/lib/env";

export function createStaticClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createClient<Database>(env.url, env.anonKey);
}
