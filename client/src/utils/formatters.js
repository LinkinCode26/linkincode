// Utilidades de formato para el simulador de Dashboards.
// Locale-aware porque el sitio soporta ES/EN.

const cache = new Map();

function getFormatter(kind, locale) {
  const key = `${kind}-${locale}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      kind === "currency"
        ? new Intl.NumberFormat(locale, {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          })
        : new Intl.NumberFormat(locale)
    );
  }
  return cache.get(key);
}

export function formatCurrency(value, locale = "es-AR") {
  return getFormatter("currency", locale).format(value);
}

export function formatNumber(value, locale = "es-AR") {
  return getFormatter("number", locale).format(value);
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

export function formatMetric(value, format, locale = "es-AR") {
  if (format === "currency") return formatCurrency(value, locale);
  if (format === "percent") return formatPercent(value);
  return formatNumber(value, locale);
}