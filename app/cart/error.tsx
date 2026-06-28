"use client";

import RouteErrorPanel from "@/components/RouteErrorPanel";

export default function CartError({
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
      title="We could not load your checkout."
      description="Retry the checkout view, return to the product catalog, or contact support if the cart keeps failing."
      backHref="/products"
      backLabel="Browse products"
    />
  );
}
