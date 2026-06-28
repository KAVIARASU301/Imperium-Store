"use client";

import RouteErrorPanel from "@/components/RouteErrorPanel";

export default function CheckoutSuccessError({
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
      title="We could not load the payment confirmation."
      description="Retry payment confirmation, open your purchase library, or contact support if the payment was charged."
      backHref="/dashboard"
      backLabel="My purchases"
    />
  );
}
