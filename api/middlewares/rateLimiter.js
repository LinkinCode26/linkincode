import rateLimit from 'express-rate-limit';

// Máximo 5 envíos del formulario de contacto cada 15 minutos por IP
export const leadsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 'error',
    message: 'Demasiados envíos desde esta IP, intentá de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default leadsRateLimit;