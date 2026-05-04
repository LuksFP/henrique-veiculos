export default function VehicleNotFound() {
  return (
    <main className="vp-main" style={{ textAlign: "center", paddingTop: "80px" }}>
      <span className="modal-eyebrow">404</span>
      <h1 className="modal-title" style={{ marginTop: 12 }}>
        Veículo não encontrado
      </h1>
      <p style={{ color: "#7a9554", marginBottom: 32 }}>
        Este veículo pode ter sido vendido ou removido do estoque.
      </p>
      <a className="modal-cta primary" href="/#estoque">
        Ver estoque disponível
      </a>
    </main>
  );
}
