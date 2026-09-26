import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const [key, ...val] = trimmed.split("=");
  if (key && val.length) env[key.trim()] = val.join("=").trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("=== URL ===");
console.log(url);
console.log("Length:", url?.length);

console.log("\n=== KEY ===");
console.log("Prefix:", key?.substring(0, 20));
console.log("Length:", key?.length);

console.log("\n=== DIRECT FETCH TEST ===");
const endpoint = `${url}/rest/v1/categories?select=*`;
console.log("Endpoint:", endpoint);

try {
  const res = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text.substring(0, 300));
} catch (e) {
  console.log("Fetch error:", e.message);
}