"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Yahan aap apna Supabase/API login logic add karein
    setTimeout(() => {
      setIsLoading(false);
      alert("Login clicked (Demo)");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0A14] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#13111C] border border-white/5 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-[#F5EFE7] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#9A94A8] text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#F5EFE7]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-[#0B0A14] border border-white/10 text-[#F5EFE7] placeholder-[#9A94A8] focus:outline-none focus:border-[#FF9A3C] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#F5EFE7]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#0B0A14] border border-white/10 text-[#F5EFE7] placeholder-[#9A94A8] focus:outline-none focus:border-[#FF9A3C] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] text-[#0B0A14] font-semibold shadow-[0_4px_16px_rgba(255,154,60,0.3)] hover:shadow-[0_8px_28px_rgba(255,154,60,0.5)] transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#9A94A8]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-[#FF9A3C] hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}