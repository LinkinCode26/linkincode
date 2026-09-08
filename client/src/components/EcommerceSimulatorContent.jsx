import { useState } from "react";

const MOCK_PRODUCTS = [
  { id: 1, name: "Zapatillas Urban", price: 45000, icon: "fa-shoe-prints" },
  { id: 2, name: "Auriculares Pro", price: 85000, icon: "fa-headphones" },
  { id: 3, name: "Mochila Tech", price: 62000, icon: "fa-suitcase" },
];

export function EcommerceSimulatorContent() {
  const [simTitle, setSimTitle] = useState("");
  const [simColor, setSimColor] = useState("brand");
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  // Mapa de colores dinámicos para Tailwind
  const colorStyles = {
    brand: "bg-brand text-white hover:bg-brand/90",
    accent: "bg-accent text-white hover:bg-accent/90",
    indigo: "bg-indigo-500 text-white hover:bg-indigo-600",
    emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  };

  const activeColorStyle = colorStyles[simColor] || colorStyles.brand;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Controles de Configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface p-4 rounded-2xl border border-line">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
            Nombre de tu tienda
          </label>
          <input
            type="text"
            value={simTitle}
            onChange={(e) => setSimTitle(e.target.value)}
            placeholder="Ej: Tienda Tech..."
            className="w-full bg-bg border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
            Color de marca
          </label>
          <div className="flex gap-3 mt-2">
            {Object.keys(colorStyles).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSimColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  simColor === c
                    ? "scale-110 border-white shadow-lg"
                    : "border-transparent opacity-70"
                } ${c === "brand" ? "bg-brand" : c === "accent" ? "bg-accent" : `bg-${c}-500`}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vista Previa de la Tienda (Mock) */}
      <div className="flex flex-col border border-line rounded-2xl overflow-hidden bg-bg">
        {/* Header E-commerce */}
        <div className="flex justify-between items-center p-4 border-b border-line bg-surface/50">
          <span className="font-display font-bold text-lg text-ink">
            {simTitle || "Mi Tienda"}
          </span>
          <div className="relative flex items-center gap-2">
            <i className="fas fa-shopping-cart text-mute" />
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeColorStyle}`}
            >
              {cart.length}
            </span>
            <span className="text-sm font-bold text-ink ml-2">
              ${cartTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Grilla de Productos */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center p-4 border border-line rounded-xl bg-surface"
            >
              <i className={`fas ${product.icon} text-3xl text-mute mb-3`} />
              <span className="text-sm font-bold text-ink text-center mb-1">
                {product.name}
              </span>
              <span className="text-xs text-mute mb-4">
                ${product.price.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => handleAddToCart(product)}
                className={`w-full py-2 text-xs font-bold rounded-lg transition-colors ${activeColorStyle}`}
              >
                Agregar
              </button>
            </div>
          ))}
        </div>

        {/* Mini Carrito Desplegable (Solo si hay items) */}
        {cart.length > 0 && (
          <div className="p-4 bg-surface/30 border-t border-line">
            <p className="text-xs font-bold uppercase text-mute mb-3">
              Resumen del carrito
            </p>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm border-b border-line/50 pb-2"
                >
                  <span className="text-ink">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      ${item.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Quitar producto"
                    >
                      <i className="fas fa-trash-alt text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EcommerceSimulatorContent;
