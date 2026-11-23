import useLanguage from "../../hooks/useLanguage";
import {
  ORDER_STATUSES,
  ORDER_STATUS_TONE,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_TONE,
  badgeClasses,
  barClasses,
  formatDate,
  formatPrice,
  getDisplayName,
} from "../../utils/ecommerce";

const BASE = "solutions.simulator.ecommerce.admin";

function KpiCard({ label, value, accent = false }) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface p-3.5">
      <span className="block truncate text-[11px] font-bold uppercase tracking-wider text-mute">
        {label}
      </span>
      <span
        className={`block truncate font-display text-base font-bold sm:text-xl ${
          accent ? "text-accent-text" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// Fila con barra proporcional: el ancho es información (cuánto pesa cada
// estado sobre el total), no decoración.
function BreakdownRow({ label, count, total, tone }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-bold text-mute">{count}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg" aria-hidden="true">
        <div
          className={`h-full rounded-full ${barClasses(tone)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </li>
  );
}

export function AdminDashboardTab({ stats, orders, customersCount }) {
  const { t, lang } = useLanguage();
  const locale = lang === "en" ? "en-US" : "es-AR";
  const D = (key) => t(`${BASE}.dashboard.${key}`);
  const money = (value) => formatPrice(value, locale);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KpiCard
          label={t(`${BASE}.kpis.revenue`)}
          value={money(stats.revenue)}
          accent
        />
        <KpiCard
          label={t(`${BASE}.kpis.pendingRevenue`)}
          value={money(stats.pendingRevenue)}
        />
        <KpiCard label={t(`${BASE}.kpis.orders`)} value={stats.ordersTotal} />
        <KpiCard label={t(`${BASE}.kpis.customers`)} value={customersCount} />
        <KpiCard label={t(`${BASE}.kpis.lowStock`)} value={stats.lowStock} />
        <KpiCard label={t(`${BASE}.kpis.outOfStock`)} value={stats.outOfStock} />
      </div>
      <p className="text-[11px] text-mute">{D("revenueNote")}</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-mute">
            {D("ordersByStatus")}
          </h4>
          <ul className="flex flex-col gap-3">
            {ORDER_STATUSES.map((status) => (
              <BreakdownRow
                key={status}
                label={t(`${BASE}.orderStatuses.${status}`)}
                count={stats.ordersByStatus[status]}
                total={stats.ordersTotal}
                tone={ORDER_STATUS_TONE[status]}
              />
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-mute">
            {D("paymentsByStatus")}
          </h4>
          <ul className="flex flex-col gap-3">
            {PAYMENT_STATUSES.map((status) => (
              <BreakdownRow
                key={status}
                label={t(`${BASE}.paymentStatuses.${status}`)}
                count={stats.paymentsByStatus[status]}
                total={stats.ordersTotal}
                tone={PAYMENT_STATUS_TONE[status]}
              />
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-mute">
          {D("recentOrders")}
        </h4>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-mute">{D("empty")}</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-2 rounded-xl border border-line bg-bg p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    <span className="text-brand">{order.number}</span>{" "}
                    {order.customerName}
                  </p>
                  <p className="text-xs text-mute">
                    {formatDate(order.date, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses(
                      ORDER_STATUS_TONE[order.orderStatus],
                    )}`}
                  >
                    {t(`${BASE}.orderStatuses.${order.orderStatus}`)}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses(
                      PAYMENT_STATUS_TONE[order.paymentStatus],
                    )}`}
                  >
                    {t(`${BASE}.paymentStatuses.${order.paymentStatus}`)}
                  </span>
                  <span className="text-sm font-bold text-ink">
                    {money(order.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export function AdminReportsTab({ stats }) {
  const { t, lang } = useLanguage();
  const locale = lang === "en" ? "en-US" : "es-AR";
  const R = (key) => t(`${BASE}.reports.${key}`);
  const money = (value) => formatPrice(value, locale);

  const maxUnits = Math.max(1, ...stats.topProducts.map((p) => p.units));
  const maxMethod = Math.max(1, ...stats.salesByMethod.map((m) => m.total));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-line bg-surface p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-mute">
          {R("topProducts")}
        </h4>
        {stats.topProducts.length === 0 ? (
          <p className="text-sm text-mute">{R("noData")}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {stats.topProducts.map((product) => (
              <li key={product.id} className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3 text-xs">
                  <span className="min-w-0 font-medium text-ink">
                    {getDisplayName(t, product)}
                  </span>
                  <span className="shrink-0 font-bold text-mute">
                    {product.units} {R("units")} · {money(product.revenue)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(product.units / maxUnits) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-mute">
          {R("salesByMethod")}
        </h4>
        {stats.revenue === 0 ? (
          <p className="text-sm text-mute">{R("noData")}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {stats.salesByMethod.map((method) => (
              <li key={method.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-ink">
                    {t(
                      `solutions.simulator.ecommerce.checkout.methods.${method.id}`,
                    )}
                  </span>
                  <span className="font-bold text-mute">
                    {money(method.total)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(method.total / maxMethod) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}