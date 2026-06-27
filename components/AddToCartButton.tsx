"use client";

import { addToCart, readCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddToCartButton({
  slug,
  className,
  checkout = false,
  children,
}: {
  slug: string;
  className: string;
  checkout?: boolean;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    setInCart(readCart().includes(slug));
  }, [slug]);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addToCart(slug);
        setInCart(true);
        if (checkout) router.push("/cart");
      }}
    >
      {children ?? (checkout ? "Review and Pay" : inCart ? "Added to Cart" : "Add to Cart")}
    </button>
  );
}
