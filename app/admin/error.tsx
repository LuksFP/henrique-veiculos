"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="admin-content">
      <div className="admin-card" style={{ maxWidth: 480 }}>
        <span className="admin-card-kicker">Falha ao carregar</span>
        <h2>Algo deu errado</h2>
        <p className="form-error">{error.message}</p>
        <button className="admin-button" type="button" onClick={reset}>
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
