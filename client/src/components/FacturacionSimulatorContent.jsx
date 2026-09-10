import { useState, useContext } from "react";
import { LanguageContext } from "../context/language-context.js";

const IVA_RATE = 0.21;

const crearItem = () => ({
  id: crypto.randomUUID(),
  descripcion: "",
  cantidad: 1,
  precio: 0,
});

// Mantiene ARS siempre
const formatearMonto = (n, lang = "es") =>
  n.toLocaleString(lang === "en" ? "en-US" : "es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

function generarCAE(lang = "es") {
  const numero = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join("");
  const vencimiento = new Date();
  vencimiento.setDate(vencimiento.getDate() + 10);
  return {
    numero,
    vencimiento: vencimiento.toLocaleDateString(lang === "en" ? "en-US" : "es-AR"),
  };
}

export function FacturacionSimulatorContent() {  
  const { t, lang } = useContext(LanguageContext);

  const b = (key) => t(`solutions.simulator.billing.${key}`);

  const [cliente, setCliente] = useState({ nombre: "", cuit: "", condicion: "finalConsumer" });
  const [tipoComprobante, setTipoComprobante] = useState("B");
  const [items, setItems] = useState([crearItem()]);
  const [comprobante, setComprobante] = useState(null);
  const [error, setError] = useState("");

  const subtotal = items.reduce((acc, it) => acc + it.cantidad * it.precio, 0);
  const iva = subtotal * IVA_RATE;
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
      setError(b("errorMissingClient"));
      return;
    }
    if (items.some((it) => !it.descripcion.trim() || it.precio <= 0)) {
      setError(b("errorMissingItems"));
      return;
    }
    setError("");
    setComprobante({ ...generarCAE(lang), tipo: tipoComprobante, cliente: cliente.nombre, total });
  };

  const nuevaFactura = () => {
    setCliente({ nombre: "", cuit: "", condicion: "finalConsumer" });
    setTipoComprobante("B");
    setItems([crearItem()]);
    setComprobante(null);
    setError("");
  };

  if (comprobante) {
    return (
      <div className="w-full max-w-xl mx-auto rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-mute">
            {b("invoiceLabel")} {comprobante.tipo}
          </span>
          <span className="rounded-full border border-accent px-2 py-0.5 text-xs font-medium text-accent">
            {b("authorizedBadge")}
          </span>
        </div>
        <p className="font-display text-lg sm:text-xl font-semibold break-words">{comprobante.cliente}</p>
        <p className="mt-1 text-2xl font-bold text-ink">{formatearMonto(comprobante.total, lang)}</p>
        <div className="mt-6 space-y-1 border-t border-line pt-4 text-xs text-mute">
          <p>{b("caeLabel")} {comprobante.numero}</p>
          <p>{b("dueLabel")} {comprobante.vencimiento}</p>
        </div>
        <button onClick={nuevaFactura} className="mt-6 text-xs font-medium text-brand hover:underline">
          {b("newInvoice")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-4 w-full max-w-xl mx-auto">
      {/* Sección Cliente */}
      <section>
        <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
          {b("clientSection")}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
            placeholder={b("clientNamePlaceholder")}
            className="sm:col-span-2 bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-brand transition-colors"
          />
          <input
            value={cliente.cuit}
            onChange={(e) => setCliente({ ...cliente, cuit: e.target.value })}
            placeholder={b("taxIdPlaceholder")}
            className="bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-brand transition-colors"
          />
          <select
            value={cliente.condicion}
            onChange={(e) => setCliente({ ...cliente, condicion: e.target.value })}
            className="bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
          >
            <option value="finalConsumer">{b("taxConditions.finalConsumer")}</option>
            <option value="registered">{b("taxConditions.registered")}</option>
            <option value="monotax">{b("taxConditions.monotax")}</option>
          </select>
        </div>
      </section>

      {/* Tipo de comprobante */}
      <section>
        <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
          {b("voucherSection")}
        </label>
        <div className="flex gap-2">
          {["A", "B", "C"].map((tLetter) => (
            <button
              key={tLetter}
              type="button"
              onClick={() => setTipoComprobante(tLetter)}
              className={`flex-1 rounded-xl border py-2.5 text-xs sm:text-sm font-bold transition-colors ${
                tipoComprobante === tLetter ? "border-brand bg-brand text-white" : "border-line text-mute hover:text-ink"
              }`}
            >
              {b("invoiceLabel")} {tLetter}
            </button>
          ))}
        </div>
      </section>

      {/* Ítems */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-mute">
            {b("itemsSection")}
          </label>
          <button type="button" onClick={agregarItem} className="text-xs font-bold text-brand hover:underline">
            {b("addItem")}
          </button>
        </div>
        <div className="space-y-3 sm:space-y-2">
          {items.map((it) => (
            <div 
              key={it.id} 
              className="flex flex-wrap sm:grid sm:grid-cols-[1fr_64px_110px_32px] items-center gap-2 bg-surface/30 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-line/40 sm:border-0"
            >
              <input
                value={it.descripcion}
                onChange={(e) => actualizarItem(it.id, "descripcion", e.target.value)}
                placeholder={b("descriptionPlaceholder")}
                className="w-full sm:w-auto flex-1 bg-surface border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-brand transition-colors"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <input
                  type="number"
                  min={1}
                  value={it.cantidad}
                  onChange={(e) => actualizarItem(it.id, "cantidad", Number(e.target.value))}
                  className="w-16 sm:w-full bg-surface border border-line rounded-lg px-2 py-2 text-right text-sm text-ink focus:outline-none focus:border-brand transition-colors"
                />
                <input
                  type="number"
                  min={0}
                  value={it.precio}
                  onChange={(e) => actualizarItem(it.id, "precio", Number(e.target.value))}
                  placeholder={b("pricePlaceholder")}
                  className="w-28 sm:w-full bg-surface border border-line rounded-lg px-2 py-2 text-right text-sm text-ink placeholder:text-mute focus:outline-none focus:border-brand transition-colors"
                />
                <button
                  type="button"
                  onClick={() => quitarItem(it.id)}
                  aria-label={b("removeItem")}
                  className="h-8 w-8 flex items-center justify-center text-base text-red-400 hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Totales */}
      <section className="p-4 rounded-xl bg-surface/60 border border-line text-sm">
        <div className="flex justify-between text-mute">
          <span>{b("subtotal")}</span>
          <span>{formatearMonto(subtotal, lang)}</span>
        </div>
        <div className="flex justify-between text-mute">
          <span>{b("vat")}</span>
          <span>{formatearMonto(iva, lang)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
          <span>{b("total")}</span>
          <span>{formatearMonto(total, lang)}</span>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={emitir}
        className="w-full rounded-xl bg-gradient-to-br from-brand to-accent py-3 font-display text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        {b("emitButton")}
      </button>
    </div>
  );
}

export default FacturacionSimulatorContent;