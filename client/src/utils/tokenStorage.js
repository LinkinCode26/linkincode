// Único módulo que toca el storage del navegador para el token del admin.
//
// Decisiones de seguridad:
// - sessionStorage (no localStorage): el token se borra al cerrar la pestaña
//   y no se comparte entre pestañas, así una sesión olvidada no queda abierta.
// - Se guarda SOLO el token. Los datos del usuario viven en memoria (React)
//   y se recuperan con GET /api/auth/me.
// - El token nunca se loguea ni viaja en la URL: solo en el header
//   Authorization (ver services/authApi.js).
//
// Nota: cualquier storage accesible desde JS puede leerse ante un XSS. La
// alternativa más robusta es una cookie httpOnly emitida por la API.

const STORAGE_KEY = "lc-admin-token";

export function getToken() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage bloqueado (modo privado estricto, políticas del navegador).
    return null;
  }
}

export function saveToken(token) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Si no se puede persistir, la sesión vive solo en memoria.
  }
}

export function clearToken() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nada que limpiar.
  }
}

// Decodifica el payload de un JWT. NO verifica la firma (eso lo hace la API
// en GET /api/auth/me); sirve para leer `exp` sin hacer una request.
export function decodeJwtPayload(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

// Momento de expiración en milisegundos, o null si el token no es legible.
export function getTokenExpiry(token) {
  const payload = decodeJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
}

export function isTokenValid(token) {
  const expiresAt = getTokenExpiry(token);
  return expiresAt !== null && expiresAt > Date.now();
}

// Devuelve el token guardado solo si existe y no venció; si no, lo borra.
export function getValidStoredToken() {
  const token = getToken();
  if (!token) return null;
  if (isTokenValid(token)) return token;
  clearToken();
  return null;
}
