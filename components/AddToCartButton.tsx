"use client";

import { addToCart, CART_STORAGE_KEY, CART_UPDATED_EVENT } from "@/lib/cart";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { usePurchasedProducts } from "@/components/usePurchasedProducts";
import type { CheckoutPlanId } from "@/types/pricing";

const emptyCartSnapshot: string[] = [];
let cartSnapshotKey = "";
let cartSnapshot: string[] = emptyCartSnapshot;

export default function AddToCartButton({
  slug,
  className,
  checkout = false,
  isReady = true,
  planId = "lifetime",
  children,
}: {
  slug: string;
  className: string;
  checkout?: boolean;
  isReady?: boolean;
  planId?: CheckoutPlanId;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(false);
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, getEmptyCartSnapshot);
  const { accessBySlug } = usePurchasedProducts();
  const inCart = cart.includes(slug);
  const hasLifetimeAccess = accessBySlug[slug]?.access_type === "lifetime";
  const planAlreadyOwned = hasLifetimeAccess;
  const disabled = planAlreadyOwned || checkingAuth || !isReady;
  const baseDisabledClassName = className.replace(/\bbtn-primary\b/g, "");
  const buttonClassName = planAlreadyOwned
    ? `${className.replace(/\bbtn-primary\b/g, "")} cursor-not-allowed border border-success/40 bg-success/10 text-success shadow-none hover:border-success/40 hover:bg-success/10`
    : !isReady
      ? `${baseDisabledClassName} cursor-not-allowed border border-warning/40 bg-warning/10 text-warning shadow-none hover:border-warning/40 hover:bg-warning/10`
    : `${className} disabled:cursor-wait disabled:opacity-70`;

  async function handleAddToCart() {
    if (!isReady || planAlreadyOwned || checkingAuth) return;

    setCheckingAuth(true);
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();

    if (!data.session?.access_token) {
      setCheckingAuth(false);
      router.push(`/login?next=${encodeURIComponent(getCurrentPath())}`);
      return;
    }

    addToCart(slug, planId);
    setCheckingAuth(false);
    if (checkout) router.push("/cart");
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={handleAddToCart}
    >
      {checkingAuth
        ? "Checking..."
        : planAlreadyOwned
          ? "Lifetime owned"
          : !isReady
            ? "Coming Soon"
            : children ??
              (checkout
                ? "Review and Pay"
                : inCart
                  ? "Added to Cart"
                  : "Add to Cart")}
    </button>
  );
}


function getCurrentPath() {
  if (typeof window === "undefined") return "/products";
  return `${window.location.pathname}${window.location.search}`;
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
