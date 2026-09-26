"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { MessageBubble, type ChatMessage } from "./MessageBubble";
import { SUGGESTED_PROMPTS } from "@/lib/ai/prompts";
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
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const spring = { type: "spring" as const, stiffness: 320, damping: 28 };

export function AssistantWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ── Auto scroll ───────────────────────────────── */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* ── Focus input on mount ──────────────────────── */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Send message ──────────────────────────────── */
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to get response");
      }

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.message.content,
        products: data.message.products,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ── Submit ────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  /* ── Reset ─────────────────────────────────────── */
  const handleReset = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className={cn(
        "glass-card flex flex-col overflow-hidden rounded-2xl",
        "border border-[rgba(255,200,120,0.15)]",
        "shadow-[0_1px_0_rgba(255,200,120,0.08)_inset,0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_60px_-15px_rgba(255,154,60,0.2)]"
      )}
      style={{
        position: "fixed",
        bottom: "96px",
        right: "16px",
        width: "min(400px, calc(100vw - 2rem))",
        height: "min(600px, calc(100vh - 8rem))",
        zIndex: 50,
        transformOrigin: "bottom right",
      }}
    >
      {/* Top hairline glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.35)] to-transparent z-10"
      />

      {/* ═══════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════ */}
      <header className="relative flex items-center justify-between px-4 py-3 border-b border-[rgba(255,200,120,0.1)] bg-[rgba(26,23,48,0.5)] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          {/* Logo */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_16px_-2px_rgba(255,154,60,0.6),0_1px_0_rgba(255,255,255,0.3)_inset]"
          >
            {/* Pulse ring */}
            <motion.span
              aria-hidden
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full bg-[#FF9A3C]"
            />
            <Sparkles
              className="relative h-4 w-4 text-[#0B0A14]"
              strokeWidth={2.5}
            />
          </motion.div>

          <div>
            <p className="text-sm font-semibold text-[#F5EFE7]">
              Luvéra Assistant
            </p>
            <p className="text-[10px] text-[#9A94A8] flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ECF8E] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3ECF8E] shadow-[0_0_6px_rgba(62,207,142,0.9)]" />
              </span>
              AI-powered · Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <AnimatePresence>
            {messages.length > 0 && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={spring}
                onClick={handleReset}
                whileHover={{ scale: 1.1, rotate: -90 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A94A8] hover:bg-white/5 hover:text-[#FF9A3C] transition-colors"
                aria-label="New chat"
                title="New chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={spring}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A94A8] hover:bg-white/5 hover:text-[#F5EFE7] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          MESSAGES
      ═══════════════════════════════════════════ */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
      >
        {/* Welcome / Suggestions */}
        <AnimatePresence mode="wait">
          {messages.length === 0 && (
            <motion.div
              key="welcome"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              variants={stagger}
              className="text-center py-6"
            >
              {/* Welcome icon */}
              <motion.div
                variants={fadeInUp}
                transition={spring}
                className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] shadow-[0_0_24px_-4px_rgba(255,154,60,0.6),0_1px_0_rgba(255,255,255,0.3)_inset]"
              >
                <motion.span
                  aria-hidden
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-full bg-[#FF9A3C]"
                />
                <Sparkles
                  className="relative h-6 w-6 text-[#0B0A14]"
                  strokeWidth={2.5}
                />
              </motion.div>

              <motion.h3
                variants={fadeInUp}
                transition={spring}
                className="font-display text-lg font-semibold text-[#F5EFE7] mb-1.5"
              >
                Hi, I&apos;m your stylist
              </motion.h3>

              <motion.p
                variants={fadeInUp}
                transition={spring}
                className="text-xs text-[#9A94A8] max-w-[280px] mx-auto mb-5"
              >
                Ask me anything about our collection — I&apos;ll help you find
                the perfect piece.
              </motion.p>

              {/* Suggestions */}
              <motion.div
                variants={fadeInUp}
                transition={spring}
                className="space-y-2"
              >
                {SUGGESTED_PROMPTS.map((s, i) => (
                  <motion.button
                    key={s.text}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.3 + i * 0.06 }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(s.prompt)}
                    className="group w-full flex items-center gap-2.5 rounded-xl border border-[rgba(255,200,120,0.1)] bg-white/[0.02] px-3 py-2.5 text-left text-xs text-[#9A94A8] transition-all duration-300 hover:border-[rgba(255,154,60,0.35)] hover:bg-[rgba(255,154,60,0.05)] hover:text-[#F5EFE7] hover:shadow-[0_0_20px_-8px_rgba(255,154,60,0.5)]"
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="flex-1">{s.text}</span>
                    <Send className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start mb-3"
            >
              <div className="relative rounded-2xl rounded-bl-sm border border-[rgba(255,200,120,0.12)] bg-white/[0.04] px-4 py-3 shadow-[0_1px_0_rgba(255,200,120,0.05)_inset,0_4px_16px_-8px_rgba(0,0,0,0.4)]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,200,120,0.2)] to-transparent rounded-t-2xl"
                />
                <div className="flex gap-1.5">
                  {[0, 150, 300].map((delay) => (
                    <motion.span
                      key={delay}
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: delay / 1000,
                      }}
                      className="h-2 w-2 rounded-full bg-[#FF9A3C] shadow-[0_0_8px_rgba(255,154,60,0.6)]"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
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
                className="rounded-lg border border-[rgba(255,92,92,0.25)] bg-[rgba(255,92,92,0.08)] px-3 py-2.5 text-xs text-[#FF5C5C] shadow-[0_0_20px_-6px_rgba(255,92,92,0.5)]"
              >
                {error}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════
          INPUT
      ═══════════════════════════════════════════ */}
      <footer className="p-3 border-t border-[rgba(255,200,120,0.1)] bg-[rgba(26,23,48,0.5)] backdrop-blur-md">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-xl border border-[rgba(255,200,120,0.15)] bg-white/[0.03] p-1.5 transition-all duration-300 focus-within:border-[rgba(255,154,60,0.5)] focus-within:shadow-[0_0_24px_-8px_rgba(255,154,60,0.6)]"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask about products, styles, sizing..."
            rows={1}
            disabled={loading}
            className="flex-1 resize-none bg-transparent px-2.5 py-2 text-xs text-[#F5EFE7] placeholder-[#6B6678] focus:outline-none disabled:opacity-50 max-h-24 scrollbar-none"
            style={{ minHeight: "32px" }}
          />

          <motion.button
            type="submit"
            disabled={loading || !input.trim()}
            whileHover={!loading && input.trim() ? { scale: 1.08 } : {}}
            whileTap={!loading && input.trim() ? { scale: 0.92 } : {}}
            transition={spring}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF9A3C] to-[#E67E22] text-[#0B0A14] shadow-[0_4px_16px_-4px_rgba(255,154,60,0.5),0_1px_0_rgba(255,255,255,0.3)_inset] hover:shadow-[0_6px_24px_-4px_rgba(255,154,60,0.7)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300"
          >
            {loading ? (
              <Loader2
                className="h-3.5 w-3.5 animate-spin"
                strokeWidth={2.5}
              />
            ) : (
              <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
          </motion.button>
        </form>

        <p className="text-[9px] text-center text-[#6B6678] mt-1.5">
          AI may make mistakes · For urgent issues call us
        </p>
      </footer>
    </motion.div>
  );
}