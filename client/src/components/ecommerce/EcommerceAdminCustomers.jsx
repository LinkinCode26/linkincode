import { useMemo, useState } from "react";
import { ChevronDown, Search, Users, X } from "lucide-react";
import useLanguage from "../../hooks/useLanguage";
import {
  ORDER_STATUS_TONE,
  PAYMENT_STATUS_TONE,
  badgeClasses,
  formatDate,
  formatPrice,
  getInitials,
  isActiveOrder,
} from "../../utils/ecommerce";

const BASE = "solutions.simulator.ecommerce.admin";

export function AdminCustomersTab({ customers }) {
  const { t, lang } = useLanguage();
  const locale = lang === "en" ? "en-US" : "es-AR";
  const C = (key) => t(`${BASE}.customers.${key}`);
  const money = (value) => formatPrice(value, locale);

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Los que compraron más recientemente van primero.
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...customers]
      .sort(
        (a, b) =>
          new Date(b.lastOrderDate ?? 0) - new Date(a.lastOrderDate ?? 0),
      )
      .filter((customer) => {
        if (!query) return true;
        return (
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          (customer.phone ?? "").toLowerCase().includes(query)
        );
      });
  }, [customers, search]);

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
          <Users className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="max-w-md text-sm text-mute">{C("empty")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-display text-base font-bold text-ink">
          {C("title")} ({customers.length})
        </h4>
        <div className="relative min-w-0 sm:w-80">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={C("searchPlaceholder")}
            aria-label={C("searchPlaceholder")}
            className="w-full rounded-xl border border-line-strong bg-surface py-2.5 pl-10 pr-9 text-sm text-ink transition-colors placeholder:text-mute/70 focus:border-brand focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={C("clearSearch")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-mute transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center text-sm text-mute">
          {C("noResults")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredCustomers.map((customer) => {
            const isExpanded = expandedId === customer.id;

            return (
              <li
                key={customer.id}
                className="rounded-2xl border border-line bg-surface p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                      {getInitials(customer.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">
                        {customer.name}
                      </p>
                      <a
                        href={`mailto:${customer.email}`}
                        className="block truncate text-xs text-mute transition-colors hover:text-brand"
                      >
                        {customer.email}
                      </a>
                      <p className="truncate text-xs text-mute">
                        {customer.phone || C("noPhone")}
                      </p>
                    </div>
                  </div>

                  <dl className="grid shrink-0 grid-cols-2 gap-4 text-left sm:text-right">
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-mute">
                        {C("purchases")}
                      </dt>
                      <dd className="font-display text-lg font-bold text-ink">
                        {customer.ordersCount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-mute">
                        {C("totalSpent")}
                      </dt>
                      <dd className="font-display text-lg font-bold text-accent-text">
                        {money(customer.totalSpent)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`customer-detail-${customer.id}`}
                  className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mute transition-colors hover:text-ink"
                >
                  {isExpanded ? C("hideHistory") : C("showHistory")}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded && (
                  <div
                    id={`customer-detail-${customer.id}`}
                    className="mt-4 flex flex-col gap-4 border-t border-line pt-4"
                  >
                    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                      <div className="min-w-0">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-mute">
                          {C("email")}
                        </dt>
                        <dd className="break-all text-ink">{customer.email}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-mute">
                          {C("phone")}
                        </dt>
                        <dd className="text-ink">
                          {customer.phone || C("noPhone")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-mute">
                          {C("lastPurchase")}
                        </dt>
                        <dd className="text-ink">
                          {customer.lastOrderDate
                            ? formatDate(customer.lastOrderDate, locale)
                            : "—"}
                        </dd>
                      </div>
                    </dl>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-mute">
                        {C("history")}
                      </p>
                      {customer.history.length === 0 ? (
                        <p className="mt-2 text-sm text-mute">
                          {C("noHistory")}
                        </p>
                      ) : (
                        <ul className="mt-2 flex flex-col gap-2">
                          {customer.history.map((order) => {
                            const active = isActiveOrder(order);
                            return (
                              <li
                                key={order.id}
                                className="flex flex-col gap-2 rounded-xl border border-line bg-bg p-3 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-ink">
                                    <span className="text-brand">
                                      {order.number}
                                    </span>{" "}
                                    <span className="text-xs font-normal text-mute">
                                      {formatDate(order.date, locale)}
                                    </span>
                                  </p>
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    <span
                                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses(
                                        ORDER_STATUS_TONE[order.orderStatus],
                                      )}`}
                                    >
                                      {t(
                                        `${BASE}.orderStatuses.${order.orderStatus}`,
                                      )}
                                    </span>
                                    <span
                                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses(
                                        PAYMENT_STATUS_TONE[order.paymentStatus],
                                      )}`}
                                    >
                                      {t(
                                        `${BASE}.paymentStatuses.${order.paymentStatus}`,
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={`shrink-0 text-sm font-bold ${
                                    active ? "text-ink" : "text-mute line-through"
                                  }`}
                                >
                                  {money(order.total)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <p className="mt-3 text-[11px] text-mute">
                        {C("historyNote")}
                      </p>
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

export default AdminCustomersTab;