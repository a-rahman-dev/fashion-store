import { getFeaturedProductsForHome } from "@/lib/db/queries/products";
import { HomeContent } from "@/components/store/HomeContent";
// ══════════════════════════════════════════════════════════
// Server page — sirf data fetch karta hai
// Animations HomeContent (client) mein hain
// ══════════════════════════════════════════════════════════
export default async function StoreHomePage() {
  const featured = await getFeaturedProductsForHome(4);

  return <HomeContent featured={featured} />;
}