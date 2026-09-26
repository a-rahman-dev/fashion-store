import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/db";

// ══════════════════════════════════════════════════════════
// Mock Orders (for demo)
// ══════════════════════════════════════════════════════════
export type MockOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_city: string;
  items_count: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  payment_status: "pending" | "paid" | "failed";
  created_at: string;
};

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "mock-1",
    order_number: "LV-2026-A3F9K2",
    customer_name: "Ayesha Khan",
    customer_email: "ayesha.khan@example.com",
    customer_city: "Karachi",
    items_count: 2,
    total: 45000,
    status: "delivered",
    payment_status: "paid",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-2",
    order_number: "LV-2026-B7H4M1",
    customer_name: "Hassan Ali",
    customer_email: "hassan.ali@example.com",
    customer_city: "Lahore",
    items_count: 1,
    total: 35000,
    status: "shipped",
    payment_status: "paid",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-3",
    order_number: "LV-2026-C2P8N5",
    customer_name: "Fatima Zahra",
    customer_email: "fatima.z@example.com",
    customer_city: "Islamabad",
    items_count: 3,
    total: 78500,
    status: "processing",
    payment_status: "paid",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-4",
    order_number: "LV-2026-D9W3Q7",
    customer_name: "Bilal Ahmed",
    customer_email: "bilal.a@example.com",
    customer_city: "Rawalpindi",
    items_count: 1,
    total: 18500,
    status: "confirmed",
    payment_status: "paid",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-5",
    order_number: "LV-2026-E5R2T9",
    customer_name: "Sana Malik",
    customer_email: "sana.m@example.com",
    customer_city: "Faisalabad",
    items_count: 4,
    total: 125000,
    status: "pending",
    payment_status: "pending",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-6",
    order_number: "LV-2026-F8Y6U4",
    customer_name: "Umar Farooq",
    customer_email: "umar.f@example.com",
    customer_city: "Multan",
    items_count: 2,
    total: 52000,
    status: "cancelled",
    payment_status: "failed",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-7",
    order_number: "LV-2026-G1V7I3",
    customer_name: "Zainab Rizvi",
    customer_email: "zainab.r@example.com",
    customer_city: "Peshawar",
    items_count: 1,
    total: 32000,
    status: "delivered",
    payment_status: "paid",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-8",
    order_number: "LV-2026-H4J9O2",
    customer_name: "Ahmed Raza",
    customer_email: "ahmed.r@example.com",
    customer_city: "Quetta",
    items_count: 2,
    total: 65000,
    status: "delivered",
    payment_status: "paid",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ══════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════
export type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  thisMonthOrders: number;
};

export type MockOrderDetail = MockOrder & {
  items: Array<{
    id: string;
    product_name: string;
    product_slug: string;
    variant_label: string | null;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  delivery_fee: number;
  payment_method: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    city: string;
    postal_code: string;
    country: string;
  };
  timeline: Array<{
    status: string;
    date: string;
    completed: boolean;
  }>;
};

// ══════════════════════════════════════════════════════════
// Get Real Orders (from Supabase)
// ══════════════════════════════════════════════════════════
export async function getRealOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getRealOrders error:", error);
    return [];
  }

  return data ?? [];
}

// ══════════════════════════════════════════════════════════
// Get Orders for Seller (Real Supabase + Mock fallback)
// ══════════════════════════════════════════════════════════
export async function getOrdersForSeller(): Promise<MockOrder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      total,
      payment_status,
      created_at,
      shipping_address,
      order_items (
        product_name,
        image_url,
        quantity
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getOrdersForSeller error:", error);
    return MOCK_ORDERS;
  }

  const realOrders: MockOrder[] = (data ?? []).map((order: any) => {
    const items = order.order_items ?? [];
    const address = order.shipping_address ?? {};

    return {
      id: order.id,
      order_number: order.order_number,
      customer_name: address.full_name ?? "Guest",
      customer_email: address.email ?? "—",
      customer_city: address.city ?? "—",
      items_count: items.length,
      total: Number(order.total),
      status: order.status,
      payment_status: order.payment_status,
      created_at: order.created_at,
    };
  });

  // Real orders on top, mock below
  return [...realOrders, ...MOCK_ORDERS];
}

// ══════════════════════════════════════════════════════════
// Get Single Order by ID (Real Supabase + Mock fallback)
// ══════════════════════════════════════════════════════════
export async function getOrderById(
  id: string
): Promise<MockOrderDetail | null> {
  // ── Try real order first (skip for mock-*) ──────────────
  if (!id.startsWith("mock-")) {
    const supabase = await createClient();
    const { data: realOrder } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_name,
          variant_label,
          price,
          quantity,
          image_url
        )
      `
      )
      .eq("id", id)
      .single();

    if (realOrder) {
      const items = (realOrder as any).order_items ?? [];
      const address = (realOrder as any).shipping_address ?? {};

      const orderDate = new Date((realOrder as any).created_at);
      const statuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
      ];
      const currentIdx = statuses.indexOf((realOrder as any).status);

      const timeline = statuses.map((status, i) => {
        const date = new Date(orderDate);
        date.setDate(date.getDate() + i);
        return {
          status,
          date: date.toISOString(),
          completed:
            (realOrder as any).status === "cancelled"
              ? false
              : i <= currentIdx,
        };
      });

      return {
        id: (realOrder as any).id,
        order_number: (realOrder as any).order_number,
        customer_name: address.full_name ?? "Guest",
        customer_email: address.email ?? "—",
        customer_city: address.city ?? "—",
        items_count: items.length,
        total: Number((realOrder as any).total),
        status: (realOrder as any).status,
        payment_status: (realOrder as any).payment_status,
        created_at: (realOrder as any).created_at,
        items: items.map((item: any) => ({
          id: item.id,
          product_name: item.product_name,
          product_slug: item.product_name
            .toLowerCase()
            .replace(/\s+/g, "-"),
          variant_label: item.variant_label,
          price: Number(item.price),
          quantity: item.quantity,
          image_url: item.image_url ?? "",
        })),
        subtotal: Number((realOrder as any).subtotal),
        discount: Number((realOrder as any).discount ?? 0),
        tax: Number((realOrder as any).tax),
        delivery_fee: Number((realOrder as any).delivery_fee),
        payment_method: (realOrder as any).payment_method ?? "Demo Card",
        shipping_address: {
          full_name: address.full_name ?? "Guest",
          phone: address.phone ?? "—",
          address_line1: address.address_line1 ?? "—",
          city: address.city ?? "—",
          postal_code: address.postal_code ?? "—",
          country: address.country ?? "Pakistan",
        },
        timeline,
      };
    }
  }

  // ── Fallback to mock ────────────────────────────────────
  const baseOrder = MOCK_ORDERS.find((o) => o.id === id);
  if (!baseOrder) return null;

  const mockItems = [
    {
      id: "item-1",
      product_name: "Ivory Gold Zardozi Sherwani",
      product_slug: "ivory-sherwani",
      variant_label: "Size: L",
      price: 32000,
      quantity: 1,
      image_url: "/products/ivory-sherwani.jpg",
    },
    {
      id: "item-2",
      product_name: "Gold Chain Necklace",
      product_slug: "gold-chain-necklace",
      variant_label: null,
      price: 45000,
      quantity: 1,
      image_url: "/products/gold-chain-necklace.jpg",
    },
    {
      id: "item-3",
      product_name: "Brown Leather Oxford Shoes",
      product_slug: "brown-oxford-shoes",
      variant_label: "Size: 42",
      price: 12500,
      quantity: 1,
      image_url: "/products/brown-oxford-shoes.jpg",
    },
  ];

  const items =
    baseOrder.items_count === 1
      ? [mockItems[0]]
      : baseOrder.items_count === 2
      ? [mockItems[0], mockItems[1]]
      : mockItems;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.15);
  const delivery_fee = subtotal >= 5000 ? 0 : 200;

  const orderDate = new Date(baseOrder.created_at);
  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];
  const currentIdx = statuses.indexOf(baseOrder.status);

  const timeline = statuses.map((status, i) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + i);
    return {
      status,
      date: date.toISOString(),
      completed:
        baseOrder.status === "cancelled" ? false : i <= currentIdx,
    };
  });

  return {
    ...baseOrder,
    items,
    subtotal,
    discount: 0,
    tax,
    delivery_fee,
    payment_method: "Credit Card (Stripe)",
    shipping_address: {
      full_name: baseOrder.customer_name,
      phone: "+92-300-1234567",
      address_line1: "House 123, Street 45",
      city: baseOrder.customer_city,
      postal_code: "75500",
      country: "Pakistan",
    },
    timeline,
  };
}

// ══════════════════════════════════════════════════════════
// Compute Order Stats
// ══════════════════════════════════════════════════════════
export function computeOrderStats(orders: MockOrder[]): OrderStats {
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const thisMonthOrders = orders.filter(
    (o) => new Date(o.created_at) >= monthStart
  ).length;

  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    thisMonthOrders,
  };
}