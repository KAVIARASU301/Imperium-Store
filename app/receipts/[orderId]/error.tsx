"use client";

import RouteErrorPanel from "@/components/RouteErrorPanel";

export default function ReceiptError({
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
      eyebrow="Receipt unavailable"
      title="We could not load this receipt."
      description="Retry the receipt view, return to your purchase library, or contact support with the order reference."
      backHref="/dashboard"
      backLabel="My purchases"
    />
  );
}
