"use client";

import RouteErrorPanel from "@/components/RouteErrorPanel";

export default function DashboardError({
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
      eyebrow="Library unavailable"
      title="We could not load your purchase dashboard."
      description="Retry the dashboard, browse products, or contact support if your licensed products are missing."
      backHref="/products"
      backLabel="Browse products"
    />
  );
}
