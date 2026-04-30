import { loginAction } from "@/app/actions/auth";

const errors: Record<string, string> = {
  invalid: "E-mail ou senha inválidos.",
  "missing-env": "Variáveis do Supabase não configuradas.",
  "not-admin": "Usuário autenticado, mas sem permissão de admin.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const message = params.error ? errors[params.error] : null;

  return (
    <main className="login-page">
      <section className="login-panel">
        <span>Área restrita</span>
        <h1>Admin Henrique Veículos</h1>
        <form action={loginAction}>
          <label>
            E-mail
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Senha
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {message ? <p className="form-error">{message}</p> : null}
          <button className="admin-button" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
