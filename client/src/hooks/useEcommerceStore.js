import { useCallback, useMemo, useState } from "react";
import { products as mockProducts } from "../data/mock/products";
import {
  ORDER_STATUSES,
  PAYMENT_METHOD_IDS,
  PAYMENT_STATUSES,
  PLACEHOLDER_IMAGE,
  isActiveOrder,
} from "../utils/ecommerce";

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

const sum = (list, pick) => list.reduce((acc, item) => acc + pick(item), 0);

const line = (productId, name, price, qty) => ({
  productId,
  name,
  i18n: true, // producto original: su nombre se traduce con t()
  price,
  qty,
  subtotal: price * qty,
});

// Los pedidos guardan el medio de pago como id (no como texto traducido) para
// que se muestre en el idioma activo.
const INITIAL_ORDERS = [
  {
    id: "ord-1001",
    number: "ORD-1001",
    date: "2026-11-14T14:20:00.000Z",
    customerId: "cust-1",
    customerName: "Martina López",
    customerEmail: "martina.lopez@ejemplo.com",
    items: [
      line("prod-1", "Auriculares Inalámbricos", 45000, 1),
      line("prod-3", "Botella Térmica 1L", 18500, 1),
    ],
    total: 63500,
    paymentMethodId: "mercadopago",
    paymentStatus: "paid",
    orderStatus: "delivered",
  },
  {
    id: "ord-1002",
    number: "ORD-1002",
    date: "2026-11-15T10:45:00.000Z",
    customerId: "cust-2",
    customerName: "Lucas Fernández",
    customerEmail: "lucas.fernandez@ejemplo.com",
    items: [line("prod-4", "Teclado Mecánico", 68000, 1)],
    total: 68000,
    paymentMethodId: "card",
    paymentStatus: "paid",
    orderStatus: "preparing",
  },
  {
    id: "ord-1003",
    number: "ORD-1003",
    date: "2026-11-15T18:10:00.000Z",
    customerId: "cust-3",
    customerName: "Sofía Pereyra",
    customerEmail: "sofia.pereyra@ejemplo.com",
    items: [line("prod-2", "Mochila Urbana", 39000, 2)],
    total: 78000,
    paymentMethodId: "transfer",
    paymentStatus: "pending",
    orderStatus: "new",
  },
];

// Solo datos de contacto: las compras, el total gastado y la última compra
// se calculan a partir de los pedidos (así nunca quedan desincronizados cuando
// el admin cambia un estado).
const INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Martina López",
    email: "martina.lopez@ejemplo.com",
    phone: "+54 11 4521-8890",
  },
  {
    id: "cust-2",
    name: "Lucas Fernández",
    email: "lucas.fernandez@ejemplo.com",
    phone: "+54 351 612-3340",
  },
  {
    id: "cust-3",
    name: "Sofía Pereyra",
    email: "sofia.pereyra@ejemplo.com",
    phone: "+54 381 504-9912",
  },
];

function cloneInitialProducts() {
  return mockProducts.map((product) => ({ ...product, i18n: true }));
}

function buildEmailFromName(name) {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");
  return `${slug || "cliente"}@ejemplo.com`;
}

function nextOrderNumber(orders) {
  const max = orders.reduce(
    (acc, order) => Math.max(acc, Number(order.number.replace(/\D/g, "")) || 0),
    1000,
  );
  return max + 1;
}

// Los ids no pueden llevar "." porque se usan dentro de una clave de t().
function createProductId() {
  return `prod-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

export function useEcommerceStore() {
  const [products, setProducts] = useState(cloneInitialProducts);
  // El carrito guarda solo { id, qty }: nombre, precio y stock se leen del
  // catálogo en cada render, así un cambio del admin se refleja al instante.
  const [cartLines, setCartLines] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customerRecords, setCustomerRecords] = useState(INITIAL_CUSTOMERS);
  const [unseenOrdersCount, setUnseenOrdersCount] = useState(0);

  // ---------------------------------------------------------------------
  // Carrito (derivado del catálogo)
  // ---------------------------------------------------------------------
  const cart = useMemo(
    () =>
      cartLines.reduce((acc, cartLine) => {
        const product = products.find((p) => p.id === cartLine.id);
        // Producto eliminado o agotado: sale del carrito.
        if (!product || product.stock <= 0) return acc;
        acc.push({
          id: product.id,
          name: product.name,
          i18n: product.i18n,
          price: product.price,
          image: product.image,
          qty: Math.min(cartLine.qty, product.stock),
        });
        return acc;
      }, []),
    [cartLines, products],
  );

  const addToCart = useCallback(
    (productId) => {
      const product = products.find((p) => p.id === productId);
      if (!product || product.stock <= 0) return;

      setCartLines((prev) => {
        const existing = prev.find((item) => item.id === productId);
        if (!existing) return [...prev, { id: productId, qty: 1 }];
        if (existing.qty >= product.stock) return prev;
        return prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item,
        );
      });
    },
    [products],
  );

  const updateCartQty = useCallback(
    (productId, delta) => {
      const product = products.find((p) => p.id === productId);
      const maxStock = product ? product.stock : 0;

      setCartLines((prev) =>
        prev
          .map((item) => {
            if (item.id !== productId) return item;
            const nextQty = Math.min(
              maxStock,
              Math.min(item.qty, maxStock) + delta,
            );
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          })
          .filter(Boolean),
      );
    },
    [products],
  );

  const removeFromCart = useCallback((productId) => {
    setCartLines((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // ---------------------------------------------------------------------
  // Checkout: crea el pedido, descuenta stock y crea/actualiza al cliente
  // ---------------------------------------------------------------------
  const checkout = useCallback(
    ({
      customerName,
      customerEmail,
      customerPhone,
      paymentMethodId,
      fallbackCustomerName,
    }) => {
      if (cart.length === 0) return null;

      const cleanName =
        (customerName || "").trim() || fallbackCustomerName || "Cliente Web";
      const cleanEmail =
        (customerEmail || "").trim().toLowerCase() ||
        buildEmailFromName(cleanName);
      const cleanPhone = (customerPhone || "").trim();

      const orderItems = cart.map((item) => ({
        productId: item.id,
        name: item.name,
        i18n: item.i18n,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty,
      }));
      const orderTotal = sum(orderItems, (item) => item.subtotal);
      const nowIso = new Date().toISOString();

      // El cliente se identifica por email. Los ids se calculan acá afuera
      // para que los updaters de setState sigan siendo puros.
      const existingCustomer = customerRecords.find(
        (c) => c.email.toLowerCase() === cleanEmail,
      );
      const customerId = existingCustomer
        ? existingCustomer.id
        : `cust-${Date.now()}`;

      const newOrder = {
        id: `ord-${Date.now()}`,
        number: `ORD-${nextOrderNumber(orders)}`,
        date: nowIso,
        customerId,
        customerName: existingCustomer ? existingCustomer.name : cleanName,
        customerEmail: cleanEmail,
        items: orderItems,
        total: orderTotal,
        paymentMethodId: paymentMethodId || "mercadopago",
        // Estado inicial: la transferencia queda pendiente de acreditación;
        // Mercado Pago y tarjeta se aprueban en el momento.
        paymentStatus: paymentMethodId === "transfer" ? "pending" : "paid",
        orderStatus: "new",
      };

      setOrders((prev) => [newOrder, ...prev]);

      setProducts((prev) =>
        prev.map((product) => {
          const purchased = orderItems.find((i) => i.productId === product.id);
          if (!purchased) return product;
          return {
            ...product,
            stock: Math.max(0, product.stock - purchased.qty),
          };
        }),
      );

      setCustomerRecords((prev) => {
        if (existingCustomer) {
          return prev.map((c) =>
            c.id === existingCustomer.id
              ? { ...c, phone: cleanPhone || c.phone }
              : c,
          );
        }
        return [
          {
            id: customerId,
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
          },
          ...prev,
        ];
      });

      setCartLines([]);
      setUnseenOrdersCount((prev) => prev + 1);

      return newOrder;
    },
    [cart, orders, customerRecords],
  );

  const clearUnseenOrders = useCallback(() => {
    setUnseenOrdersCount(0);
  }, []);

  // ---------------------------------------------------------------------
  // Admin: pedidos
  // ---------------------------------------------------------------------
  const updateOrderStatus = useCallback((orderId, orderStatus) => {
    if (!ORDER_STATUSES.includes(orderStatus)) return;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, orderStatus } : order,
      ),
    );
  }, []);

  const updatePaymentStatus = useCallback((orderId, paymentStatus) => {
    if (!PAYMENT_STATUSES.includes(paymentStatus)) return;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, paymentStatus } : order,
      ),
    );
  }, []);

  // ---------------------------------------------------------------------
  // Admin: productos
  // ---------------------------------------------------------------------
  const addProduct = useCallback(({ name, price, stock, image }) => {
    const product = {
      id: createProductId(),
      name: name.trim(),
      price: Number(price),
      stock: Math.floor(Number(stock)),
      lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
      image: (image || "").trim() || PLACEHOLDER_IMAGE,
      i18n: false, // producto nuevo: no tiene clave de traducción
    };
    setProducts((prev) => [product, ...prev]);
    return product;
  }, []);

  // changes puede traer: name, i18n, price, stock, image
  const updateProduct = useCallback((productId, changes) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...changes } : product,
      ),
    );
  }, []);

  const adjustStock = useCallback((productId, delta) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, stock: Math.max(0, product.stock + delta) }
          : product,
      ),
    );
  }, []);

  const deleteProduct = useCallback((productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    setCartLines((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // ---------------------------------------------------------------------
  // Datos derivados
  // ---------------------------------------------------------------------
  const cartItemCount = useMemo(() => sum(cart, (item) => item.qty), [cart]);
  const cartTotal = useMemo(
    () => sum(cart, (item) => item.price * item.qty),
    [cart],
  );

  // Cada cliente trae su historial y sus totales, calculados desde los
  // pedidos vigentes (no cancelados y con pago no rechazado).
  const customers = useMemo(
    () =>
      customerRecords.map((customer) => {
        const history = orders
          .filter((order) => order.customerId === customer.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        const active = history.filter(isActiveOrder);
        return {
          ...customer,
          history,
          ordersCount: active.length,
          totalSpent: sum(active, (order) => order.total),
          lastOrderDate: history[0]?.date ?? null,
        };
      }),
    [customerRecords, orders],
  );

  // Métricas del dashboard: se recalculan solas cuando cambia un estado.
  const stats = useMemo(() => {
    const active = orders.filter(isActiveOrder);
    const paid = active.filter((o) => o.paymentStatus === "paid");
    const pending = active.filter((o) => o.paymentStatus === "pending");

    const ordersByStatus = Object.fromEntries(
      ORDER_STATUSES.map((s) => [
        s,
        orders.filter((o) => o.orderStatus === s).length,
      ]),
    );
    const paymentsByStatus = Object.fromEntries(
      PAYMENT_STATUSES.map((s) => [
        s,
        orders.filter((o) => o.paymentStatus === s).length,
      ]),
    );

    const salesByMethod = PAYMENT_METHOD_IDS.map((id) => ({
      id,
      total: sum(
        paid.filter((o) => o.paymentMethodId === id),
        (o) => o.total,
      ),
    }));

    const productMap = new Map();
    active.forEach((order) =>
      order.items.forEach((item) => {
        const entry = productMap.get(item.productId) ?? {
          id: item.productId,
          name: item.name,
          i18n: item.i18n,
          units: 0,
          revenue: 0,
        };
        entry.units += item.qty;
        entry.revenue += item.subtotal;
        productMap.set(item.productId, entry);
      }),
    );
    const topProducts = [...productMap.values()]
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    return {
      revenue: sum(paid, (o) => o.total),
      pendingRevenue: sum(pending, (o) => o.total),
      ordersTotal: orders.length,
      ordersByStatus,
      paymentsByStatus,
      salesByMethod,
      topProducts,
      lowStock: products.filter((p) => p.stock <= p.lowStockThreshold).length,
      outOfStock: products.filter((p) => p.stock <= 0).length,
    };
  }, [orders, products]);

  return {
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
  };
}

export default useEcommerceStore;