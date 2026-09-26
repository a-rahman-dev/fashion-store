import Groq from "groq-sdk";

// ══════════════════════════════════════════════════════════
// Groq Client
// ══════════════════════════════════════════════════════════
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn("⚠️ GROQ_API_KEY is not set in .env.local");
}

export const groq = new Groq({
  apiKey: apiKey ?? "",
});

// ══════════════════════════════════════════════════════════
// Models — try in order if one fails
// ══════════════════════════════════════════════════════════
export const MODELS = [
  "llama-3.3-70b-versatile",  // Primary — smart, fast, tool calling
  "openai/gpt-oss-120b",      // Fallback — strong reasoning
  "llama-3.1-8b-instant",     // Backup — fastest, lightweight
] as const;

// ══════════════════════════════════════════════════════════
// Default model
// ══════════════════════════════════════════════════════════
export function getDefaultModel() {
  return MODELS[0];
}