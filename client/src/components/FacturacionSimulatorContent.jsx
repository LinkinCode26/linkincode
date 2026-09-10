import { useState } from "react";

const IVA = 0.21;

const crearItem = () => ({
  id: crypto.randomUUID(),
  descripcion: "",
  cantidad: 1,
  precio: 0,
});

const formatearMonto = (n) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function generarCAE() {
  const numero = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join("");
  const vencimiento = new Date();
  vencimiento.setDate(vencimiento.getDate() + 10);
  return {
    numero,
    vencimiento: vencimiento.toLocaleDateString("es-AR"),
  };
}

export function FacturacionSimulatorContent() {
  const [cliente, setCliente] = useState({ nombre: "", cuit: "", condicion: "Consumidor final" });
  const [tipoComprobante, setTipoComprobante] = useState("B");
  const [items, setItems] = useState([crearItem()]);
  const [comprobante, setComprobante] = useState(null);
  const [error, setError] = useState("");

  const subtotal = items.reduce((acc, it) => acc + it.cantidad * it.precio, 0);
  const iva = subtotal * IVA;
  const total = subtotal + iva;

  const actualizarItem = (id, campo, valor) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [campo]: valor } : it)));
  };

  const agregarItem = () => setItems((prev) => [...prev, crearItem()]);

  const quitarItem = (id) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
  };

  const emitir = () => {
    if (!cliente.nombre.trim()) {
      setError("Falta el nombre o razón social del cliente.");
      return;
    }
    if (items.some((it) => !it.descripcion.trim() || it.precio <= 0)) {
      setError("Revisá que todos los ítems tengan descripción y precio.");
      return;
    }
    setError("");
    setComprobante({ ...generarCAE(), tipo: tipoComprobante, cliente: cliente.nombre, total });
  };

  const nuevaFactura = () => {
    setCliente({ nombre: "", cuit: "", condicion: "Consumidor final" });
    setTipoComprobante("B");
    setItems([crearItem()]);
    setComprobante(null);
    setError("");
  };

  if (comprobante) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-mute">Factura {comprobante.tipo}</span>
          <span className="rounded-full border border-accent px-2 py-0.5 text-xs font-medium text-accent">
            autorizada
          </span>
        </div>
        <p className="font-display text-xl font-semibold">{comprobante.cliente}</p>
        <p className="mt-1 text-2xl font-bold text-ink">{formatearMonto(comprobante.total)}</p>
        <div className="mt-6 space-y-1 border-t border-line pt-4 text-xs text-mute">
          <p>CAE {comprobante.numero}</p>
          <p>Vence {comprobante.vencimiento}</p>
        </div>
        <button onClick={nuevaFactura} className="mt-6 text-xs font-medium text-brand hover:underline">
          ← nueva factura
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <section>
        <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">Cliente</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
            placeholder="Nombre o razón social"
            className="col-span-2 bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-brand transition-colors"
          />
          <input
            value={cliente.cuit}
            onChange={(e) => setCliente({ ...cliente, cuit: e.target.value })}
            placeholder="CUIT / DNI"
            className="bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-brand transition-colors"
          />
          <select
            value={cliente.condicion}
            onChange={(e) => setCliente({ ...cliente, condicion: e.target.value })}
            className="bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
          >
            <option>Consumidor final</option>
            <option>Responsable inscripto</option>
            <option>Monotributista</option>
          </select>
        </div>
      </section>

      <section>
        <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">Tipo de comprobante</label>
        <div className="flex gap-2">
          {["A", "B", "C"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipoComprobante(t)}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors ${
                tipoComprobante === t ? "border-brand bg-brand text-white" : "border-line text-mute hover:text-ink"
              }`}
            >
              Factura {t}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-mute">Ítems</label>
          <button type="button" onClick={agregarItem} className="text-xs font-bold text-brand hover:underline">
            + agregar ítem
          </button>
        </div>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-[1fr_56px_96px_20px] items-center gap-2">
              <input
                value={it.descripcion}
                onChange={(e) => actualizarItem(it.id, "descripcion", e.target.value)}
                placeholder="Descripción"
                className="bg-surface border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-brand transition-colors"
              />
              <input
                type="number"
                min={1}
                value={it.cantidad}
                onChange={(e) => actualizarItem(it.id, "cantidad", Number(e.target.value))}
                className="bg-surface border border-line rounded-lg px-2 py-2 text-right text-sm text-ink focus:outline-none focus:border-brand transition-colors"
              />
              <input
                type="number"
                min={0}
                value={it.precio}
                onChange={(e) => actualizarItem(it.id, "precio", Number(e.target.value))}
                placeholder="Precio"
                className="bg-surface border border-line rounded-lg px-2 py-2 text-right text-sm text-ink placeholder:text-mute focus:outline-none focus:border-brand transition-colors"
              />
              <button
                type="button"
                onClick={() => quitarItem(it.id)}
                aria-label="Quitar ítem"
                className="text-sm text-red-400 hover:opacity-70"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="p-4 rounded-xl bg-surface/60 border border-line text-sm">
        <div className="flex justify-between text-mute">
          <span>Subtotal</span>
          <span>{formatearMonto(subtotal)}</span>
        </div>
        <div className="flex justify-between text-mute">
          <span>IVA (21%)</span>
          <span>{formatearMonto(iva)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
          <span>Total</span>
          <span>{formatearMonto(total)}</span>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={emitir}
        className="w-full rounded-xl bg-gradient-to-br from-brand to-accent py-3 font-display text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        Emitir factura
      </button>
    </div>
  );
}

export default FacturacionSimulatorContent;
