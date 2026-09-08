// Productos mock, reutilizados por el simulador de E-commerce (LC-024)
// y el de Control de Stock (LC-027). Editar acá no requiere tocar
// ningún componente de simulador.

export const products = [
  {
    id: "prod-1",
    name: "Auriculares Inalámbricos",
    price: 45000,
    stock: 24,
    lowStockThreshold: 5,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
  {
    id: 'prod-2',
    name: 'Mochila Urbana',
    price: 32000,
    stock: 3,
    lowStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  },
  {
    id: 'prod-3',
    name: 'Botella Térmica 1L',
    price: 12000,
    stock: 50,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
  },
  {
    id: 'prod-4',
    name: 'Teclado Mecánico',
    price: 68000,
    stock: 8,
    lowStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
  },
];

export default products