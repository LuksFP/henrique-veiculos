import { loginAction } from "@/app/actions/auth";
import { Mail, ShieldCheck } from "lucide-react";
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
      <div className="login-glow login-glow--tl" aria-hidden="true" />
      <div className="login-glow login-glow--br" aria-hidden="true" />

      <div className="login-card">
        <div className="login-shield" aria-hidden="true">
          <svg width="54" height="58" viewBox="0 0 54 58" fill="none">
            <path
              d="M27 3L5 12.5V31C5 42.8 14.7 53.7 27 56.5C39.3 53.7 49 42.8 49 31V12.5L27 3Z"
              fill="rgba(134,225,0,0.1)"
              stroke="rgba(134,225,0,0.55)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <rect x="20" y="30" width="14" height="11" rx="2" stroke="#86e100" strokeWidth="1.5" fill="rgba(134,225,0,0.08)" />
            <path d="M23 30v-4a4 4 0 018 0v4" stroke="#86e100" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="27" cy="35.5" r="1.8" fill="#86e100" />
          </svg>
        </div>

        <div className="login-eyebrow" aria-label="Área restrita">
          <span aria-hidden="true">—</span>
          ÁREA RESTRITA
          <span aria-hidden="true">—</span>
        </div>

        <div className="login-heading">
          <div className="login-heading-admin">ADMIN</div>
          <div className="login-heading-name">HENRIQUE</div>
          <div className="login-heading-sub">— VEÍCULOS —</div>
        </div>

        <form className="login-form" action={loginAction}>
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

        <div className="login-footer">
          <ShieldCheck size={14} className="login-footer-icon" />
          <span>Acesso restrito e monitorado</span>
          <small>© 2025 Henrique Veículos · Guarujá SP</small>
        </div>
      </div>
    </main>
  );
}
