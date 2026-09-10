// Métricas mock para el simulador de Dashboards (LC-026).
// Los textos (labels de fechas, categorías, KPIs) NO se guardan acá como
// string fijo: se guardan como id/índice y se traducen en el componente
// vía useLanguage, para soportar ES/EN igual que el resto del sitio.

export const DATE_RANGES = ["7d", "30d", "90d", "12m"];

const DATASETS = {
  "7d": {
    periodType: "weekdays",
    chartData: [
      { periodIndex: 0, ventas: 145000, visitas: 620, pedidos: 18 },
      { periodIndex: 1, ventas: 168000, visitas: 705, pedidos: 21 },
      { periodIndex: 2, ventas: 132000, visitas: 580, pedidos: 15 },
      { periodIndex: 3, ventas: 187000, visitas: 740, pedidos: 24 },
      { periodIndex: 4, ventas: 210000, visitas: 890, pedidos: 29 },
      { periodIndex: 5, ventas: 246000, visitas: 1020, pedidos: 34 },
      { periodIndex: 6, ventas: 198000, visitas: 860, pedidos: 26 },
    ],
    categoryData: [
      { id: "electronica", value: 420000 },
      { id: "ropa", value: 280000 },
      { id: "hogar", value: 190000 },
      { id: "otros", value: 96000 },
    ],
    kpis: [
      { id: "ventas", value: 1286000, format: "currency", delta: 8.4 },
      { id: "pedidos", value: 167, format: "number", delta: 5.1 },
      { id: "conversion", value: 3.8, format: "percent", delta: -0.4 },
      { id: "visitas", value: 5415, format: "number", delta: 12.2 },
    ],
  },
  "30d": {
    periodType: "weeks",
    chartData: [
      { periodIndex: 0, ventas: 820000, visitas: 4200, pedidos: 96 },
      { periodIndex: 1, ventas: 940000, visitas: 4800, pedidos: 112 },
      { periodIndex: 2, ventas: 1100000, visitas: 5100, pedidos: 128 },
      { periodIndex: 3, ventas: 1250000, visitas: 5600, pedidos: 141 },
    ],
    categoryData: [
      { id: "electronica", value: 1680000 },
      { id: "ropa", value: 1120000 },
      { id: "hogar", value: 780000 },
      { id: "otros", value: 430000 },
    ],
    kpis: [
      { id: "ventas", value: 4110000, format: "currency", delta: 14.6 },
      { id: "pedidos", value: 477, format: "number", delta: 9.8 },
      { id: "conversion", value: 3.2, format: "percent", delta: 0.6 },
      { id: "visitas", value: 19700, format: "number", delta: 11.3 },
    ],
  },
  "90d": {
    periodType: "quarterMonths",
    chartData: [
      { periodIndex: 0, ventas: 2860000, visitas: 13200, pedidos: 342 },
      { periodIndex: 1, ventas: 3310000, visitas: 14800, pedidos: 389 },
      { periodIndex: 2, ventas: 4110000, visitas: 19700, pedidos: 477 },
    ],
    categoryData: [
      { id: "electronica", value: 4560000 },
      { id: "ropa", value: 3120000 },
      { id: "hogar", value: 1980000 },
      { id: "otros", value: 1620000 },
    ],
    kpis: [
      { id: "ventas", value: 10280000, format: "currency", delta: 22.4 },
      { id: "pedidos", value: 1208, format: "number", delta: 17.2 },
      { id: "conversion", value: 3.5, format: "percent", delta: 1.1 },
      { id: "visitas", value: 47700, format: "number", delta: 19.5 },
    ],
  },
  "12m": {
    periodType: "monthsShort",
    chartData: [
      { periodIndex: 0, ventas: 820000, visitas: 4200, pedidos: 96 },
      { periodIndex: 1, ventas: 940000, visitas: 4800, pedidos: 112 },
      { periodIndex: 2, ventas: 1100000, visitas: 5100, pedidos: 128 },
      { periodIndex: 3, ventas: 1250000, visitas: 5600, pedidos: 141 },
      { periodIndex: 4, ventas: 1180000, visitas: 5400, pedidos: 134 },
      { periodIndex: 5, ventas: 1340000, visitas: 5950, pedidos: 152 },
      { periodIndex: 6, ventas: 1420000, visitas: 6200, pedidos: 163 },
      { periodIndex: 7, ventas: 1510000, visitas: 6480, pedidos: 172 },
      { periodIndex: 8, ventas: 1390000, visitas: 6100, pedidos: 158 },
      { periodIndex: 9, ventas: 1600000, visitas: 6800, pedidos: 181 },
      { periodIndex: 10, ventas: 1780000, visitas: 7300, pedidos: 205 },
      { periodIndex: 11, ventas: 2150000, visitas: 8600, pedidos: 248 },
    ],
    categoryData: [
      { id: "electronica", value: 7200000 },
      { id: "ropa", value: 5100000 },
      { id: "hogar", value: 3400000 },
      { id: "otros", value: 1780000 },
    ],
    kpis: [
      { id: "ventas", value: 17480000, format: "currency", delta: 28.9 },
      { id: "pedidos", value: 1890, format: "number", delta: 24.1 },
      { id: "conversion", value: 3.9, format: "percent", delta: 2.0 },
      { id: "visitas", value: 73330, format: "number", delta: 26.7 },
    ],
  },
};

export function getDashboardDataByRange(rangeId) {
  return DATASETS[rangeId] ?? DATASETS["30d"];
}

export default { DATE_RANGES, getDashboardDataByRange };