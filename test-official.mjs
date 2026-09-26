import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const [key, ...val] = trimmed.split("=");
  if (key && val.length) env[key.trim()] = val.join("=").trim();
});

console.log("URL:", env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY prefix:", env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30));
console.log("KEY suffix:", env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(-10));

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log("\n=== TEST ===");
const { data, error, count } = await supabase
  .from("categories")
  .select("*", { count: "exact" });

console.log("Count:", count);
console.log("Data length:", data?.length);
console.log("Error:", JSON.stringify(error, null, 2));