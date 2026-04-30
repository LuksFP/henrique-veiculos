import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !password) {
  console.error("Uso: node scripts/create-admin.mjs email@dominio.com senha-forte");
  process.exit(1);
}

if (!url || !serviceRoleKey) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error && error.status !== 422) {
  console.error(error.message);
  process.exit(1);
}

const user = data.user ?? (await supabase.auth.admin.listUsers()).data.users.find((candidate) => candidate.email === email);

if (!user) {
  console.error("Usuário não encontrado após criação.");
  process.exit(1);
}

const { error: profileError } = await supabase
  .from("admin_users")
  .upsert({ user_id: user.id, email, is_admin: true }, { onConflict: "user_id" });

if (profileError) {
  console.error(profileError.message);
  process.exit(1);
}

console.log(`Admin criado: ${email}`);
