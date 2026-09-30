import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "./useAuth";
import {
  ApiError,
  fetchLeads,
  fetchLeadStats,
  updateLeadStatusRequest,
} from "../services/authApi.js";
import { buildServiceFilter, countByService } from "../utils/leadServices.js";

const PAGE_SIZE = 10;

export function useLeads() {
  const { token, logout } = useAuth();
  const [filters, setFilters] = useState({ servicio: "all", estado: "all", page: 1 });
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, leads: [], pagination: null, failed: false });
  const [counts, setCounts] = useState(null);
  const [pendingIds, setPendingIds] = useState([]);
  const [updateFailed, setUpdateFailed] = useState(false);

  const query = useMemo(() => {
    const params = { page: filters.page, limit: PAGE_SIZE };
    if (filters.servicio !== "all") params.tipoProyecto = buildServiceFilter(filters.servicio);
    if (filters.estado !== "all") params.estado = filters.estado;
    return params;
  }, [filters]);

  const requestKey = JSON.stringify([query, attempt]);
  const loading = result.key !== requestKey;

  // Si la API dice 401, el token ya no sirve: se cierra la sesión y
  // ProtectedRoute redirige al login.
  const handleAuthError = useCallback(
    (error) => {
      if (error instanceof ApiError && error.status === 401) logout();
    },
    [logout],
  );

  useEffect(() => {
    let cancelled = false;
    fetchLeads(token, query)
      .then((res) => {
        if (cancelled) return;
        setResult({ key: requestKey, leads: res.data, pagination: res.pagination, failed: false });
      })
      .catch((error) => {
        if (cancelled) return;
        handleAuthError(error);
        setResult({ key: requestKey, leads: [], pagination: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [token, query, requestKey, handleAuthError]);

  // Los contadores no dependen de los filtros: se piden una vez (y al reintentar).
  useEffect(() => {
    let cancelled = false;
    fetchLeadStats(token)
      .then((res) => {
        if (!cancelled) setCounts(countByService(res.data));
      })
      .catch(() => {
        // Sin contadores la lista sigue funcionando; los chips muestran "–".
      });
    return () => {
      cancelled = true;
    };
  }, [token, attempt]);

  const setServicio = useCallback(
    (servicio) => setFilters((f) => ({ ...f, servicio, page: 1 })),
    [],
  );
  const setEstado = useCallback(
    (estado) => setFilters((f) => ({ ...f, estado, page: 1 })),
    [],
  );
  const setPage = useCallback((page) => setFilters((f) => ({ ...f, page })), []);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const patchLocal = useCallback((id, estado) => {
    setResult((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) => (lead._id === id ? { ...lead, estado } : lead)),
    }));
  }, []);

  // Actualización optimista: la UI cambia al instante y, si la API falla,
  // vuelve al valor anterior.
  const changeStatus = useCallback(
    async (lead, estado) => {
      const previous = lead.estado;
      if (estado === previous) return;

      setUpdateFailed(false);
      setPendingIds((ids) => [...ids, lead._id]);
      patchLocal(lead._id, estado);

      try {
        await updateLeadStatusRequest(token, lead._id, estado);
      } catch (error) {
        patchLocal(lead._id, previous);
        handleAuthError(error);
        setUpdateFailed(true);
      } finally {
        setPendingIds((ids) => ids.filter((id) => id !== lead._id));
      }
    },
    [token, patchLocal, handleAuthError],
  );

  return {
    leads: result.leads,
    pagination: result.pagination,
    loading,
    failed: result.failed,
    counts,
    filters,
    setServicio,
    setEstado,
    setPage,
    retry,
    changeStatus,
    pendingIds,
    updateFailed,
  };
}

export default useLeads;