import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FullScreenLoader } from "./FullScreenLoader";

// Se usa como "layout route": todo lo que cuelgue de él exige sesión.
//
//   <Route element={<ProtectedRoute />}>
//     <Route path="/admin" element={<AdminDashboard />} />
//   </Route>
//
// Importante: esto es UX, no seguridad. Quien protege los datos es la API
// (middleware `protect`); cada endpoint de admin debe usarlo.
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  // Evita el "flash" de redirección mientras la API valida el token guardado.
  if (status === "checking") return <FullScreenLoader />;

  if (status !== "authenticated") {
    // `from` permite volver a la página pedida después de iniciar sesión.
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
