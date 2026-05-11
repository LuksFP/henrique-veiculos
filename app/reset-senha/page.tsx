import { resetPasswordAction } from "@/app/actions/auth";
import { Mail } from "lucide-react";

const errors: Record<string, string> = {
  invalid: "Informe um e-mail válido.",
  failed: "Não foi possível enviar o e-mail. Tente novamente.",
  "missing-env": "Configuração interna ausente.",
};

export default async function ResetSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <main className="login-page">
      <div className="login-grid" aria-hidden="true" />
      <div className="login-glow login-glow--tl" aria-hidden="true" />
      <div className="login-glow login-glow--br" aria-hidden="true" />

      <section className="login-card" aria-label="Redefinir senha">
        <div className="login-card-accent" aria-hidden="true" />

        <div className="login-brand">
          <div className="login-eyebrow">
            <span aria-hidden="true">—</span>
            HENRIQUE VEÍCULOS
            <span aria-hidden="true">—</span>
          </div>
          <div className="login-heading">
            <div className="login-heading-name">REDEFINIR</div>
            <div className="login-heading-sub">SENHA</div>
          </div>
        </div>

        <div className="login-form-wrap">
          {sent ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", color: "var(--primary)" }}>✓</div>
              <p style={{ color: "var(--foreground)", fontFamily: "Rajdhani, sans-serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                E-mail enviado!
              </p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Verifique sua caixa de entrada e clique no link recebido.
              </p>
              <a href="/login" className="login-forgot">← Voltar ao login</a>
            </div>
          ) : (
            <form className="login-form" action={resetPasswordAction}>
              <div className="login-form-head">
                <h1 style={{ fontSize: "1.25rem" }}>Esqueceu a senha?</h1>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  Informe o e-mail do admin para receber o link de redefinição.
                </p>
              </div>

              <div className="login-field">
                <span className="login-field-icon" aria-hidden="true"><Mail size={16} /></span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="seu@email.com"
                  className="login-input"
                />
              </div>

              {error ? <p className="login-error" role="alert">{errors[error] ?? "Erro desconhecido."}</p> : null}

              <button className="login-btn" type="submit">ENVIAR LINK</button>

              <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
                <a href="/login" className="login-forgot">← Voltar ao login</a>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
