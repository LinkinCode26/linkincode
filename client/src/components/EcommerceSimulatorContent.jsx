import { useRef, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Store,
  LayoutDashboard,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Plus,
  Minus,
  Bell,
} from "lucide-react";
import useLanguage from "../hooks/useLanguage";
import { useEcommerceStore } from "../hooks/useEcommerceStore";
import {
  PAYMENT_METHOD_IDS,
  formatPrice,
  getDisplayName,
  handleImageError,
} from "../utils/ecommerce";
import {
  AdminDashboardTab,
  AdminReportsTab,
} from "./ecommerce/EcommerceAdminDashboard";
import AdminOrdersTab from "./ecommerce/EcommerceAdminOrders";
import AdminProductsTab from "./ecommerce/EcommerceAdminProducts";
import AdminCustomersTab from "./ecommerce/EcommerceAdminCustomers";

const COLOR_OPTIONS = [
  {
    id: "brand",
    dotClass: "bg-brand",
    buttonClass: "bg-brand text-white hover:bg-brand/90",
  },
  {
    id: "accent",
    dotClass: "bg-accent",
    buttonClass: "bg-accent text-white hover:bg-accent/90",
  },
  {
    id: "indigo",
    dotClass: "bg-indigo-500",
    buttonClass: "bg-indigo-500 text-white hover:bg-indigo-600",
  },
  {
    id: "emerald",
    dotClass: "bg-emerald-500",
    buttonClass: "bg-emerald-500 text-white hover:bg-emerald-600",
  },
];

const ADMIN_TABS = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "orders", icon: ShoppingBag },
  { id: "products", icon: Package },
  { id: "customers", icon: Users },
  { id: "reports", icon: BarChart3 },
];

export function EcommerceSimulatorContent() {
  const { t, lang } = useLanguage();
  const locale = lang === "en" ? "en-US" : "es-AR";

  const {
    products,
    cart,
    cartItemCount,
    cartTotal,
    orders,
    customers,
    stats,
    unseenOrdersCount,
    addToCart,
    updateCartQty,
    removeFromCart,
    checkout,
    clearUnseenOrders,
    updateOrderStatus,
    updatePaymentStatus,
    addProduct,
    updateProduct,
    adjustStock,
    deleteProduct,
  } = useEcommerceStore();

  // Personalización visual de la tienda
  const [simTitle, setSimTitle] = useState("");
  const [simColor, setSimColor] = useState("brand");

  // Navegación Tienda vs Panel Admin
  const [activeView, setActiveView] = useState("store"); // "store" | "admin"
  const [activeAdminTab, setActiveAdminTab] = useState("orders");

  // Flujo de Checkout y Confirmación
  const [checkoutStep, setCheckoutStep] = useState("browse"); // "browse" | "form" | "confirmed"
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mercadopago");
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState(null);

  const viewTabRefs = useRef([]);
  const adminTabRefs = useRef([]);

  const activeColor =
    COLOR_OPTIONS.find((c) => c.id === simColor) || COLOR_OPTIONS[0];
  const activeColorStyle = activeColor.buttonClass;

  const money = (value) => formatPrice(value, locale);

  // Si el admin vació el carrito (por ejemplo eliminando un producto) mientras
  // el comprador estaba en el formulario de pago, se vuelve al catálogo.
  const step = checkoutStep === "form" && cart.length === 0 ? "browse" : checkoutStep;

  const handleSwitchView = (nextView) => {
    setActiveView(nextView);
    if (nextView === "admin" && activeAdminTab === "orders") {
      clearUnseenOrders();
    }
  };

  const handleViewTabKeyDown = (event, index) => {
    const views = ["store", "admin"];
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + dir + views.length) % views.length;
      handleSwitchView(views[nextIndex]);
      viewTabRefs.current[nextIndex]?.focus();
    }
  };

  const handleAdminTabChange = (tabId) => {
    setActiveAdminTab(tabId);
    if (tabId === "orders") {
      clearUnseenOrders();
    }
  };

  const handleAdminTabKeyDown = (event, index) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + dir + ADMIN_TABS.length) % ADMIN_TABS.length;
      const nextTab = ADMIN_TABS[nextIndex];
      handleAdminTabChange(nextTab.id);
      adminTabRefs.current[nextIndex]?.focus();
    }
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    if (!buyerName.trim() && simTitle.trim()) {
      setBuyerName(simTitle.trim());
    }
    setCheckoutStep("form");
  };

  const handleConfirmPayment = (event) => {
    event.preventDefault();
    if (cart.length === 0) return;

    const createdOrder = checkout({
      customerName: buyerName,
      customerEmail: buyerEmail,
      customerPhone: buyerPhone,
      paymentMethodId: paymentMethod,
      fallbackCustomerName:
        t("solutions.simulator.ecommerce.checkout.guestCustomer") ||
        "Cliente Web",
    });

    if (createdOrder) {
      setLastConfirmedOrder(createdOrder);
      setCheckoutStep("confirmed");
    }
  };

  const handleContinueShopping = () => {
    setCheckoutStep("browse");
    setLastConfirmedOrder(null);
  };

  const handleGoToAdminOrders = () => {
    setCheckoutStep("browse");
    setActiveView("admin");
    setActiveAdminTab("orders");
    clearUnseenOrders();
  };

  const adminBadgeCount = (tabId) => {
    if (tabId === "orders") return orders.length;
    if (tabId === "products") return products.length;
    if (tabId === "customers") return customers.length;
    return null;
  };

  const renderAdminContent = () => {
    switch (activeAdminTab) {
      case "products":
        return (
          <AdminProductsTab
            products={products}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onAdjustStock={adjustStock}
            onDelete={deleteProduct}
          />
        );
      case "customers":
        return <AdminCustomersTab customers={customers} />;
      case "reports":
        return <AdminReportsTab stats={stats} />;
      case "dashboard":
        return (
          <AdminDashboardTab
            stats={stats}
            orders={orders}
            customersCount={customers.length}
          />
        );
      default:
        return (
          <AdminOrdersTab
            orders={orders}
            onChangeOrderStatus={updateOrderStatus}
            onChangePaymentStatus={updatePaymentStatus}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* Barra superior de navegación: Tienda Online vs Panel Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-line">
        <div
          role="tablist"
          aria-label={t("solutions.simulator.ecommerce.nav.ariaLabel")}
          className="grid grid-cols-2 sm:inline-flex gap-1.5 bg-bg p-1 rounded-xl border border-line-strong"
        >
          <button
            ref={(el) => {
              viewTabRefs.current[0] = el;
            }}
            type="button"
            role="tab"
            id="ecom-tab-store"
            aria-selected={activeView === "store"}
            aria-controls="ecom-panel-store"
            tabIndex={activeView === "store" ? 0 : -1}
            onClick={() => handleSwitchView("store")}
            onKeyDown={(e) => handleViewTabKeyDown(e, 0)}
            className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-brand ${
              activeView === "store"
                ? "bg-brand text-white shadow-sm"
                : "text-mute hover:text-ink"
            }`}
          >
            <Store className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t("solutions.simulator.ecommerce.nav.store")}</span>
            {cartItemCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeView === "store"
                    ? "bg-white/20 text-white"
                    : "bg-brand/15 text-brand"
                }`}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            ref={(el) => {
              viewTabRefs.current[1] = el;
            }}
            type="button"
            role="tab"
            id="ecom-tab-admin"
            aria-selected={activeView === "admin"}
            aria-controls="ecom-panel-admin"
            tabIndex={activeView === "admin" ? 0 : -1}
            onClick={() => handleSwitchView("admin")}
            onKeyDown={(e) => handleViewTabKeyDown(e, 1)}
            className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-brand ${
              activeView === "admin"
                ? "bg-brand text-white shadow-sm"
                : "text-mute hover:text-ink"
            }`}
          >
            <LayoutDashboard
              className="w-3.5 h-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>{t("solutions.simulator.ecommerce.nav.admin")}</span>
            {unseenOrdersCount > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent text-white animate-pulse">
                +{unseenOrdersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-mute px-1">
          <span>
            {t("solutions.simulator.ecommerce.nav.ordersCounter")}:{" "}
            <strong className="text-ink">{orders.length}</strong>
          </span>
          <span className="text-line-strong">•</span>
          <span>
            {t("solutions.simulator.ecommerce.nav.cartCounter")}:{" "}
            <strong className="text-ink">{money(cartTotal)}</strong>
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VISTA 1: TIENDA ONLINE                                                 */}
      {/* ===================================================================== */}
      {activeView === "store" && (
        <div
          role="tabpanel"
          id="ecom-panel-store"
          aria-labelledby="ecom-tab-store"
          className="flex flex-col gap-5"
        >
          {/* Personalización de marca */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface p-4 rounded-2xl border border-line">
            <div>
              <label
                htmlFor="sim-ecommerce-client"
                className="block text-xs font-bold uppercase tracking-wider text-mute mb-2"
              >
                {t("solutions.simulator.ecommerce.clientName")}
              </label>
              <input
                id="sim-ecommerce-client"
                type="text"
                value={simTitle}
                onChange={(e) => setSimTitle(e.target.value)}
                placeholder={t("solutions.simulator.ecommerce.placeholder")}
                className="w-full bg-bg border border-line-strong rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                {t("solutions.simulator.colorLabel")}
              </span>
              <div className="flex gap-3 mt-2">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSimColor(option.id)}
                    aria-label={option.id}
                    aria-pressed={simColor === option.id}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      simColor === option.id
                        ? "scale-110 border-white shadow-lg"
                        : "border-transparent opacity-70"
                    } ${option.dotClass}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Contenedor principal de la tienda */}
          <div className="flex flex-col border border-line rounded-2xl overflow-hidden bg-bg">
            {/* Header de la tienda */}
            <div className="flex flex-wrap justify-between items-center gap-3 p-4 border-b border-line bg-surface/50">
              <span className="font-display font-bold text-lg text-ink truncate">
                {simTitle || t("solutions.simulator.ecommerce.defaultStore")}
              </span>
              <div className="flex items-center gap-2.5">
                <ShoppingCart
                  className="w-5 h-5 text-mute"
                  aria-hidden="true"
                />
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeColorStyle}`}
                >
                  {cartItemCount}
                </span>
                <span className="text-sm font-bold text-ink">
                  {money(cartTotal)}
                </span>
                <button
                  type="button"
                  disabled={cart.length === 0 || step !== "browse"}
                  onClick={openCheckout}
                  className={`ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    cart.length === 0 || step !== "browse"
                      ? "bg-surface border border-line text-mute opacity-50 cursor-not-allowed"
                      : `${activeColorStyle} cursor-pointer shadow-sm`
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
                  {t("solutions.simulator.ecommerce.checkout.payButton")}
                </button>
              </div>
            </div>

            {/* Paso Confirmación de Compra */}
            {step === "confirmed" && lastConfirmedOrder ? (
              <div className="p-5 sm:p-8 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
                </div>

                <div className="space-y-1 max-w-md">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent/15 text-accent">
                    {lastConfirmedOrder.number}
                  </span>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-ink">
                    {t("solutions.simulator.ecommerce.checkout.confirmedTitle")}
                  </h4>
                  <p className="text-xs sm:text-sm text-mute">
                    {t(
                      "solutions.simulator.ecommerce.checkout.confirmedSubtitle",
                    )}
                  </p>
                </div>

                {/* Comprobante con número de pedido, productos e importe */}
                <div className="w-full max-w-lg bg-surface border border-line rounded-2xl p-4 text-left flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-line text-xs">
                    <span className="text-mute">
                      {t("solutions.simulator.ecommerce.checkout.orderLabel")}:{" "}
                      <strong className="text-ink">
                        {lastConfirmedOrder.number}
                      </strong>
                    </span>
                    <span className="text-mute">
                      {t("solutions.simulator.ecommerce.checkout.buyerLabel")}:{" "}
                      <strong className="text-ink">
                        {lastConfirmedOrder.customerName}
                      </strong>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {lastConfirmedOrder.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between text-xs sm:text-sm"
                      >
                        <span className="text-ink">
                          {getDisplayName(t, item)}{" "}
                          <span className="text-mute">x{item.qty}</span>
                        </span>
                        <span className="font-semibold text-ink">
                          {money(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-line">
                    <span className="text-xs font-bold uppercase tracking-wider text-mute">
                      {lastConfirmedOrder.paymentStatus === "paid"
                        ? t("solutions.simulator.ecommerce.checkout.totalPaid")
                        : t("solutions.simulator.ecommerce.checkout.totalLabel")}{" "}
                      (
                      {t(
                        `solutions.simulator.ecommerce.checkout.methods.${lastConfirmedOrder.paymentMethodId}`,
                      )}
                      )
                    </span>
                    <span className="font-display text-base sm:text-lg font-bold text-accent-text">
                      {money(lastConfirmedOrder.total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-lg pt-1">
                  <button
                    type="button"
                    onClick={handleContinueShopping}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-line-strong text-xs font-bold uppercase tracking-wider text-ink hover:border-brand transition-colors cursor-pointer"
                  >
                    {t(
                      "solutions.simulator.ecommerce.checkout.continueShopping",
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleGoToAdminOrders}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-text text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-text/90 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                    />
                    {t("solutions.simulator.ecommerce.checkout.viewInAdmin")}
                  </button>
                </div>
              </div>
            ) : step === "form" ? (
              /* Paso Formulario de Pago Simulado */
              <form
                onSubmit={handleConfirmPayment}
                className="p-4 sm:p-6 flex flex-col gap-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("browse")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mute hover:text-ink transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    {t("solutions.simulator.ecommerce.checkout.backToCart")}
                  </button>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand">
                    {t("solutions.simulator.ecommerce.checkout.stepTitle")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="ecom-checkout-name"
                      className="text-xs font-semibold text-mute"
                    >
                      {t("solutions.simulator.ecommerce.checkout.buyerName")}
                    </label>
                    <input
                      id="ecom-checkout-name"
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder={t(
                        "solutions.simulator.ecommerce.checkout.buyerNamePlaceholder",
                      )}
                      className="w-full bg-surface border border-line-strong rounded-xl px-3.5 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="ecom-checkout-email"
                      className="text-xs font-semibold text-mute"
                    >
                      {t("solutions.simulator.ecommerce.checkout.buyerEmail")}
                    </label>
                    <input
                      id="ecom-checkout-email"
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder={t(
                        "solutions.simulator.ecommerce.checkout.buyerEmailPlaceholder",
                      )}
                      className="w-full bg-surface border border-line-strong rounded-xl px-3.5 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="ecom-checkout-phone"
                      className="text-xs font-semibold text-mute"
                    >
                      {t("solutions.simulator.ecommerce.checkout.buyerPhone")}
                    </label>
                    <input
                      id="ecom-checkout-phone"
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder={t(
                        "solutions.simulator.ecommerce.checkout.buyerPhonePlaceholder",
                      )}
                      className="w-full bg-surface border border-line-strong rounded-xl px-3.5 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                {/* Selección de medio de pago simulado */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-mute">
                    {t(
                      "solutions.simulator.ecommerce.checkout.paymentMethodLabel",
                    )}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {PAYMENT_METHOD_IDS.map((methodId) => {
                      const isSelected = paymentMethod === methodId;
                      return (
                        <button
                          key={methodId}
                          type="button"
                          onClick={() => setPaymentMethod(methodId)}
                          aria-pressed={isSelected}
                          className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                            isSelected
                              ? "bg-brand/15 border-brand text-brand"
                              : "bg-surface border-line-strong text-mute hover:text-ink"
                          }`}
                        >
                          {t(
                            `solutions.simulator.ecommerce.checkout.methods.${methodId}`,
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen del pedido a confirmar */}
                <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-mute">
                    {t("solutions.simulator.ecommerce.cartSummary")}
                  </span>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs sm:text-sm"
                    >
                      <span className="text-ink">
                        {getDisplayName(t, item)}{" "}
                        <span className="text-mute">x{item.qty}</span>
                      </span>
                      <span className="font-bold text-ink">
                        {money(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-line">
                    <span className="text-xs font-bold uppercase tracking-wider text-mute">
                      {t("solutions.simulator.ecommerce.checkout.totalLabel")}
                    </span>
                    <span className="font-display text-lg font-bold text-ink">
                      {money(cartTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("browse")}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-line-strong text-xs font-bold uppercase tracking-wider text-mute hover:text-ink transition-colors cursor-pointer"
                  >
                    {t("solutions.simulator.ecommerce.checkout.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={cart.length === 0}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${activeColorStyle}`}
                  >
                    <CreditCard className="w-4 h-4" aria-hidden="true" />
                    {t(
                      "solutions.simulator.ecommerce.checkout.confirmButton",
                    )}{" "}
                    ({money(cartTotal)})
                  </button>
                </div>
              </form>
            ) : (
              /* Catálogo + Carrito con botón Pagar */
              <>
                {products.length === 0 ? (
                  <p className="p-8 text-center text-sm text-mute">
                    {t("solutions.simulator.ecommerce.emptyCatalog")}
                  </p>
                ) : (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((product) => {
                      const productName = getDisplayName(t, product);
                      const inCartItem = cart.find(
                        (item) => item.id === product.id,
                      );
                      const inCartQty = inCartItem ? inCartItem.qty : 0;
                      const remainingStock = Math.max(
                        0,
                        product.stock - inCartQty,
                      );
                      const isOutOfStock = product.stock === 0;
                      const cannotAddMore = remainingStock === 0;

                      return (
                        <div
                          key={product.id}
                          className="flex flex-col items-center p-4 border border-line rounded-xl bg-surface h-full"
                        >
                          <div className="relative mb-3">
                            <img
                              key={product.image}
                              src={product.image}
                              alt={productName}
                              loading="lazy"
                              onError={handleImageError}
                              className={`w-20 h-20 object-cover rounded-lg ${
                                isOutOfStock ? "opacity-50 grayscale" : ""
                              }`}
                            />
                          </div>
                          <span className="text-sm font-bold text-ink text-center mb-1">
                            {productName}
                          </span>
                          <span className="text-xs font-semibold text-ink mb-1">
                            {money(product.price)}
                          </span>
                          <span
                            className={`text-[11px] mb-3 ${
                              isOutOfStock
                                ? "text-red-400 [[data-theme=light]_&]:text-red-700 font-semibold"
                                : product.stock <= product.lowStockThreshold
                                  ? "text-amber-400 [[data-theme=light]_&]:text-amber-700 font-semibold"
                                  : "text-mute"
                            }`}
                          >
                            {isOutOfStock
                              ? t("solutions.simulator.ecommerce.soldOut")
                              : `${product.stock} ${t("solutions.simulator.ecommerce.stockAvailable")}`}
                          </span>

                          <button
                            type="button"
                            disabled={cannotAddMore}
                            onClick={() => addToCart(product.id)}
                            className={`w-full py-2 text-xs font-bold rounded-lg transition-colors mt-auto ${
                              cannotAddMore
                                ? "bg-bg border border-line text-mute opacity-50 cursor-not-allowed"
                                : `${activeColorStyle} cursor-pointer`
                            }`}
                          >
                            {isOutOfStock
                              ? t("solutions.simulator.ecommerce.soldOut")
                              : cannotAddMore
                                ? t(
                                    "solutions.simulator.ecommerce.maxStockReached",
                                  )
                                : t("solutions.simulator.ecommerce.add")}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Resumen del carrito + Botón Pagar */}
                {cart.length > 0 ? (
                  <div className="p-4 bg-surface/40 border-t border-line flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase text-mute">
                        {t("solutions.simulator.ecommerce.cartSummary")} (
                        {cartItemCount})
                      </p>
                      <span className="text-sm font-bold text-ink">
                        {money(cartTotal)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                      {cart.map((item) => {
                        const itemName = getDisplayName(t, item);
                        return (
                          <div
                            key={item.id}
                            className="flex flex-wrap justify-between items-center gap-2 text-sm border-b border-line/50 pb-2"
                          >
                            <span className="text-ink font-medium">
                              {itemName}
                            </span>
                            <div className="flex items-center gap-2.5 ml-auto">
                              <div className="inline-flex items-center gap-1.5 bg-bg border border-line-strong rounded-lg px-1.5 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.id, -1)}
                                  aria-label={`Restar ${itemName}`}
                                  className="p-0.5 text-mute hover:text-ink cursor-pointer"
                                >
                                  <Minus
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                  />
                                </button>
                                <span className="text-xs font-bold text-ink min-w-[1.25rem] text-center">
                                  {item.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.id, 1)}
                                  aria-label={`Sumar ${itemName}`}
                                  className="p-0.5 text-mute hover:text-ink cursor-pointer"
                                >
                                  <Plus
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                              <span className="font-bold text-ink min-w-[4.5rem] text-right">
                                {money(item.price * item.qty)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                aria-label={`Quitar ${itemName}`}
                                className="p-1 text-red-400 [[data-theme=light]_&]:text-red-700 hover:opacity-80 cursor-pointer"
                              >
                                <Trash2
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <span className="text-xs text-mute">
                        {t("solutions.simulator.ecommerce.checkout.readyHint")}
                      </span>
                      <button
                        type="button"
                        onClick={openCheckout}
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${activeColorStyle}`}
                      >
                        <CreditCard className="w-4 h-4" aria-hidden="true" />
                        {t(
                          "solutions.simulator.ecommerce.checkout.payButton",
                        )}{" "}
                        · {money(cartTotal)}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-surface/20 border-t border-line flex items-center justify-between text-xs text-mute">
                    <span>{t("solutions.simulator.ecommerce.emptyCart")}</span>
                    <button
                      type="button"
                      disabled
                      className="px-3 py-1.5 rounded-lg border border-line text-mute opacity-50 cursor-not-allowed font-bold uppercase tracking-wider text-[11px]"
                    >
                      {t("solutions.simulator.ecommerce.checkout.payButton")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VISTA 2: PANEL DE ADMINISTRACIÓN CONECTADO AL STORE                    */}
      {/* ===================================================================== */}
      {activeView === "admin" && (
        <div
          role="tabpanel"
          id="ecom-panel-admin"
          aria-labelledby="ecom-tab-admin"
          className="flex flex-col gap-4 bg-bg border border-line rounded-2xl p-4 sm:p-5"
        >
          {/* Navegación interna del Panel Admin (responsive + teclado) */}
          <div
            role="tablist"
            aria-label={t("solutions.simulator.ecommerce.admin.navAriaLabel")}
            className="flex flex-wrap gap-2 pb-3 border-b border-line"
          >
            {ADMIN_TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const isSelected = activeAdminTab === tab.id;
              const badgeCount = adminBadgeCount(tab.id);

              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    adminTabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`ecom-admin-tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`ecom-admin-panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleAdminTabChange(tab.id)}
                  onKeyDown={(e) => handleAdminTabKeyDown(e, idx)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-brand ${
                    isSelected
                      ? "bg-brand/15 border-brand text-brand"
                      : "bg-surface border-line-strong text-mute hover:text-ink hover:border-brand/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {t(`solutions.simulator.ecommerce.admin.tabs.${tab.id}`)}
                  </span>
                  {badgeCount !== null && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-bg border border-line text-ink">
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Alerta visual si entró un pedido nuevo desde la tienda */}
          {unseenOrdersCount > 0 && (
            <div
              role="status"
              className="flex flex-wrap items-center justify-between gap-2 bg-accent/15 border border-accent/30 rounded-xl px-3.5 py-2.5 text-xs"
            >
              <div className="flex items-center gap-2 text-accent-text font-semibold">
                <Bell className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  {t("solutions.simulator.ecommerce.admin.newOrderBanner")} (+
                  {unseenOrdersCount})
                </span>
              </div>
              {activeAdminTab !== "orders" && (
                <button
                  type="button"
                  onClick={() => handleAdminTabChange("orders")}
                  className="px-3 py-1 rounded-lg bg-brand-text text-white font-bold uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  {t("solutions.simulator.ecommerce.admin.viewOrdersCta")}
                </button>
              )}
            </div>
          )}

          {/* Contenido del Admin según pestaña activa */}
          <div
            role="tabpanel"
            id={`ecom-admin-panel-${activeAdminTab}`}
            aria-labelledby={`ecom-admin-tab-${activeAdminTab}`}
          >
            {renderAdminContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default EcommerceSimulatorContent;