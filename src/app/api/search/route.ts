import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// ══════════════════════════════════════════════════════════
// GET — Search products
// ══════════════════════════════════════════════════════════
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        base_price,
        compare_at_price,
        rating_avg,
        rating_count,
        category:categories(name)
      `
      )
      .eq("is_active", true)
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      )
      .order("total_sold", { ascending: false })
      .limit(8);

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json({ products: [] });
    }

    const products = (data ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      base_price: Number(p.base_price),
      compare_at_price: p.compare_at_price
        ? Number(p.compare_at_price)
        : null,
      image_url: `/products/${p.slug}.jpg`,
      category_name: p.category?.[0]?.name ?? null,
      rating_avg: Number(p.rating_avg ?? 0),
      rating_count: p.rating_count ?? 0,
    }));

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed", products: [] },
      { status: 500 }
    );
  }
}