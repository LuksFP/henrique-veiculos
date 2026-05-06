import { loginAction } from "@/app/actions/auth";
import { Mail } from "lucide-react";
import PasswordField from "./password-field";

const errors: Record<string, string> = {
  invalid: "E-mail ou senha inválidos.",
  "missing-env": "Variáveis do Supabase não configuradas.",
  "not-admin": "Usuário autenticado, mas sem permissão de admin.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const message = params.error ? errors[params.error] : null;

  return (
    <main className="login-page">
      <div className="login-grid" aria-hidden="true" />
      <div className="login-glow login-glow--tl" aria-hidden="true" />
      <div className="login-glow login-glow--br" aria-hidden="true" />

      <section className="login-card" aria-label="Acesso administrativo">
        <div className="login-card-accent" aria-hidden="true" />

        <div className="login-brand">
          <div className="login-shield" aria-hidden="true">
            <svg width="54" height="58" viewBox="0 0 54 58" fill="none">
              <path
                d="M27 3L5 12.5V31C5 42.8 14.7 53.7 27 56.5C39.3 53.7 49 42.8 49 31V12.5L27 3Z"
                fill="rgba(134,225,0,0.1)"
                stroke="rgba(134,225,0,0.62)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <rect x="20" y="30" width="14" height="11" rx="2" stroke="#86e100" strokeWidth="1.5" fill="rgba(134,225,0,0.08)" />
              <path d="M23 30v-4a4 4 0 018 0v4" stroke="#86e100" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="27" cy="35.5" r="1.8" fill="#86e100" />
            </svg>
          </div>

          <div className="login-eyebrow">
            <span aria-hidden="true">—</span>
            ÁREA RESTRITA
            <span aria-hidden="true">—</span>
          </div>

          <div className="login-heading">
            <div className="login-heading-name">HENRIQUE VEÍCULOS</div>
            <div className="login-heading-sub">ADMIN</div>
          </div>
        </div>

        <div className="login-form-wrap">
          <form className="login-form" action={loginAction}>
            <div className="login-form-head">
              <h1>Entrar</h1>
            </div>

            <div className="login-field">
              <span className="login-field-icon" aria-hidden="true">
                <Mail size={16} />
              </span>
              <input
                name="email"
                type="email"
                id="login-email"
                autoComplete="email"
                required
                placeholder="seu@email.com"
                className="login-input"
              />
            </div>

            <PasswordField />

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" name="remember" />
                <span>Lembrar-me</span>
              </label>
              <a href="#" className="login-forgot">Esqueci minha senha</a>
            </div>

            {message ? <p className="login-error" role="alert">{message}</p> : null}

            <button className="login-btn" type="submit">ENTRAR</button>
          </form>
        </div>
      </section>
    </main>
  );
}
