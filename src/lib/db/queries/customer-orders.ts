import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════
export type CustomerOrder = {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  items_count: number;
  first_item_image: string | null;
  first_item_name: string | null;
  created_at: string;
  payment_status: string;
};

// ══════════════════════════════════════════════════════════
// Get Current User's Orders
// ══════════════════════════════════════════════════════════
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Get orders for this user
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      subtotal,
      tax,
      delivery_fee,
      total,
      created_at,
      payment_status,
      order_items (
        product_name,
        image_url,
        quantity
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCustomerOrders error:", error);
    return [];
  }

  return (orders ?? []).map((order: any) => {
    const items = order.order_items ?? [];
    const firstItem = items[0];

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      delivery_fee: Number(order.delivery_fee),
      total: Number(order.total),
      items_count: items.length,
      first_item_image: firstItem?.image_url ?? null,
      first_item_name: firstItem?.product_name ?? null,
      created_at: order.created_at,
      payment_status: order.payment_status,
    };
  });
}

// ══════════════════════════════════════════════════════════
// Get Single Order by ID (customer view)
// ══════════════════════════════════════════════════════════
export async function getCustomerOrderById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*)
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !order) {
    console.error("getCustomerOrderById error:", error);
    return null;
  }

  return order;
}

// ══════════════════════════════════════════════════════════
// Customer Order Stats
// ══════════════════════════════════════════════════════════
export type CustomerOrderStats = {
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
};

export function computeCustomerOrderStats(
  orders: CustomerOrder[]
): CustomerOrderStats {
  const activeStatuses = ["pending", "confirmed", "processing", "shipped"];

  return {
    totalOrders: orders.length,
    totalSpent: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
    activeOrders: orders.filter((o) => activeStatuses.includes(o.status))
      .length,
  };
}   

// ══════════════════════════════════════════════════════════
// Get Single Order by ID (Customer view)
// ══════════════════════════════════════════════════════════
export type CustomerOrderDetail = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  items: Array<{
    id: string;
    product_name: string;
    variant_label: string | null;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  delivery_fee: number;
  total: number;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
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

export async function getCustomerOrderDetail(
  id: string
): Promise<CustomerOrderDetail | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: order, error } = await supabase
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
    .eq("user_id", user.id)
    .single();

  if (error || !order) {
    console.error("getCustomerOrderDetail error:", error);
    return null;
  }

  const items = (order as any).order_items ?? [];
  const address = (order as any).shipping_address ?? {};

  // Build timeline
  const orderDate = new Date((order as any).created_at);
  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];
  const currentIdx = statuses.indexOf((order as any).status);

  const timeline = statuses.map((status, i) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + i);
    return {
      status,
      date: date.toISOString(),
      completed:
        (order as any).status === "cancelled" ? false : i <= currentIdx,
    };
  });

  return {
    id: (order as any).id,
    order_number: (order as any).order_number,
    status: (order as any).status,
    payment_status: (order as any).payment_status,
    payment_method: (order as any).payment_method ?? "Demo Card",
    created_at: (order as any).created_at,
    items: items.map((item: any) => ({
      id: item.id,
      product_name: item.product_name,
      variant_label: item.variant_label,
      price: Number(item.price),
      quantity: item.quantity,
      image_url: item.image_url ?? "",
    })),
    subtotal: Number((order as any).subtotal),
    discount: Number((order as any).discount ?? 0),
    tax: Number((order as any).tax),
    delivery_fee: Number((order as any).delivery_fee),
    total: Number((order as any).total),
    shipping_address: {
      full_name: address.full_name ?? "Guest",
      phone: address.phone ?? "—",
      address_line1: address.address_line1 ?? "—",
      address_line2: address.address_line2 ?? undefined,
      city: address.city ?? "—",
      postal_code: address.postal_code ?? "—",
      country: address.country ?? "Pakistan",
    },
    timeline,
  };
}