"use client";

import { useEffect, useState } from "react";
import { getWishlistCount } from "@/hooks/useWishlist";

export function WishlistCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getWishlistCount());

    const handleUpdate = () => {
      setCount(getWishlistCount());
    };

    window.addEventListener("wishlist-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("wishlist-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5C5C] px-1 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(255,92,92,0.8)]">
      {count > 99 ? "99+" : count}
    </span>
  );
}