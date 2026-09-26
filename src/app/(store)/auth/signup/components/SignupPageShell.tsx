"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignupForm } from "./SignupForm";

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

export function SignupPageShell() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient background glows */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#FF9A3C]/8 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[#E67E22]/6 blur-[100px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center mb-8"
        >
          <Link
            href="/"
            className="group inline-block font-display text-4xl font-bold text-[#F5EFE7] transition-colors"
          >
            <span className="relative inline-block group-hover:text-[#FF9A3C] transition-colors">
              Luvéra
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[#FF9A3C] to-transparent transition-all duration-300 group-hover:w-full"
              />
            </span>
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#FF9A3C]">
            Wear the night
          </p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card relative overflow-hidden p-8 rounded-2xl border border-[rgba(255,200,120,0.12)] shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_20px_50px_-20px_rgba(0,0,0,0.8),0_0_50px_-12px_rgba(255,154,60,0.15)]"
        >
          {/* Top hairline glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent"
          />

          <div className="mb-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="font-display text-2xl font-bold text-[#F5EFE7] mb-2"
            >
              Create your account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm text-[#9A94A8]"
            >
              Join Luvéra and discover timeless fashion
            </motion.p>
          </div>

          <SignupForm />

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 text-center text-sm text-[#9A94A8]"
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="group/link inline-flex items-center gap-1 text-[#FF9A3C] font-medium transition-colors hover:text-[#FFB566]"
            >
              Sign in
              <span className="inline-block transition-transform group-hover/link:translate-x-0.5">
                →
              </span>
            </Link>
          </motion.p>
        </motion.div>

        {/* Back to home */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 text-center text-xs text-[#6B6678]"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-1 hover:text-[#FF9A3C] transition-colors"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            Back to home
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}