import Link from "next/link";
import { SignupForm } from "./components/SignupForm";
import { SignupPageShell } from "./components/SignupPageShell";

export const metadata = {
  title: "Sign Up — Luvéra",
};

// ══════════════════════════════════════════════════════════
// Server page — metadata + layout
// Animations SignupPageShell (client) mein hain
// ══════════════════════════════════════════════════════════
export default function SignupPage() {
  return <SignupPageShell />;
}