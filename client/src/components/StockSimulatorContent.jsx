import { useState } from "react";
import useLanguage from "../hooks/useLanguage";
import { products as initialProducts } from "../data/mock/products";

export const StockSimulatorContent = () => {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState(initialProducts);
  const lowStockLabel = lang === "en" ? "Low stock" : "Stock bajo";

  const handleStockChange = (productId, delta) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, stock: Math.max(0, product.stock + delta) }
          : product,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6 py-2">
     {products.map((product) => {
  const isLowStock = product.stock <= product.lowStockThreshold;
  const translatedName = t(`solutions.simulator.stock.products.${product.id}`) || product.name;

  return (
    <div
      key={product.id}
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border transition-colors ${
        isLowStock ? "bg-red-500/10 border-red-500/40" : "bg-surface border-line"
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={product.image}
          alt={translatedName}
          className="w-14 h-14 object-cover rounded-lg"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-ink leading-tight sm:truncate">{translatedName}</span>
            {isLowStock && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-red-500 [[data-theme=light]_&]:text-red-700">
                {lowStockLabel}
              </span>
            )}
          </div>
          <span className="text-xs text-mute">
            ${product.price.toLocaleString("es-AR")}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <button
          type="button"
          onClick={() => handleStockChange(product.id, -1)}
          aria-label={`Restar una unidad de ${translatedName}`}
          className="w-8 h-8 rounded-lg bg-bg border border-line text-red-400 [[data-theme=light]_&]:text-red-700 font-bold hover:bg-red-400/10 hover:border-red-400/40 transition-colors cursor-pointer"
        >
          −
        </button>
        <span className="text-sm font-bold text-ink w-10 text-center">
          {product.stock} {t('solutions.simulator.stock.units')}
        </span>
        <button
          type="button"
          onClick={() => handleStockChange(product.id, 1)}
          aria-label={`Sumar una unidad de ${translatedName}`}
          className="w-8 h-8 rounded-lg bg-bg border border-line text-emerald-500 [[data-theme=light]_&]:text-emerald-700 font-bold hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
})}
    </div>
  );
};

export default StockSimulatorContent;