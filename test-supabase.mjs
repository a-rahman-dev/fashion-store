import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load .env.local manually
const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const [key, ...val] = trimmed.split("=");
  if (key && val.length) {
    env[key.trim()] = val.join("=").trim();
  }
});

console.log("=== ENV CHECK ===");
console.log("URL:", env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY length:", env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log("\n=== CATEGORIES ===");
const { data: cats, error: catErr } = await supabase
  .from("categories")
  .select("*");
console.log("Count:", cats?.length ?? 0);
console.log("Error:", catErr);

console.log("\n=== PRODUCTS ===");
const { data: prods, error: prodErr } = await supabase
  .from("products")
  .select("*")
  .limit(3);
console.log("Count:", prods?.length ?? 0);
console.log("Error:", prodErr);

console.log("\n=== PRODUCTS + JOIN ===");
const { data: joined, error: joinErr } = await supabase
  .from("products")
  .select("*, category:categories(id, slug, name)")
  .limit(3);
console.log("Count:", joined?.length ?? 0);
console.log("Error:", joinErr);