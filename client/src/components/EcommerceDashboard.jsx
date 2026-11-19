import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import useLanguage from "../hooks/useLanguage";

const KpiCard = ({ label, value, hint, valueClassName = "text-ink" }) => (
  <div className="bg-surface border border-line rounded-xl p-3.5">
    <span className="block text-[10px] font-bold uppercase tracking-wider text-mute">
      {label}
    </span>
    <span
      className={`block mt-1 font-display text-base sm:text-xl font-bold ${valueClassName}`}
    >
      {value}
    </span>
    {hint && <span className="block mt-1 text-[11px] text-mute">{hint}</span>}
  </div>
);

const EcommerceDashboard = ({ orders, products, formatPrice }) => {
  const { t } = useLanguage();
  const base = "solutions.simulator.ecommerce.admin.dashboard";

  const pendingPayments = orders.filter((o) => o.paymentStatus === "pending"); //Pagos pendientes

  const toPrepare = orders.filter(
    (
      o, //Por preparar
    ) => ["pending", "preparing"].includes(o.orderStatus),
  );
  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold); //Stock bajo

  const now = new Date();

  const paidThisMonth = orders.filter(
    //Pagados este mes
    (o) =>
      o.paymentStatus === "paid" &&
      new Date(o.date).getMonth() === now.getMonth() &&
      new Date(o.date).getFullYear() === now.getFullYear(),
  );

  const salesMonth = paidThisMonth.reduce((acc, o) => acc + o.total, 0); //Ventas del mes

  const paidToday = orders.filter(
    //Pagados de hoy
    (o) =>
      o.paymentStatus === "paid" &&
      new Date(o.date).toDateString() === now.toDateString(),
  );

  const salesToday = paidToday.reduce((acc, o) => acc + o.total, 0); //Ventas de hoy

  const salesByDay = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);

    const paidThatDay = orders.filter(
      (o) =>
        o.paymentStatus === "paid" &&
        new Date(o.date).toDateString() === day.toDateString(),
    );

    salesByDay.push({
      label: `${day.getDate()}/${day.getMonth() + 1}`,
      ventas: paidThatDay.reduce((acc, o) => acc + o.total, 0),
    });
  }
  // console.log(salesByDay)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard label={t(`${base}.ordersReceived`)} value={orders.length} />
        <KpiCard
          label={t(`${base}.pendingPayments`)}
          value={pendingPayments.length}
        />
        <KpiCard label={t(`${base}.toPrepare`)} value={toPrepare.length} />
        <KpiCard label={t(`${base}.lowStock`)} value={lowStock.length} />
        <KpiCard
          label={t(`${base}.sales`)}
          value={formatPrice(salesToday)}
          hint={`${t(`${base}.thisMonth`)}: ${formatPrice(salesMonth)}`}
          valueClassName="text-accent"
        />
      </div>

      <div className="bg-surface border border-line rounded-xl p-3.5">
        <p className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
          Evolución de ventas, últimos 7 días
        </p>
        <div className="w-full h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesByDay}
              margin={{ top: 5, right: 18, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--brand)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--brand)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--line)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                stroke="var(--mute)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={12}
              />
              <YAxis
                stroke="var(--mute)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              />
              <Tooltip
                formatter={(v) => formatPrice(v)}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="ventas"
                name="Ventas"
                stroke="var(--brand)"
                strokeWidth={2.5}
                fill="url(#salesFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EcommerceDashboard;
