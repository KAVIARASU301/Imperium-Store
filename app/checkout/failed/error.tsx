"use client";

import RouteErrorPanel from "@/components/RouteErrorPanel";

export default function CheckoutFailedError({
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
      title="We could not load the failed-payment details."
      description="Retry this status page, return to your cart, or contact support if you need help with a payment attempt."
      backHref="/cart"
      backLabel="Back to cart"
    />
  );
}
