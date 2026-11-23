import { useMemo, useState } from "react";
import { ChevronDown, Search, ShoppingBag, X } from "lucide-react";
import useLanguage from "../../hooks/useLanguage";
import {
  ORDER_STATUSES,
  ORDER_STATUS_TONE,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_TONE,
  badgeClasses,
  formatDateTime,
  formatPrice,
  getDisplayName,
} from "../../utils/ecommerce";

const BASE = "solutions.simulator.ecommerce.admin";

const FIELD_CLASSES =
  "bg-surface border border-line-strong rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-brand transition-colors";

// Select teñido según el estado actual (borde = color del texto, ver
// design-tokens.md). La etiqueta visible evita confundir "pedido" con "pago".
function StatusSelect({ id, label, value, options, tones, getLabel, onChange }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-mute"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand ${badgeClasses(
          tones[value],
        )}`}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-surface cursor-pointer text-ink"
          >
            {getLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AdminOrdersTab({
  orders,
  onChangeOrderStatus,
  onChangePaymentStatus,
}) {
  const { t, lang } = useLanguage();
  const locale = lang === "en" ? "en-US" : "es-AR";
  const O = (key) => t(`${BASE}.orders.${key}`);
  const money = (value) => formatPrice(value, locale);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date) ||
          b.number.localeCompare(a.number),
      )
      .filter((order) => {
        if (statusFilter !== "all" && order.orderStatus !== statusFilter)
          return false;
        if (paymentFilter !== "all" && order.paymentStatus !== paymentFilter)
          return false;
        if (!query) return true;
        return (
          order.number.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query)
        );
      });
  }, [orders, search, statusFilter, paymentFilter]);

  const hasFilters =
    search.trim() !== "" || statusFilter !== "all" || paymentFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
  };

  const orderStatusLabel = (status) => t(`${BASE}.orderStatuses.${status}`);
  const paymentStatusLabel = (status) => t(`${BASE}.paymentStatuses.${status}`);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
          <ShoppingBag className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="max-w-md text-sm text-mute">{O("empty")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Búsqueda + filtros */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative min-w-0">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={O("searchPlaceholder")}
            aria-label={O("searchPlaceholder")}
            className={`${FIELD_CLASSES} w-full pl-10 pr-9 placeholder:text-mute/70`}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={O("clearSearch")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-mute transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label={O("statusFilter")}
          className={`${FIELD_CLASSES} cursor-pointer`}
        >
          <option value="all">{O("allStatuses")}</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {orderStatusLabel(status)}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          aria-label={O("paymentFilter")}
          className={`${FIELD_CLASSES} cursor-pointer`}
        >
          <option value="all">{O("allPayments")}</option>
          {PAYMENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {paymentStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <p role="status" className="text-xs text-mute">
        {O("showing")} {filteredOrders.length} {O("of")} {orders.length}
      </p>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
          <p className="max-w-md text-sm text-mute">{O("noResults")}</p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer rounded-xl border border-line-strong px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-brand"
            >
              {O("clearFilters")}
            </button>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            const itemCount = order.items.reduce((acc, i) => acc + i.qty, 0);
            const methodLabel = t(
              `solutions.simulator.ecommerce.checkout.methods.${order.paymentMethodId}`,
            );

            return (
              <li
                key={order.id}
                className="rounded-2xl border border-line bg-surface p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs font-bold text-brand">
                        {order.number}
                      </span>
                      <span className="truncate text-sm font-bold text-ink">
                        {order.customerName}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-mute">
                      {formatDateTime(order.date, locale)} · {itemCount}{" "}
                      {O("itemsWord")}
                    </p>
                    <p className="mt-2 font-display text-lg font-bold text-ink">
                      {money(order.total)}
                    </p>
                  </div>

                  <div className="grid shrink-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:w-[22rem]">
                    <StatusSelect
                      id={`order-status-${order.id}`}
                      label={O("orderStatus")}
                      value={order.orderStatus}
                      options={ORDER_STATUSES}
                      tones={ORDER_STATUS_TONE}
                      getLabel={orderStatusLabel}
                      onChange={(value) => onChangeOrderStatus(order.id, value)}
                    />
                    <StatusSelect
                      id={`payment-status-${order.id}`}
                      label={O("paymentStatus")}
                      value={order.paymentStatus}
                      options={PAYMENT_STATUSES}
                      tones={PAYMENT_STATUS_TONE}
                      getLabel={paymentStatusLabel}
                      onChange={(value) =>
                        onChangePaymentStatus(order.id, value)
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`order-detail-${order.id}`}
                  className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mute transition-colors hover:text-ink"
                >
                  {isExpanded ? O("hideDetail") : O("showDetail")}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded && (
                  <div
                    id={`order-detail-${order.id}`}
                    className="mt-4 grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-2"
                  >
                    <dl className="flex flex-col gap-2.5 text-sm">
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-mute">
                          {O("customer")}
                        </dt>
                        <dd className="font-medium text-ink">
                          {order.customerName}
                        </dd>
                        <dd>
                          <a
                            href={`mailto:${order.customerEmail}`}
                            className="break-all text-xs text-mute transition-colors hover:text-brand"
                          >
                            {order.customerEmail}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-mute">
                          {O("date")}
                        </dt>
                        <dd className="text-ink">
                          {formatDateTime(order.date, locale)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-mute">
                          {O("paymentMethod")}
                        </dt>
                        <dd className="text-ink">{methodLabel}</dd>
                      </div>
                    </dl>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-mute">
                        {O("products")}
                      </p>
                      <ul className="mt-2 flex flex-col gap-1.5">
                        {order.items.map((item) => (
                          <li
                            key={item.productId}
                            className="flex items-start justify-between gap-3 text-sm"
                          >
                            <span className="min-w-0 text-ink">
                              {getDisplayName(t, item)}{" "}
                              <span className="text-mute">x{item.qty}</span>
                            </span>
                            <span className="shrink-0 font-semibold text-ink">
                              {money(item.subtotal)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-mute">
                          {O("total")}
                        </span>
                        <span className="font-display text-base font-bold text-ink">
                          {money(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AdminOrdersTab;