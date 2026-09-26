"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  User,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupInput } from "@/lib/validation/auth.schema";
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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

/* ══════════════════════════════════════════════════════════
   Field wrapper with icon
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
   Main Component
   ══════════════════════════════════════════════════════════ */
export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  /* ── Signup submit ─────────────────────────────── */
  const onSubmit = async (data: SignupInput) => {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message);
      showToast(error.message, "error");
      return;
    }

    // ✅ NEW: Signup success toast
    showToast("Account created successfully!", "success");

    setSuccess(true);
    setTimeout(() => {
      router.push("/account");
      router.refresh();
    }, 2000);
  };

  /* ── Success state ─────────────────────────────── */
  if (success) {
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
          {/* Pulse ring */}
          <motion.span
            aria-hidden
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-[#3ECF8E]"
          />
          <Check className="relative h-7 w-7 text-[#3ECF8E]" strokeWidth={3} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="font-display text-lg font-semibold text-[#F5EFE7] mb-2"
        >
          Account created!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="text-sm text-[#9A94A8]"
        >
          Check your email to confirm, or continue to your account.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.form
      variants={stagger}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* ── Full Name ──────────────────────────────── */}
      <Field
        label="Full Name"
        htmlFor="full_name"
        icon={User}
        error={errors.full_name?.message}
      >
        <input
          id="full_name"
          type="text"
          autoComplete="name"
          placeholder="A. Rahman"
          {...register("full_name")}
          className={cn(
            "ember-input text-sm transition-all duration-300",
            errors.full_name &&
              "border-[#FF5C5C] focus:shadow-[0_0_20px_-6px_rgba(255,92,92,0.5)]"
          )}
        />
      </Field>

      {/* ── Email ──────────────────────────────────── */}
      <Field
        label="Email"
        htmlFor="email"
        icon={Mail}
        error={errors.email?.message}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className={cn(
            "ember-input text-sm transition-all duration-300",
            errors.email &&
              "border-[#FF5C5C] focus:shadow-[0_0_20px_-6px_rgba(255,92,92,0.5)]"
          )}
        />
      </Field>

      {/* ── Password ───────────────────────────────── */}
      <Field
        label="Password"
        htmlFor="password"
        icon={Lock}
        error={errors.password?.message}
      >
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("password")}
            className={cn(
              "ember-input text-sm pr-10 transition-all duration-300",
              errors.password &&
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
            aria-label={showPassword ? "Hide password" : "Show password"}
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

      {/* ── Server Error ───────────────────────────── */}
      <AnimatePresence>
        {serverError && (
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
              <p className="text-xs text-[#FF5C5C]">{serverError}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit ─────────────────────────────────── */}
      <motion.div variants={fadeInUp} transition={spring}>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </motion.div>

      {/* ── Terms ──────────────────────────────────── */}
      <motion.p
        variants={fadeInUp}
        transition={spring}
        className="text-[10px] text-center text-[#6B6678] leading-relaxed"
      >
        By signing up, you agree to our{" "}
        <a
          href="/terms"
          className="text-[#FF9A3C] hover:text-[#FFB566] hover:underline transition-colors"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="text-[#FF9A3C] hover:text-[#FFB566] hover:underline transition-colors"
        >
          Privacy Policy
        </a>
      </motion.p>
    </motion.form>
  );
}