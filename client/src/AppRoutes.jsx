import { Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { ProtectedRoute } from "./components/admin/ProtectedRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Sitio público (App.jsx sin cambios) */}
      <Route path="/" element={<App />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
