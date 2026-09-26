"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils/slug";
import { z } from "zod";

// ══════════════════════════════════════════════════════════
// Validation
// ══════════════════════════════════════════════════════════
const checkoutSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  address_line1: z.string().min(5, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().default("Pakistan"),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ══════════════════════════════════════════════════════════
// Create Order (Demo — no real payment)
// ══════════════════════════════════════════════════════════
export async function createOrder(
  input: CheckoutInput,
  cart: {
    items: Array<{
      product_id: string;
      slug: string;
      name: string;
      price: number;
      quantity: number;
      image_url: string;
      size?: string;
      color?: string;
    }>;
    subtotal: number;
  }
) {
  // Validate address
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  // Get current user (optional — guest checkout allowed)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Calculate totals
  const subtotal = cart.subtotal;
  const tax = Math.round(subtotal * 0.15);
  const delivery = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + tax + delivery;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      user_id: user?.id ?? null,
      status: "confirmed",
      subtotal,
      discount: 0,
      delivery_fee: delivery,
      tax,
      total,
      currency: "PKR",
      shipping_address: {
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        address_line1: parsed.data.address_line1,
        address_line2: parsed.data.address_line2 ?? null,
        city: parsed.data.city,
        state: parsed.data.state ?? null,
        postal_code: parsed.data.postal_code ?? null,
        country: parsed.data.country,
      },
      payment_status: "paid",
      notes: parsed.data.notes ?? null,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Failed to create order" };
  }

  // Create order items
  const orderItems = cart.items.map((item) => ({
    order_id: order.id,
    product_name: item.name,
    variant_label:
      item.size && item.size !== "One Size" ? `Size: ${item.size}` : null,
    price: item.price,
    quantity: item.quantity,
    image_url: item.image_url,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    // Rollback order
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: itemsError.message };
  }

  revalidatePath("/seller/orders");
  revalidatePath("/account/orders");

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.order_number,
  };
}