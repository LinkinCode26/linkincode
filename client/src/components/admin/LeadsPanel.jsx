import useLanguage from "../../hooks/useLanguage";
import useLeads from "../../hooks/useLeads";
import { Button } from "../Button";
import { GlassCard } from "../GlassCard";
import { SERVICES } from "../../data/services";
import { getServiceIdFromLabel } from "../../utils/leadServices";

const ESTADOS = ["nuevo", "contactado", "ganado", "perdido"];

const ESTADO_STYLES = {
  nuevo: "bg-brand/15 border-brand/30 text-brand",
  contactado:
    "bg-amber-500/15 border-amber-500/30 text-amber-400 [[data-theme=light]_&]:text-amber-800",
  ganado:
    "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 [[data-theme=light]_&]:text-emerald-800",
  perdido:
    "bg-red-500/15 border-red-500/30 text-red-400 [[data-theme=light]_&]:text-red-700",
};

export function LeadsPanel() {
  const { t, lang } = useLanguage();
  const {
    leads,
    pagination,
    loading,
    failed,
    counts,
    filters,
    setServicio,
    setEstado,
    setPage,
    retry,
    changeStatus,
    pendingIds,
    updateFailed,
  } = useLeads();

  const L = (key) => t(`admin.dashboard.leads.${key}`);
  const locale = lang === "en" ? "en-US" : "es-AR";
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const chips = [
    { id: "all", label: L("all") },
    ...SERVICES.map((service) => ({
      id: service.id,
      label: t(`solutions.tabs.${service.id}`),
    })),
  ];

  const errorBox =
    "flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 [[data-theme=light]_&]:text-red-700";

  return (
    <GlassCard className="mt-10 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold">
          {t("admin.dashboard.leadsTitle")}
        </h2>

        <div>
          <label htmlFor="leads-estado" className="sr-only">
            {L("statusLabel")}
          </label>
          <select
            id="leads-estado"
            value={filters.estado}
            onChange={(e) => setEstado(e.target.value)}
            className="bg-surface border border-line rounded-xl px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand"
          >
            <option value="all">{L("statusAll")}</option>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {L(`status.${estado}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtro por servicio + contador por cada tab de Soluciones */}
      <div
        role="group"
        aria-label={L("servicesLabel")}
        className="mt-6 flex flex-wrap gap-2"
      >
        {chips.map((chip) => {
          const isActive = filters.servicio === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setServicio(chip.id)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-brand/15 border-brand text-brand"
                  : "bg-surface border-line text-mute hover:text-ink hover:border-brand/40"
              }`}
            >
              {chip.label}
              <span className="rounded-full bg-bg px-2 py-0.5 text-[11px] font-bold text-ink">
                {counts ? counts[chip.id] : "–"}
              </span>
            </button>
          );
        })}
      </div>

      {updateFailed && (
        <p role="alert" className={`mt-6 ${errorBox}`}>
          <i className="fas fa-circle-exclamation" aria-hidden="true" />
          {L("updateError")}
        </p>
      )}

      <div className="mt-6" aria-busy={loading}>
        {loading && leads.length === 0 ? (
          <div role="status" className="flex justify-center py-12 text-brand">
            <i className="fas fa-circle-notch fa-spin text-2xl" aria-hidden="true" />
            <span className="sr-only">{t("admin.loading")}</span>
          </div>
        ) : failed ? (
          <div role="alert" className={`justify-between ${errorBox}`}>
            <span>{L("loadError")}</span>
            <Button variant="outline" size="small" onClick={retry}>
              {L("retry")}
            </Button>
          </div>
        ) : leads.length === 0 ? (
          <p className="py-12 text-center text-mute">{L("empty")}</p>
        ) : (
          <ul
            className={`space-y-3 transition-opacity duration-200 ${
              loading ? "opacity-50" : "opacity-100"
            }`}
          >
            {leads.map((lead) => {
              const serviceId = getServiceIdFromLabel(lead.tipoProyecto);
              const serviceLabel = serviceId
                ? t(`solutions.tabs.${serviceId}`)
                : lead.tipoProyecto;

              return (
                <li
                  key={lead._id}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-bold text-ink">{lead.nombre}</p>
                      <a
                        href={`mailto:${lead.email}`}
                        className="truncate text-sm text-mute transition-colors hover:text-brand"
                      >
                        {lead.email}
                      </a>
                    </div>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-accent-text">
                      {serviceLabel}
                    </p>
                    <p className="mt-2 line-clamp-3 break-words text-sm text-mute">
                      {lead.mensaje}
                    </p>
                    <p className="mt-2 text-xs text-mute">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <label htmlFor={`estado-${lead._id}`} className="sr-only">
                      {L("statusLabel")}: {lead.nombre}
                    </label>
                    <select
                      id={`estado-${lead._id}`}
                      value={lead.estado}
                      disabled={pendingIds.includes(lead._id)}
                      onChange={(e) => changeStatus(lead, e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 disabled:opacity-60 lg:w-auto ${
                        ESTADO_STYLES[lead.estado] ?? ESTADO_STYLES.nuevo
                      }`}
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado} className="bg-surface text-ink">
                          {L(`status.${estado}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-3 text-sm text-mute">
          <Button
            variant="outline"
            size="small"
            onClick={() => setPage(filters.page - 1)}
            disabled={filters.page <= 1 || loading}
            className="disabled:pointer-events-none disabled:opacity-40"
          >
            {L("prev")}
          </Button>
          <span>
            {L("page")} {pagination.currentPage} {L("of")} {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="small"
            onClick={() => setPage(filters.page + 1)}
            disabled={filters.page >= pagination.totalPages || loading}
            className="disabled:pointer-events-none disabled:opacity-40"
          >
            {L("next")}
          </Button>
        </div>
      )}
    </GlassCard>
  );
}

export default LeadsPanel;