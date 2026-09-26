"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count up animation — generic ref, kisi bhi element pe kaam karega
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  duration = 1800,
  start = 0
) {
  const [count, setCount] = useState(start);
  const ref = useRef<T>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + (target - start) * eased));

            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, start]);

  return { ref, count };
}