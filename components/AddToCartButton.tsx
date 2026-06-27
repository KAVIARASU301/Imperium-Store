"use client";

import { addToCart, CART_STORAGE_KEY, CART_UPDATED_EVENT } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

const emptyCartSnapshot: string[] = [];
let cartSnapshotKey = "";
let cartSnapshot: string[] = emptyCartSnapshot;

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
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, getEmptyCartSnapshot);
  const inCart = cart.includes(slug);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addToCart(slug);
        if (checkout) router.push("/cart");
      }}
    >
      {children ?? (checkout ? "Review and Pay" : inCart ? "Added to Cart" : "Add to Cart")}
    </button>
  );
}

function getEmptyCartSnapshot() {
  return emptyCartSnapshot;
}

function getCartSnapshot() {
  if (typeof window === "undefined") return emptyCartSnapshot;

  const value = window.localStorage.getItem(CART_STORAGE_KEY) ?? "";
  if (value === cartSnapshotKey) return cartSnapshot;

  cartSnapshotKey = value;
  try {
    const parsed = value ? JSON.parse(value) : [];
    cartSnapshot = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : emptyCartSnapshot;
  } catch {
    cartSnapshot = emptyCartSnapshot;
  }
  return cartSnapshot;
}

function subscribeToCart(onStoreChange: () => void) {
  window.addEventListener(CART_UPDATED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
