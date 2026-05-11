"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  if (!supabase) {
    redirect("/login?error=missing-env");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=invalid");
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/login");
}

export async function resetPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/reset-senha?error=invalid");

  const supabase = await createClient();
  if (!supabase) redirect("/reset-senha?error=missing-env");

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-senha/confirmar`,
  });

  if (error) redirect("/reset-senha?error=failed");
  redirect("/reset-senha?sent=1");
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (password !== confirm) redirect("/reset-senha/confirmar?error=mismatch");
  if (password.length < 8) redirect("/reset-senha/confirmar?error=weak");

  const supabase = await createClient();
  if (!supabase) redirect("/reset-senha/confirmar?error=missing-env");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/reset-senha/confirmar?error=failed");

  redirect("/login?success=reset");
}
