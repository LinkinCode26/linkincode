// Constantes y helpers compartidos por el store y los paneles del admin del
// simulador de E-commerce. 

export const ORDER_STATUSES = [
  "new",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];
export const PAYMENT_STATUSES = ["pending", "paid", "rejected"];
export const PAYMENT_METHOD_IDS = ["mercadopago", "card", "transfer"];

// Colores de estado: mismo patrón que LeadsPanel (texto con contraste AA en
// los dos temas y borde con `border-current` para superar 3:1, ver
// design-tokens.md).
const TONE_BADGE = {
  brand:
    "bg-brand/15 border-current text-brand [[data-theme=light]_&]:text-brand-text",
  amber:
    "bg-amber-500/15 border-current text-amber-400 [[data-theme=light]_&]:text-amber-800",
  indigo:
    "bg-indigo-500/15 border-current text-indigo-300 [[data-theme=light]_&]:text-indigo-800",
  emerald:
    "bg-emerald-500/15 border-current text-emerald-400 [[data-theme=light]_&]:text-emerald-800",
  red: "bg-red-500/15 border-current text-red-400 [[data-theme=light]_&]:text-red-700",
};

const TONE_BAR = {
  brand: "bg-brand",
  amber: "bg-amber-500",
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
};

export const ORDER_STATUS_TONE = {
  new: "brand",
  preparing: "amber",
  shipped: "indigo",
  delivered: "emerald",
  cancelled: "red",
};

export const PAYMENT_STATUS_TONE = {
  pending: "amber",
  paid: "emerald",
  rejected: "red",
};

export const badgeClasses = (tone) => TONE_BADGE[tone] ?? TONE_BADGE.brand;
export const barClasses = (tone) => TONE_BAR[tone] ?? TONE_BAR.brand;

// Una venta "vigente" es la que no se cayó: ni cancelada ni con pago rechazado.
// Define qué suma a la facturación, a las compras y al total gastado.
export const isActiveOrder = (order) =>
  order.orderStatus !== "cancelled" && order.paymentStatus !== "rejected";

// "out" = agotado, "low" = quedan pocas unidades, "ok" = stock suficiente.
export const getStockLevel = (product) => {
  if (product.stock <= 0) return "out";
  if (product.stock <= product.lowStockThreshold) return "low";
  return "ok";
};

export const formatPrice = (value, locale) =>
  `$${Number(value || 0).toLocaleString(locale)}`;

export const formatDate = (iso, locale) =>
  new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (iso, locale) =>
  new Date(iso).toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const productNameKey = (id) =>
  `solutions.simulator.ecommerce.products.${id}`;

// Los productos originales se traducen con t(clave); los creados desde el
// admin no tienen clave. t() devuelve la CLAVE cuando falta (no el fallback
// con ||), por eso los nuevos nunca llaman a t() y usan su propio nombre.
// Sirve para productos ({ id }) y para ítems de pedido ({ productId }).
export const getDisplayName = (t, entity) => {
  if (!entity.i18n) return entity.name;
  return t(productNameKey(entity.id ?? entity.productId), entity.name);
};

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const isValidImageUrl = (value) =>
  /^(https?:\/\/|data:image\/)/i.test(value);

// Imagen por defecto (SVG embebido: no depende de la red).
export const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#334155"/><path d="M24 34l16-8 16 8v18l-16 8-16-8z M24 34l16 8 16-8 M40 42v18" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linejoin="round"/></svg>',
)}`;

// Si la URL de una foto falla, se cae a la imagen por defecto (sin loop).
export const handleImageError = (event) => {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = PLACEHOLDER_IMAGE;
};