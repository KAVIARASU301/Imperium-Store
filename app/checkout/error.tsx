"use client";

import RouteErrorPanel from "@/components/RouteErrorPanel";

export default function CheckoutError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <RouteErrorPanel
      error={error}
      unstable_retry={unstable_retry}
      eyebrow="Checkout unavailable"
      title="We could not recover the checkout status."
      description="Retry the checkout status page, return to your cart, or contact support if a payment was charged."
      backHref="/cart"
      backLabel="Back to cart"
    />
  );
}
