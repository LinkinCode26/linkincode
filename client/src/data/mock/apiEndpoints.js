// Endpoints de ejemplo para el simulador de APIs REST (LC-025).
// Estructurados por idioma (es / en) para responder según el locale activo.

const endpointsData = {
  es: [
    {
      id: "get-productos",
      method: "GET",
      path: "/api/productos",
      status: 200,
      responseTimeMs: 84,
      headers: {
        "Content-Type": "application/json",
        "X-Response-Time": "84ms",
        "Cache-Control": "no-cache",
      },
      responseBody: {
        data: [
          { id: 1, nombre: "Auriculares Inalámbricos", precio: 45000 },
          { id: 2, nombre: "Mochila Urbana", precio: 32000 },
        ],
      },
    },
    {
      id: "post-pedido",
      method: "POST",
      path: "/api/pedidos",
      status: 201,
      responseTimeMs: 132,
      headers: {
        "Content-Type": "application/json",
        Location: "/api/pedidos/501",
        "X-Response-Time": "132ms",
      },
      responseBody: {
        id: 501,
        estado: "creado",
        total: 45000,
      },
    },
    {
      id: "get-producto-inexistente",
      method: "GET",
      path: "/api/productos/999",
      status: 404,
      responseTimeMs: 47,
      headers: {
        "Content-Type": "application/json",
        "X-Response-Time": "47ms",
      },
      responseBody: {
        error: "Producto no encontrado",
      },
    },
  ],
  en: [
    {
      id: "get-productos",
      method: "GET",
      path: "/api/products",
      status: 200,
      responseTimeMs: 84,
      headers: {
        "Content-Type": "application/json",
        "X-Response-Time": "84ms",
        "Cache-Control": "no-cache",
      },
      responseBody: {
        data: [
          { id: 1, name: "Wireless Headphones", price: 45 },
          { id: 2, name: "Urban Backpack", price: 32 },
        ],
      },
    },
    {
      id: "post-pedido",
      method: "POST",
      path: "/api/orders",
      status: 201,
      responseTimeMs: 132,
      headers: {
        "Content-Type": "application/json",
        Location: "/api/orders/501",
        "X-Response-Time": "132ms",
      },
      responseBody: {
        id: 501,
        status: "created",
        total: 45,
      },
    },
    {
      id: "get-producto-inexistente",
      method: "GET",
      path: "/api/products/999",
      status: 404,
      responseTimeMs: 47,
      headers: {
        "Content-Type": "application/json",
        "X-Response-Time": "47ms",
      },
      responseBody: {
        error: "Product not found",
      },
    },
  ],
};

export const getApiEndpoints = (lang = "es") => {
  return endpointsData[lang] ?? endpointsData.es;
};

export default getApiEndpoints;