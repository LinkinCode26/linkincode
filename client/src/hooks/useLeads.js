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
  const { token, expireSession } = useAuth();
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

  // Si la API dice 401, el token ya no sirve: se expira la sesión (con aviso
  // en el login) y ProtectedRoute redirige.
  const handleAuthError = useCallback(
    (error) => {
      if (error instanceof ApiError && error.status === 401) expireSession();
    },
    [expireSession],
  );

  useEffect(() => {
    let cancelled = false;
    fetchLeads(token, query)
      .then((res) => {
        if (cancelled) return;

        // La página pedida quedó fuera de rango (ej: se movió el único lead
        // de la última página, o ya no hay resultados). Se salta a la última
        // página válida en vez de mostrar una lista vacía sin paginación.
        const lastPage = Math.max(res.pagination.totalPages, 1);
        if (query.page > lastPage) {
          setFilters((f) => ({ ...f, page: lastPage }));
          return;
        }

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

  // Los contadores respetan el filtro de estado (para que los chips no
  // contradigan la lista) pero no el de servicio: cada chip cuenta su servicio.
  // Se vuelven a pedir al cambiar el estado y al reintentar.
  const { estado: estadoFilter } = filters;

  useEffect(() => {
    let cancelled = false;
    const params = estadoFilter !== "all" ? { estado: estadoFilter } : {};

    fetchLeadStats(token, params)
      .then((res) => {
        if (!cancelled) setCounts(countByService(res.data));
      })
      .catch(() => {
        // Sin contadores la lista sigue funcionando; los chips muestran "–".
      });
    return () => {
      cancelled = true;
    };
  }, [token, attempt, estadoFilter]);

  const setServicio = useCallback(
    (servicio) => {
      setUpdateFailed(false);
      setFilters((f) => ({ ...f, servicio, page: 1 }));
    },
    [],
  );

  const setEstado = useCallback(
    (estado) => {
      setUpdateFailed(false);
      setFilters((f) => ({ ...f, estado, page: 1 }));
    },
    [],
  );

  const setPage = useCallback(
    (page) => {
      setUpdateFailed(false);
      setFilters((f) => ({ ...f, page }));
    },
    [],
  );
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

        // Con un filtro de estado activo, el lead ya no coincide con el
        // filtro: se recarga para que la lista, el total y las páginas
        // reflejen la realidad.
        if (filters.estado !== "all" && filters.estado !== estado) {
          setAttempt((n) => n + 1);
        }
      } catch (error) {
        patchLocal(lead._id, previous);
        handleAuthError(error);
        setUpdateFailed(true);
      } finally {
        setPendingIds((ids) => ids.filter((id) => id !== lead._id));
      }
    },
    [token, filters.estado, patchLocal, handleAuthError],
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