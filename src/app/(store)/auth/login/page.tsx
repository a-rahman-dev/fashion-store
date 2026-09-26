import { LoginPageShell } from "./components/LoginPageShell";

export const metadata = {
  title: "Sign In — Luvéra",
};

// ══════════════════════════════════════════════════════════
// Server page — metadata + shell
// Animations LoginPageShell (client) mein hain
// ══════════════════════════════════════════════════════════
export default function LoginPage() {
  return <LoginPageShell />;
} 