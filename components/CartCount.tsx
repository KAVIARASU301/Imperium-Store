"use client";

import { CART_UPDATED_EVENT, readCart } from "@/lib/cart";
import { useEffect, useState } from "react";

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function sync() {
      setCount(readCart().length);
    }

    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className="ml-1 inline-flex min-w-5 items-center justify-center btn-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
      {count}
    </span>
  );
}
