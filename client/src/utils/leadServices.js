import { SERVICES } from "../data/services.js";

// Se clasifica por palabra clave y no por texto exacto: `tipoProyecto` depende
// del idioma del formulario y también puede llegar con variantes
// ("Landing Page" vs "Landing Pages"). Los patrones son compatibles con JS y
// con $regex de MongoDB (PCRE), así que sirven igual para contar y para filtrar.
const SERVICE_PATTERNS = {
  landing: "landing",
  ecommerce: "e-?commerce",
  api: "\\bapis?\\b",
  dashboard: "dashboard",
  stock: "stock",
  staff: "personal|staff",
  billing: "factura|billing|invoice",
};

const SERVICE_REGEXES = SERVICES.map((service) => ({
  id: service.id,
  regex: new RegExp(SERVICE_PATTERNS[service.id], "i"),
}));

// "Proyecto a medida" y cualquier texto desconocido devuelven null.
export const getServiceIdFromLabel = (label) =>
  SERVICE_REGEXES.find(({ regex }) => regex.test(String(label ?? "")))?.id ??
  null;

// Patrón para el query param `tipoProyecto` (la API lo usa con $regex, "i").
export const buildServiceFilter = (serviceId) => SERVICE_PATTERNS[serviceId];

// rows: [{ tipoProyecto, total }] de GET /api/leads/stats
export function countByService(rows) {
  const counts = { all: 0 };
  SERVICES.forEach((service) => {
    counts[service.id] = 0;
  });
  rows.forEach(({ tipoProyecto, total }) => {
    counts.all += total;
    const id = getServiceIdFromLabel(tipoProyecto);
    if (id) counts[id] += total;
  });
  return counts;
}