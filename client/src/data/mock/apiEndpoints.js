// Endpoints de ejemplo para el simulador de APIs REST (LC-025).
// Cada uno simula una respuesta real, con status, headers y el body
// que se mostraría en el "playground" tipo Postman.

export const apiEndpoints = [
  {
    id: 'get-productos',
    method: 'GET',
    path: '/api/productos',
    status: 200,
    responseTimeMs: 84,
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
    responseBody: {
      error: 'Producto no encontrado',
    },
  },
];

export default apiEndpoints;