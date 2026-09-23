// En desarrollo, Vite redirige /api al backend (ver vite.config.js).
// En producción, definir VITE_API_URL (ej: https://api.linkincode.dev/api).
const API_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

// status 0 = no hubo respuesta (red caída, servidor apagado, CORS).
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { method = "GET", token, body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Network error", 0);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message ?? "Request failed", response.status);
  }

  return data;
}

export const loginRequest = (email, password) =>
  request("/auth/login", { method: "POST", body: { email, password } });

export const fetchMe = (token) => request("/auth/me", { token });
