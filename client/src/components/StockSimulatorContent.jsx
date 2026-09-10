import { useState } from "react";
import useLanguage from "../hooks/useLanguage";
import { products as initialProducts } from "../data/mock/products";

export const StockSimulatorContent = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState(initialProducts);

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

        return (
          <div
            key={product.id}
            className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
              isLowStock ? "bg-red-500/10 border-red-500/40" : "bg-surface border-line"
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-ink">{product.name}</span>
                <span className="text-xs text-mute">
                  ${product.price.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleStockChange(product.id, -1)}
                className="w-8 h-8 rounded-lg bg-bg border border-line text-red-400 font-bold hover:bg-red-400/10 hover:border-red-400/40 transition-colors cursor-pointer"
              >
                −
              </button>
              <span className="text-sm font-bold text-ink w-10 text-center">
                {product.stock} u.
              </span>
              <button
                type="button"
                onClick={() => handleStockChange(product.id, 1)}
                className="w-8 h-8 rounded-lg bg-bg border border-line text-emerald-500 font-bold hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors cursor-pointer"
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