import { Suspense } from "react";
import { LoginPageShell } from "./components/LoginPageShell";

export const metadata = {
  title: "Sign In — Luvéra",
};

// Loading spinner jab tak client component load ho
function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0A14]">
      <div className="w-10 h-10 border-4 border-[#FF9A3C] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginPageShell />
    </Suspense>
  );
}