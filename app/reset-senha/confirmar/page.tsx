import { updatePasswordAction } from "@/app/actions/auth";

const errors: Record<string, string> = {
  mismatch: "As senhas não coincidem.",
  weak: "A senha precisa ter pelo menos 8 caracteres.",
  failed: "Não foi possível salvar a senha. O link pode ter expirado.",
  "missing-env": "Configuração interna ausente.",
};

const inputStyle = {
  width: "100%",
  borderRadius: "0.5rem",
  border: "1px solid var(--input)",
  background: "var(--input)",
  color: "var(--foreground)",
  padding: "0.625rem 0.75rem",
  fontSize: "0.9rem",
  outline: "none",
} as const;

export default async function ConfirmarResetPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="login-page">
      <div className="login-grid" aria-hidden="true" />
      <div className="login-glow login-glow--tl" aria-hidden="true" />
      <div className="login-glow login-glow--br" aria-hidden="true" />

      <section className="login-card" aria-label="Nova senha">
        <div className="login-card-accent" aria-hidden="true" />

        <div className="login-brand">
          <div className="login-eyebrow">
            <span aria-hidden="true">—</span>
            HENRIQUE VEÍCULOS
            <span aria-hidden="true">—</span>
          </div>
          <div className="login-heading">
            <div className="login-heading-name">NOVA</div>
            <div className="login-heading-sub">SENHA</div>
          </div>
        </div>

        <div className="login-form-wrap">
          <form className="login-form" action={updatePasswordAction}>
            <div className="login-form-head">
              <h1 style={{ fontSize: "1.25rem" }}>Criar nova senha</h1>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                Mínimo 8 caracteres.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input
                name="password"
                type="password"
                minLength={8}
                required
                placeholder="Nova senha"
                autoComplete="new-password"
                style={inputStyle}
              />
              <input
                name="confirm_password"
                type="password"
                minLength={8}
                required
                placeholder="Confirmar nova senha"
                autoComplete="new-password"
                style={inputStyle}
              />
            </div>

            {error ? <p className="login-error" role="alert">{errors[error] ?? "Erro desconhecido."}</p> : null}

            <button className="login-btn" type="submit">SALVAR SENHA</button>
          </form>
        </div>
      </section>
    </main>
  );
}
