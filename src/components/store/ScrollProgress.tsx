"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Top-of-page golden scroll progress bar
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[150] h-[2px] origin-left bg-gradient-to-r from-[#FF9A3C] via-[#FFB566] to-[#F4D06F] shadow-[0_0_10px_rgba(255,154,60,0.8)]"
    />
  );
}