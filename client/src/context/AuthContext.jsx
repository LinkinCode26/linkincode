import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context.js";
import { ApiError, fetchMe, loginRequest } from "../services/authApi.js";
import {
  clearToken,
  getTokenExpiry,
  getValidStoredToken,
  saveToken,
} from "../utils/tokenStorage.js";

// status:
//  - "checking":        hay un token guardado y se está verificando con la API
//  - "authenticated":   sesión válida
//  - "unauthenticated": sin sesión
const UNAUTHENTICATED = { token: null, user: null, status: "unauthenticated" };

function getInitialSession() {
  const token = getValidStoredToken(); // descarta tokens vencidos o ilegibles
  return token ? { token, user: null, status: "checking" } : UNAUTHENTICATED;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getInitialSession);
  const [sessionExpired, setSessionExpired] = useState(false);
  const { token, status } = session;

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
  //    (la API los emite con 1 día de vida).
  useEffect(() => {
    if (status !== "authenticated") return;
    const expiresAt = getTokenExpiry(token);
    if (!expiresAt) return;

    const timer = window.setTimeout(
      () => {
        clearToken();
        setSessionExpired(true);
        setSession(UNAUTHENTICATED);
      },
      Math.max(expiresAt - Date.now(), 0),
    );

    return () => window.clearTimeout(timer);
  }, [status, token]);

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
    }),
    [status, token, session.user, sessionExpired, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
