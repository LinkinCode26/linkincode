import User from "../models/User.js";

// @desc    Obtener usuarios con filtros combinados y paginación
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    // 1. Configuración de Paginación
    const page = parseInt(req.query.page) || 1; // Página por defecto: 1
    const limit = parseInt(req.query.limit) || 10; // Límite por defecto: 10
    const skip = (page - 1) * limit;

    // 2. Configuración de Filtros
    const query = {};
    if (req.query.email) {
      // Búsqueda parcial por email (case-insensitive)
      query.email = { $regex: req.query.email, $options: "i" };
    }

    // 3. Ejecutar consulta con filtros, salto (skip) y límite
    const users = await User.find(query)
      .select("-password") // No devolvemos las contraseñas
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 4. Contar el total de documentos para la metadata de paginación
    const total = await User.countDocuments(query);

    res.status(200).json({
      data: users,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
