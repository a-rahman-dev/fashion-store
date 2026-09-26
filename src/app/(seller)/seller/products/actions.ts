"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import { z } from "zod";

// ══════════════════════════════════════════════════════════
// Validation Schema
// ══════════════════════════════════════════════════════════
const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional().nullable(),
  category_id: z.string().uuid("Please select a category"),
  base_price: z.number().min(1, "Price must be greater than 0"),
  compare_at_price: z.number().min(0).nullable().optional(),
  image_url: z.string().url().or(z.string().startsWith("/")),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type ProductFormInput = z.infer<typeof productSchema>;

// ══════════════════════════════════════════════════════════
// CREATE Product
// ══════════════════════════════════════════════════════════
export async function createProduct(data: ProductFormInput) {
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { name, ...rest } = parsed.data;
  const slug = rest.slug || slugify(name);

  const { error } = await supabase.from("products").insert({
    slug,
    name,
    description: rest.description,
    category_id: rest.category_id,
    base_price: rest.base_price,
    compare_at_price: rest.compare_at_price ?? null,
    is_active: rest.is_active,
    is_featured: rest.is_featured,
    tags: rest.tags,
    total_sold: 0,
    rating_avg: 0,
    rating_count: 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/seller/products");
}

// ══════════════════════════════════════════════════════════
// UPDATE Product
// ══════════════════════════════════════════════════════════
export async function updateProduct(id: string, data: ProductFormInput) {
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { name, ...rest } = parsed.data;
  const slug = rest.slug || slugify(name);

  const { error } = await supabase
    .from("products")
    .update({
      slug,
      name,
      description: rest.description,
      category_id: rest.category_id,
      base_price: rest.base_price,
      compare_at_price: rest.compare_at_price ?? null,
      is_active: rest.is_active,
      is_featured: rest.is_featured,
      tags: rest.tags,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath(`/seller/products/${id}/edit`);
  revalidatePath("/shop");
  revalidatePath(`/shop/${slug}`);
  revalidatePath("/");
  redirect("/seller/products");
}

// ══════════════════════════════════════════════════════════
// DELETE Product
// ══════════════════════════════════════════════════════════
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}

// ══════════════════════════════════════════════════════════
// TOGGLE Active
// ══════════════════════════════════════════════════════════
export async function toggleProductActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}