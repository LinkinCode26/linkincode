// Ítems de ejemplo para armar una factura, usados por el simulador
// de Facturación Digital (LC-029).

export const invoiceItems = [
  {
    id: "item-1",
    description: "Desarrollo de landing page",
    quantity: 1,
    price: 150000,
  },
  { id: "item-2", description: "Hosting mensual", quantity: 1, price: 8000 },
  {
    id: "item-3",
    description: "Hora de soporte técnico",
    quantity: 3,
    price: 12000,
  },
];

export const IVA_RATE = 0.21;

export default invoiceItems;
