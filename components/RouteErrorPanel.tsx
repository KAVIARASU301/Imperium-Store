"use client";

import { useEffect } from "react";
import Link from "next/link";
import StatePanel from "@/components/StatePanel";

type RouteErrorPanelProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
  eyebrow: string;
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
};

export default function RouteErrorPanel({
  error,
  unstable_retry,
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
}: RouteErrorPanelProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <StatePanel
        tone="error"
        eyebrow={eyebrow}
        title={title}
        description={description}
        icon="/icons/error/error-color-32.png"
        actions={
          <>
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              Retry
            </button>
            <Link href={backHref} className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
              {backLabel}
            </Link>
            <Link href="/support" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
              Contact support
            </Link>
          </>
        }
      >
        {error.digest ? (
          <div className="rounded-md border border-cyan-border bg-main/60 p-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Error reference</p>
            <p className="mt-1 break-all font-mono text-xs text-white">{error.digest}</p>
          </div>
        ) : null}
      </StatePanel>
    </main>
  );
}
