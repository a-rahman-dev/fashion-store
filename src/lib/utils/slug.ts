/**
 * Convert a string to URL-friendly slug
 * "Silk Evening Dress" → "silk-evening-dress"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // spaces → dashes
    .replace(/[^\w\-]+/g, "")       // remove non-word chars
    .replace(/\-\-+/g, "-")         // collapse multiple dashes
    .replace(/^-+/, "")             // trim leading dashes
    .replace(/-+$/, "");            // trim trailing dashes
}

/**
 * Generate a unique order number
 * "LV-2026-A3F9K2"
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LV-${year}-${random}`;
}