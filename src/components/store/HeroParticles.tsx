"use client";

import { motion } from "framer-motion";

/**
 * Floating golden particles — desktop only
 */
export function HeroParticles({ count = 20 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{
            x: `${p.x}%`,
            y: `${p.y}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${p.y}%`, `${p.y - 20}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-[#FF9A3C]"
          style={{
            width: p.size,
            height: p.size,
            boxShadow: "0 0 6px rgba(255,154,60,0.8)",
          }}
        />
      ))}
    </div>
  );
}