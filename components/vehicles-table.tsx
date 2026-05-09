"use client";

import { useState, useMemo, useEffect } from "react";

const PAGE_SIZE = 20;
import { Save, Search, Trash2, Plus } from "lucide-react";
import {
  updateVehicleAction,
  deleteVehicleAction,
  addVehicleImagesAction,
  deleteVehicleImageAction,
} from "@/app/actions/vehicles";
import { ShowroomLogo } from "@/components/showroom-logo";
import { vehicleImage } from "@/lib/vehicle-shared";
import type { VehicleImageRow, VehicleRow } from "@/lib/database.types";

type VehicleWithImages = VehicleRow & { vehicle_images: VehicleImageRow[] };

function Fields({ v }: { v: VehicleRow }) {
  return (
    <>
      <input type="hidden" name="id" value={v.id} />
      <input type="hidden" name="current_image_path" value={v.image_path ?? ""} />
      <div className="adm-field"><label className="adm-label">Marca</label><input className="adm-input" name="make" defaultValue={v.make} required /></div>
      <div className="adm-field"><label className="adm-label">Ano</label><input className="adm-input" name="year" type="number" min="1900" max="2100" defaultValue={v.year} required /></div>
      <div className="adm-field"><label className="adm-label">Modelo</label><input className="adm-input" name="model" defaultValue={v.model} required /></div>
      <div className="adm-field"><label className="adm-label">Preço</label><input className="adm-input" name="price" defaultValue={v.price} placeholder="R$ 75.990" required /></div>
      <div className="adm-field"><label className="adm-label">Km</label><input className="adm-input" name="km" defaultValue={v.km ?? ""} placeholder="44.109" /></div>
      <div className="adm-field"><label className="adm-label">Combustível</label><input className="adm-input" name="fuel" defaultValue={v.fuel} required /></div>
      <div className="adm-field"><label className="adm-label">Câmbio</label><input className="adm-input" name="transmission" defaultValue={v.transmission} required /></div>
      <div className="adm-field"><label className="adm-label">Cor</label><input className="adm-input" name="color" defaultValue={v.color ?? ""} /></div>
      <div className="adm-field"><label className="adm-label">Ordem</label><input className="adm-input" name="sort_order" type="number" defaultValue={v.sort_order} /></div>
      <div className="adm-field adm-field--wide"><label className="adm-label">Opcionais</label><textarea className="adm-input adm-textarea" name="options" defaultValue={v.options.join(", ")} placeholder="ABS, Airbag, Ar-condicionado" /></div>
      <div className="adm-field"><label className="adm-label">Fundo do card</label><input className="adm-input" name="bg" defaultValue={v.bg ?? ""} placeholder="linear-gradient(...)" /></div>
      <div className="adm-field"><label className="adm-label">Foto principal</label><input className="adm-input" name="image" type="file" accept="image/*" /></div>
      <div className="adm-checks">
        <label className="adm-check"><input name="is_featured" type="checkbox" defaultChecked={v.is_featured} />Destaque</label>
        <label className="adm-check"><input name="is_available" type="checkbox" defaultChecked={v.is_available} />Disponível</label>
      </div>
    </>
  );
}

export function VehiclesTable({ vehicles }: { vehicles: VehicleWithImages[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredAll = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      `${v.make} ${v.model} ${v.year} ${v.fuel} ${v.transmission} ${v.color ?? ""}`.toLowerCase().includes(q),
    );
  }, [vehicles, query]);

  useEffect(() => { setPage(1); }, [query]);

  const totalPages = Math.ceil(filteredAll.length / PAGE_SIZE);
  const filtered = filteredAll.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, filteredAll.length);

  return (
    <div className="adm-card">
      <div className="adm-card-head adm-card-head--static">
        <h2 className="adm-card-title">
          Estoque
          {query && (
            <span className="adm-search-count" style={{ marginLeft: 10 }}>
              {filtered.length} de {vehicles.length}
            </span>
          )}
        </h2>
      </div>

      <div className="adm-search-bar">
        <Search size={14} className="adm-search-icon" />
        <input
          className="adm-search-input"
          type="search"
          placeholder="Buscar por marca, modelo, ano, combustível..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {filteredAll.length > 0 && (
          <span className="adm-search-count">
            {query ? `${filteredAll.length} resultado${filteredAll.length !== 1 ? "s" : ""}` : `${vehicles.length} total`}
          </span>
        )}
      </div>

      {vehicles.length === 0 ? (
        <p className="adm-empty">Nenhum veículo cadastrado.</p>
      ) : filtered.length === 0 ? (
        <p className="adm-empty">Nenhum resultado para &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="adm-table">
          <div className="adm-table-head">
            <span>Veículo</span>
            <span>Preço</span>
            <span>Ano</span>
            <span>Km</span>
            <span>Status</span>
            <span style={{ textAlign: "right" }}>Ações</span>
          </div>
          {filtered.map((vehicle) => {
            const img = vehicleImage(vehicle);
            return (
              <details className="adm-table-row" key={vehicle.id}>
                <summary className="adm-table-cells">
                  <div className="adm-tc-vehicle">
                    <div className="adm-tc-thumb">
                      {img
                        ? <img src={img} alt={`${vehicle.make} ${vehicle.model}`} />
                        : <div className="adm-tc-placeholder"><ShowroomLogo /></div>
                      }
                    </div>
                    <div>
                      <div className="adm-tc-name">{vehicle.make} {vehicle.model}</div>
                      <div className="adm-tc-sub">{vehicle.fuel} · {vehicle.transmission}</div>
                    </div>
                  </div>
                  <span className="adm-tc-price">{vehicle.price}</span>
                  <span className="adm-tc-muted">{vehicle.year}</span>
                  <span className="adm-tc-muted">{vehicle.km ? `${vehicle.km} km` : "—"}</span>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    <span className={vehicle.is_available ? "adm-tag adm-tag--green" : "adm-tag adm-tag--red"}>
                      {vehicle.is_available ? "Disponível" : "Vendido"}
                    </span>
                    {vehicle.is_featured && <span className="adm-tag adm-tag--lime">★</span>}
                  </div>
                  <span className="adm-tc-edit-hint">Editar ›</span>
                </summary>

                <div className="adm-row-edit">
                  <form className="adm-form" action={updateVehicleAction}>
                    <Fields v={vehicle} />
                    <div className="adm-form-foot">
                      <button className="adm-btn-primary" type="submit"><Save size={15} /> Salvar</button>
                    </div>
                  </form>

                  <div className="adm-gallery-section">
                    <p className="adm-gallery-label">Galeria de fotos</p>
                    {vehicle.vehicle_images.length > 0 && (
                      <div className="adm-gallery-grid">
                        {vehicle.vehicle_images.map((gi) => (
                          <div key={gi.id} className="adm-gallery-item">
                            <img src={gi.url} alt="" />
                            <form className="adm-gallery-delete-form" action={deleteVehicleImageAction}>
                              <input type="hidden" name="id" value={gi.id} />
                              <input type="hidden" name="path" value={gi.path} />
                              <input type="hidden" name="vehicle_id" value={vehicle.id} />
                              <button className="adm-gallery-delete" type="submit">×</button>
                            </form>
                          </div>
                        ))}
                      </div>
                    )}
                    <form className="adm-gallery-add" action={addVehicleImagesAction}>
                      <input type="hidden" name="vehicle_id" value={vehicle.id} />
                      <div className="adm-field" style={{ flex: 1 }}>
                        <label className="adm-label">Adicionar fotos à galeria</label>
                        <input className="adm-input" type="file" name="images" multiple accept="image/*" />
                      </div>
                      <button className="adm-btn-primary" type="submit" style={{ flexShrink: 0, alignSelf: "flex-end" }}>
                        <Plus size={15} /> Adicionar
                      </button>
                    </form>
                  </div>

                  <form className="adm-row-delete" action={deleteVehicleAction}>
                    <input type="hidden" name="id" value={vehicle.id} />
                    <button className="adm-btn-danger" type="submit"><Trash2 size={15} /> Excluir veículo</button>
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="adm-pagination">
          <span>{from}–{to} de {filteredAll.length}</span>
          <div className="adm-pagination-btns">
            <button
              className="adm-pagination-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Anterior
            </button>
            <button
              className="adm-pagination-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
