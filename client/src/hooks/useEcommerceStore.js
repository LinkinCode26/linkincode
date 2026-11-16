import { useCallback, useMemo, useState } from "react";
import { products as mockProducts } from "../data/mock/products";

const INITIAL_ORDERS = [
  {
    id: "ord-1001",
    number: "ORD-1001",
    date: "2026-11-14T14:20:00.000Z",
    customerName: "Martina López",
    customerEmail: "martina.lopez@ejemplo.com",
    items: [
      {
        productId: "prod-1",
        name: "Auriculares Inalámbricos",
        price: 45000,
        qty: 1,
        subtotal: 45000,
      },
      {
        productId: "prod-3",
        name: "Botella Térmica 1L",
        price: 18500,
        qty: 1,
        subtotal: 18500,
      },
    ],
    total: 63500,
    paymentMethod: "Mercado Pago",
    paymentStatus: "paid",
    orderStatus: "delivered",
  },
  {
    id: "ord-1002",
    number: "ORD-1002",
    date: "2026-11-15T10:45:00.000Z",
    customerName: "Lucas Fernández",
    customerEmail: "lucas.fernandez@ejemplo.com",
    items: [
      {
        productId: "prod-4",
        name: "Teclado Mecánico",
        price: 68000,
        qty: 1,
        subtotal: 68000,
      },
    ],
    total: 68000,
    paymentMethod: "Tarjeta de crédito",
    paymentStatus: "paid",
    orderStatus: "preparing",
  },
  {
    id: "ord-1003",
    number: "ORD-1003",
    date: "2026-11-15T18:10:00.000Z",
    customerName: "Sofía Pereyra",
    customerEmail: "sofia.pereyra@ejemplo.com",
    items: [
      {
        productId: "prod-2",
        name: "Mochila Urbana",
        price: 39000,
        qty: 2,
        subtotal: 78000,
      },
    ],
    total: 78000,
    paymentMethod: "Transferencia",
    paymentStatus: "pending",
    orderStatus: "pending",
  },
];

const INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Martina López",
    email: "martina.lopez@ejemplo.com",
    phone: "+54 11 4521-8890",
    ordersCount: 1,
    totalSpent: 63500,
    lastOrderDate: "2026-11-14T14:20:00.000Z",
    orderNumbers: ["ORD-1001"],
  },
  {
    id: "cust-2",
    name: "Lucas Fernández",
    email: "lucas.fernandez@ejemplo.com",
    phone: "+54 351 612-3340",
    ordersCount: 1,
    totalSpent: 68000,
    lastOrderDate: "2026-11-15T10:45:00.000Z",
    orderNumbers: ["ORD-1002"],
  },
  {
    id: "cust-3",
    name: "Sofía Pereyra",
    email: "sofia.pereyra@ejemplo.com",
    phone: "+54 381 504-9912",
    ordersCount: 1,
    totalSpent: 78000,
    lastOrderDate: "2026-11-15T18:10:00.000Z",
    orderNumbers: ["ORD-1003"],
  },
];

function cloneInitialProducts() {
  return mockProducts.map((product) => ({ ...product }));
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

export function useEcommerceStore() {
  const [products, setProducts] = useState(cloneInitialProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [unseenOrdersCount, setUnseenOrdersCount] = useState(0);

  const addToCart = useCallback(
    (product) => {
      const currentProduct = products.find((p) => p.id === product.id);
      if (!currentProduct || currentProduct.stock <= 0) return;

      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          if (existing.qty >= currentProduct.stock) return prev;
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, name: product.name, qty: item.qty + 1 }
              : item,
          );
        }
        return [
          ...prev,
          {
            id: currentProduct.id,
            name: product.name,
            price: currentProduct.price,
            image: currentProduct.image,
            qty: 1,
          },
        ];
      });
    },
    [products],
  );

  const updateCartQty = useCallback(
    (productId, delta) => {
      const currentProduct = products.find((p) => p.id === productId);
      const maxStock = currentProduct ? currentProduct.stock : 0;

      setCart((prev) =>
        prev
          .map((item) => {
            if (item.id !== productId) return item;
            const nextQty = Math.min(maxStock, item.qty + delta);
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          })
          .filter(Boolean),
      );
    },
    [products],
  );

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const checkout = useCallback(
    ({ customerName, customerEmail, paymentMethod, fallbackCustomerName }) => {
      if (cart.length === 0) return null;

      const cleanName =
        (customerName || "").trim() || fallbackCustomerName || "Cliente Web";
      const cleanEmail =
        (customerEmail || "").trim().toLowerCase() ||
        buildEmailFromName(cleanName);

      const orderItems = cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty,
      }));

      const orderTotal = orderItems.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );
      const orderNumber = `ORD-${1000 + orders.length + 1}`;
      const nowIso = new Date().toISOString();

      const newOrder = {
        id: `ord-${Date.now()}`,
        number: orderNumber,
        date: nowIso,
        customerName: cleanName,
        customerEmail: cleanEmail,
        items: orderItems,
        total: orderTotal,
        paymentMethod: paymentMethod || "Mercado Pago",
        paymentStatus: "paid",
        orderStatus: "preparing",
      };

      // 1. Registrar el nuevo pedido al inicio
      setOrders((prev) => [newOrder, ...prev]);

      // 2. Descontar stock en el catálogo compartido (sin mutar el mock global)
      setProducts((prev) =>
        prev.map((prod) => {
          const purchased = orderItems.find((i) => i.productId === prod.id);
          if (!purchased) return prod;
          return {
            ...prod,
            stock: Math.max(0, prod.stock - purchased.qty),
          };
        }),
      );

      // 3. Crear o actualizar cliente
      setCustomers((prev) => {
        const normalizedTargetName = cleanName.toLowerCase();
        const existingIndex = prev.findIndex(
          (c) =>
            c.email.toLowerCase() === cleanEmail ||
            c.name.toLowerCase() === normalizedTargetName,
        );

        if (existingIndex >= 0) {
          return prev.map((cust, idx) =>
            idx === existingIndex
              ? {
                  ...cust,
                  name: cleanName,
                  email: cleanEmail,
                  ordersCount: cust.ordersCount + 1,
                  totalSpent: cust.totalSpent + orderTotal,
                  lastOrderDate: nowIso,
                  orderNumbers: [orderNumber, ...cust.orderNumbers],
                }
              : cust,
          );
        }

        return [
          {
            id: `cust-${Date.now()}`,
            name: cleanName,
            email: cleanEmail,
            phone: "+54 11 5555-0199",
            ordersCount: 1,
            totalSpent: orderTotal,
            lastOrderDate: nowIso,
            orderNumbers: [orderNumber],
          },
          ...prev,
        ];
      });

      // 4. Vaciar carrito y marcar notificación para el Panel Admin
      setCart([]);
      setUnseenOrdersCount((prev) => prev + 1);

      return newOrder;
    },
    [cart, orders.length],
  );

  const clearUnseenOrders = useCallback(() => {
    setUnseenOrdersCount(0);
  }, []);

  const cartItemCount = useMemo(
    () => cart.reduce((total, item) => total + item.qty, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.qty, 0),
    [cart],
  );

  return {
    products,
    cart,
    cartItemCount,
    cartTotal,
    orders,
    customers,
    unseenOrdersCount,
    addToCart,
    updateCartQty,
    removeFromCart,
    checkout,
    clearUnseenOrders,
  };
}

export default useEcommerceStore;
