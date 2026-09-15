export const apiEndpoints = [
  {
    id: 'get-productos',
    method: 'GET',
    path: '/api/productos',
    status: 200,
    responseTimeMs: 84,
    headers: {
      'Content-Type': 'application/json',
      'X-Response-Time': '84ms',
      'Cache-Control': 'no-cache',
    },
    responseBody: {
      data: [
        { id: 1, nombre: 'Auriculares Inalámbricos', precio: 45000 },
        { id: 2, nombre: 'Mochila Urbana', precio: 32000 },
      ],
    },
  },
  {
    id: 'post-pedido',
    method: 'POST',
    path: '/api/pedido',
    status: 201,
    responseTimeMs: 132,
    headers: {
      'Content-Type': 'application/json',
      'Location': '/api/pedido/501',
      'X-Response-Time': '132ms',
    },
    responseBody: {
      id: 501,
      estado: 'creado',
      total: 45000,
    },
  },
  {
    id: 'get-producto-inexistente',
    method: 'GET',
    path: '/api/productos/999',
    status: 404,
    responseTimeMs: 47,
    headers: {
      'Content-Type': 'application/json',
      'X-Response-Time': '47ms',
    },
    responseBody: {
      error: 'Producto no encontrado',
    },
  },
];

export default apiEndpoints;