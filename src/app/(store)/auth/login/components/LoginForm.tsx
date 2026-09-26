"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  loginSchema,
  magicLinkSchema,
  type LoginInput,
  type MagicLinkInput,
} from "@/lib/validation/auth.schema";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

/* ══════════════════════════════════════════════════════════
   Animation variants
   ══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

type Mode = "password" | "magic-link";

/* ══════════════════════════════════════════════════════════
   Field wrapper
   ══════════════════════════════════════════════════════════ */
function Field({
  label,
  htmlFor,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInUp} transition={spring}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium uppercase tracking-wider text-[#9A94A8] mb-2"
      >
        {Icon && <Icon className="inline h-3 w-3 mr-1.5 align-text-bottom" />}
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-xs text-[#FF5C5C] overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   Error Banner
   ══════════════════════════════════════════════════════════ */
function ErrorBanner({ error }: { error: string | null }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -12, height: 0 }}
          animate={{ opacity: 1, x: 0, height: "auto" }}
          exit={{ opacity: 0, x: -12, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <motion.div
            animate={{ x: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.4 }}
            className="rounded-lg border border-[rgba(255,92,92,0.25)] bg-[rgba(255,92,92,0.08)] px-3 py-2.5 flex items-center gap-2 shadow-[0_0_20px_-6px_rgba(255,92,92,0.5)]"
          >
            <AlertCircle className="h-3.5 w-3.5 text-[#FF5C5C] shrink-0" />
            <p className="text-xs text-[#FF5C5C]">{error}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/account";

  const [mode, setMode] = useState<Mode>("password");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  /* ── Forms ─────────────────────────────────────── */
  const passwordForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const magicForm = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
  });

  /* ── Password login ────────────────────────────── */
  const onPasswordSubmit = async (data: LoginInput) => {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    // ✅ NEW: Login success toast
    showToast("Welcome back!", "success");

    router.push(redirectTo);
    router.refresh();
  };

  /* ── Magic link ────────────────────────────────── */
  const onMagicSubmit = async (data: MagicLinkInput) => {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    // ✅ NEW: Magic link sent toast
    showToast("Magic link sent! Check your email", "success");

    setMagicLinkSent(true);
  };

  /* ── Magic link sent state ─────────────────────── */
  if (magicLinkSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 320,
            damping: 20,
          }}
          className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(62,207,142,0.15)] border border-[rgba(62,207,142,0.3)] shadow-[0_0_24px_-6px_rgba(62,207,142,0.6)]"
        >
          <motion.span
            aria-hidden
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-[#3ECF8E]"
          />
          <Mail className="relative h-7 w-7 text-[#3ECF8E]" strokeWidth={2.5} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="font-display text-lg font-semibold text-[#F5EFE7] mb-2"
        >
          Check your email
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="text-sm text-[#9A94A8] mb-6"
        >
          We&apos;ve sent a magic link to your email. Click it to sign in.
        </motion.p>

        <motion.button
          type="button"
          onClick={() => setMagicLinkSent(false)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          className="group inline-flex items-center gap-1 text-xs text-[#FF9A3C] hover:text-[#FFB566] transition-colors"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          Use different method
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* ═══════════════════════════════════════════
          MODE TABS
      ═══════════════════════════════════════════ */}
      <motion.div
        variants={fadeInUp}
        transition={spring}
        className="relative flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-[rgba(255,200,120,0.10)]"
      >
        {(
          [
            { key: "password", label: "Password", icon: Lock },
            { key: "magic-link", label: "Magic Link", icon: Sparkles },
          ] as const
        ).map(({ key, label, icon: Icon }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key);
                setServerError(null);
              }}
              className={cn(
                "relative flex-1 rounded-md py-2 text-xs font-medium transition-colors duration-300 inline-flex items-center justify-center gap-1.5",
                active
                  ? "text-[#FF9A3C]"
                  : "text-[#9A94A8] hover:text-[#F5EFE7]"
              )}
            >
              {active && (
                <motion.span
                  layoutId="login-tab-active"
                  className="absolute inset-0 rounded-md bg-[rgba(255,154,60,0.15)] border border-[rgba(255,154,60,0.3)] shadow-[0_0_16px_-6px_rgba(255,154,60,0.5)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-3 w-3" />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* ═══════════════════════════════════════════
          PASSWORD MODE
      ═══════════════════════════════════════════ */}
      <AnimatePresence mode="wait" initial={false}>
        {mode === "password" && (
          <motion.form
            key="password-form"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <Field
              label="Email"
              htmlFor="email"
              icon={Mail}
              error={passwordForm.formState.errors.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...passwordForm.register("email")}
                className={cn(
                  "ember-input text-sm transition-all duration-300",
                  passwordForm.formState.errors.email &&
                    "border-[#FF5C5C] focus:shadow-[0_0_20px_-6px_rgba(255,92,92,0.5)]"
                )}
              />
            </Field>

            <Field
              label="Password"
              htmlFor="password"
              icon={Lock}
              error={passwordForm.formState.errors.password?.message}
            >
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  {...passwordForm.register("password")}
                  className={cn(
                    "ember-input text-sm pr-10 transition-all duration-300",
                    passwordForm.formState.errors.password &&
                      "border-[#FF5C5C] focus:shadow-[0_0_20px_-6px_rgba(255,92,92,0.5)]"
                  )}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={spring}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6678] hover:text-[#FF9A3C] transition-colors"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? "off" : "on"}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
            </Field>

            {/* Forgot password */}
            <motion.div
              variants={fadeInUp}
              transition={spring}
              className="text-right"
            >
              <a
                href="/auth/forgot-password"
                className="text-xs text-[#9A94A8] hover:text-[#FF9A3C] transition-colors relative group/fp"
              >
                Forgot password?
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#FF9A3C] transition-all duration-300 group-hover/fp:w-full"
                />
              </a>
            </motion.div>

            <ErrorBanner error={serverError} />

            <motion.div variants={fadeInUp} transition={spring}>
              <Button
                type="submit"
                size="lg"
                disabled={passwordForm.formState.isSubmitting}
                className="w-full"
              >
                {passwordForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </motion.form>
        )}

        {/* ═══════════════════════════════════════════
            MAGIC LINK MODE
        ═══════════════════════════════════════════ */}
        {mode === "magic-link" && (
          <motion.form
            key="magic-form"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={magicForm.handleSubmit(onMagicSubmit)}
            className="space-y-4"
          >
            <motion.div
              variants={fadeInUp}
              transition={spring}
              className="rounded-lg bg-[rgba(255,154,60,0.08)] border border-[rgba(255,154,60,0.2)] px-3 py-2.5 flex items-start gap-2 shadow-[0_0_20px_-8px_rgba(255,154,60,0.5)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF9A3C] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#FF9A3C] leading-relaxed">
                <strong>Password-less login:</strong> we&apos;ll email you a
                magic link — click it to sign in instantly.
              </p>
            </motion.div>

            <Field
              label="Email"
              htmlFor="magic-email"
              icon={Mail}
              error={magicForm.formState.errors.email?.message}
            >
              <input
                id="magic-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...magicForm.register("email")}
                className={cn(
                  "ember-input text-sm transition-all duration-300",
                  magicForm.formState.errors.email &&
                    "border-[#FF5C5C] focus:shadow-[0_0_20px_-6px_rgba(255,92,92,0.5)]"
                )}
              />
            </Field>

            <ErrorBanner error={serverError} />

            <motion.div variants={fadeInUp} transition={spring}>
              <Button
                type="submit"
                size="lg"
                disabled={magicForm.formState.isSubmitting}
                className="w-full"
              >
                {magicForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}