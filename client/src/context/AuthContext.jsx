import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context.js";
import { ApiError, fetchMe, loginRequest } from "../services/authApi.js";
import {
  getToken,
  isTokenValid,
  clearToken,
  getTokenExpiry,
  saveToken,
} from "../utils/tokenStorage.js";

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

const UNAUTHENTICATED = { token: null, user: null, status: "unauthenticated" };

// Función pura: sin efectos secundarios (StrictMode ejecuta el initializer dos veces).
// Devuelve la sesión inicial y si el token guardado estaba vencido o era ilegible.
function readInitialSession() {
  const stored = getToken();
  if (!stored) return { session: UNAUTHENTICATED, expired: false };
  if (isTokenValid(stored))
    return { session: { token: stored, user: null, status: "checking" }, expired: false };
  return { session: UNAUTHENTICATED, expired: true }; // token vencido o ilegible
}

export function AuthProvider({ children }) {
  const [initial] = useState(readInitialSession);
  const [session, setSession] = useState(initial.session);
  const [sessionExpired, setSessionExpired] = useState(initial.expired);
  const { token, status } = session;

  // Si al montar detectamos un token vencido/ilegible, lo limpiamos del storage.
  // Va en un efecto (no en el initializer) para que el initializer sea puro.
  useEffect(() => {
    if (initial.expired) clearToken();
  }, [initial.expired]);

  // Cierre de sesión "no voluntario" (token vencido o rechazado por la API):
  // a diferencia de logout(), deja sessionExpired en true para que el login
  // muestre el aviso "Tu sesión expiró".
  const expireSession = useCallback(() => {
    clearToken();
    setSessionExpired(true);
    setSession(UNAUTHENTICATED);
  }, []);

  // 1) Al cargar con un token guardado, la API confirma que la firma es
  //    válida y que el usuario sigue existiendo. Si falla por cualquier
  //    motivo, no se puede confirmar la sesión: se limpia y se pide login.
  useEffect(() => {
    if (status !== "checking") return;
    let cancelled = false;

    fetchMe(token)
      .then((user) => {
        if (!cancelled) setSession({ token, user, status: "authenticated" });
      })
      .catch((error) => {
        if (cancelled) return;
        clearToken();
        setSessionExpired(error instanceof ApiError && error.status === 401);
        setSession(UNAUTHENTICATED);
      });

    return () => {
      cancelled = true;
    };
  }, [status, token]);

  // 2) Cierra la sesión en el momento exacto en que vence el token
  //    (la API los emite con 1 día de vida, configurable con JWT_EXPIRES_IN).
  useEffect(() => {
    if (status !== "authenticated") return;
    const expiresAt = getTokenExpiry(token);
    if (!expiresAt) return;

    const timer = window.setTimeout(
      () => {
        // Si el delay se recortó por MAX_TIMEOUT_MS, el token aún no venció:
        // en ese caso la API responderá 401 en la próxima request y el flujo
        // de error se encargará de expirar la sesión.
        if (Date.now() >= expiresAt) expireSession();
      },
      Math.min(Math.max(expiresAt - Date.now(), 0), MAX_TIMEOUT_MS),
    );

    return () => window.clearTimeout(timer);
  }, [status, token, expireSession]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    if (!data?.token) throw new ApiError("Invalid response", 500);

    saveToken(data.token);
    setSessionExpired(false);
    setSession({
      token: data.token,
      user: { _id: data._id, email: data.email },
      status: "authenticated",
    });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setSessionExpired(false);
    setSession(UNAUTHENTICATED);
  }, []);

  const value = useMemo(
    () => ({
      status,
      token,
      user: session.user,
      isAuthenticated: status === "authenticated",
      sessionExpired,
      login,
      logout,
      expireSession,
    }),
    [status, token, session.user, sessionExpired, login, logout, expireSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;