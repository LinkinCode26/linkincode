// Métricas mock para el simulador de Dashboards (LC-026).
// chartData tiene una entrada por mes, para el gráfico con Recharts.
export const kpis = [
  { id: 'ventas', label: 'Ventas del mes', value: 1250000, format: 'currency' },
  { id: 'pedidos', label: 'Pedidos', value: 384, format: 'number' },
  { id: 'conversion', label: 'Tasa de conversión', value: 3.2, format: 'percent' },
];

export const chartData = [
  { month: 'Ene', ventas: 820000, visitas: 4200 },
  { month: 'Feb', ventas: 940000, visitas: 4800 },
  { month: 'Mar', ventas: 1100000, visitas: 5100 },
  { month: 'Abr', ventas: 1250000, visitas: 5600 },
];

export default { kpis, chartData };