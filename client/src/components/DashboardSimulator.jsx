import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useLanguage from "../hooks/useLanguage";
import { DATE_RANGES, getDashboardDataByRange } from "../data/mock/dashboardMetrics";
import { formatMetric } from "../utils/formatters";

const CHART_COLORS = ["var(--brand)", "var(--accent)", "#f59e0b", "#a855f7"];
const TRANSITION_MS = 320;

function formatAxisNumber(value) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const thousands = value / 1_000;
    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
  }
  return `${value}`;
}

function KpiCard({ kpi, label, formatValue }) {
  const positive = kpi.delta >= 0;
  return (
    <div className="bg-surface border border-line rounded-2xl p-4 sm:p-5 flex flex-col gap-2 min-w-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-mute truncate">
        {label}
      </span>
      <span className="font-display text-lg sm:text-2xl font-bold text-ink truncate">
        {formatValue(kpi.value, kpi.format)}
      </span>
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold w-fit px-2 py-0.5 rounded-full ${
          positive ? "text-accent bg-accent/10" : "text-red-400 bg-red-400/10"
        }`}
      >
        <i
          className={`fas ${positive ? "fa-arrow-trend-up" : "fa-arrow-trend-down"} text-[9px]`}
          aria-hidden="true"
        />
        {Math.abs(kpi.delta)}%
      </span>
    </div>
  );
}

function CustomTooltip({ active, payload, label, locale }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-line rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-ink mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}:{" "}
          {typeof entry.value === "number"
            ? new Intl.NumberFormat(locale).format(entry.value)
            : entry.value}
        </p>
      ))}
    </div>
  );
}

export function DashboardSimulator() {
  const { t, lang } = useLanguage();
  const locale = lang === "en" ? "en-US" : "es-AR";

  const formatValue = (value, format) => formatMetric(value, format, locale);

  const [rangeId, setRangeId] = useState("30d");
  const [data, setData] = useState(() => getDashboardDataByRange("30d"));
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleRangeChange = (id) => {
    if (id === rangeId || isLoading) return;
    setRangeId(id);
    setIsLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setData(getDashboardDataByRange(id));
      setIsLoading(false);
    }, TRANSITION_MS);
  };

  const getPeriodLabel = (periodType, index) => {
    const arr = t(`solutions.simulator.dashboard.periods.${periodType}`);
    return Array.isArray(arr) ? arr[index] ?? "" : "";
  };

  const chartRows = useMemo(
    () =>
      data.chartData.map((row) => ({
        ...row,
        label: getPeriodLabel(data.periodType, row.periodIndex),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, lang]
  );

  const categoryRows = useMemo(
    () =>
      data.categoryData.map((entry) => ({
        ...entry,
        name: t(`solutions.simulator.dashboard.categories.${entry.id}`),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, lang]
  );

  const totalCategoryValue = useMemo(
    () => categoryRows.reduce((acc, item) => acc + item.value, 0),
    [categoryRows]
  );

  const salesLegend = t("solutions.simulator.dashboard.charts.salesLegend");
  const visitsLegend = t("solutions.simulator.dashboard.charts.visitsLegend");
  const ordersLegend = t("solutions.simulator.dashboard.charts.ordersLegend");

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Selector de rango de fechas */}
      <div className="flex flex-wrap items-center gap-2">
        {DATE_RANGES.map((id) => {
          const isActive = id === rangeId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleRangeChange(id)}
              disabled={isLoading}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all disabled:cursor-wait ${
                isActive
                  ? "bg-brand/15 border-brand text-brand"
                  : "bg-surface border-line text-mute hover:text-ink hover:border-brand/40"
              }`}
            >
              {t(`solutions.simulator.dashboard.ranges.${id}`)}
            </button>
          );
        })}
        {isLoading && (
          <span className="flex items-center gap-2 text-[11px] font-semibold text-mute ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {t("solutions.simulator.dashboard.updating")}
          </span>
        )}
      </div>

      {/* Contenido con transición visual al cambiar de rango */}
      <div
        className={`flex flex-col gap-6 transition-opacity duration-300 ${
          isLoading ? "opacity-30" : "opacity-100"
        }`}
      >
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.kpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              kpi={kpi}
              formatValue={formatValue}
              label={t(`solutions.simulator.dashboard.kpis.${kpi.id}`)}
            />
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Línea: ventas & visitas */}
          <div className="bg-surface border border-line rounded-2xl p-4 sm:p-5 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
              {t("solutions.simulator.dashboard.charts.salesVisits")}
            </p>
            <div className="w-full h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRows} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--mute)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                    stroke="var(--mute)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    tickFormatter={formatAxisNumber}
                />
                  <Tooltip content={<CustomTooltip locale={locale} />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="ventas"
                    name={salesLegend}
                    stroke="var(--brand)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitas"
                    name={visitsLegend}
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Barras: pedidos */}
          <div className="bg-surface border border-line rounded-2xl p-4 sm:p-5 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
              {t("solutions.simulator.dashboard.charts.ordersByPeriod")}
            </p>
            <div className="w-full h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartRows} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--mute)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                    stroke="var(--mute)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tickFormatter={formatAxisNumber}
                />
                  <Tooltip content={<CustomTooltip locale={locale} />} />
                  <Bar dataKey="pedidos" name={ordersLegend} fill="var(--brand)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Torta: ventas por categoría */}
          <div className="bg-surface border border-line rounded-2xl p-4 sm:p-5 lg:col-span-2 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
              {t("solutions.simulator.dashboard.charts.byCategory")}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryRows}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="55%"
                      outerRadius="80%"
                      paddingAngle={3}
                    >
                      {categoryRows.map((entry, index) => (
                        <Cell key={entry.id} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip locale={locale} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-1/2">
                {categoryRows.map((entry, index) => {
                  const pct = totalCategoryValue
                    ? ((entry.value / totalCategoryValue) * 100).toFixed(0)
                    : 0;
                  return (
                    <div key={entry.id} className="flex items-center justify-between text-xs gap-2">
                      <span className="flex items-center gap-2 text-ink font-medium truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        {entry.name}
                      </span>
                      <span className="text-mute font-semibold whitespace-nowrap">
                        {formatValue(entry.value, "currency")}{" "}
                        <span className="text-mute/60">({pct}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-mute/70 text-center">
        {t("solutions.simulator.dashboard.disclaimer")}
      </p>
    </div>
  );
}

export default DashboardSimulator;