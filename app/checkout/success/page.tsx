"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Status = "checking" | "paid" | "pending" | "failed" | "unknown";

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<Status>(orderId ? "checking" : "unknown");

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    let attempts = 0;

    async function poll() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        const res = await fetch(`/api/purchases/status?order_id=${orderId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const payload = await res.json();
        if (!active) return;
        if (res.ok) {
          if (payload.status === "paid") return setStatus("paid");
          if (payload.status === "failed") return setStatus("failed");
          setStatus("pending");
        }
      } catch {
        // Ignore transient errors while the webhook settles, then retry.
      }
      attempts += 1;
      if (active && attempts < 10) setTimeout(poll, 2000);
    }

    poll();
    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <section className="border border-cyan-border bg-section p-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">Checkout status</p>
      <h1 className="mt-3 text-2xl font-bold text-white">
        {status === "paid" ? "Payment Confirmed" : status === "failed" ? "Payment Needs Attention" : "Payment Successful"}
      </h1>
      <p className="mt-2 text-muted">
        {status === "paid"
          ? "Your products are unlocked. Head to your dashboard to download."
          : status === "failed"
            ? "Please review the payment status and try again from your cart when you are ready."
            : "Access unlocks once the server verifies your Razorpay payment. This usually takes a few seconds."}
      </p>
      <Link href="/dashboard" className="mt-8 inline-block btn-primary px-6 py-3 font-semibold uppercase tracking-[0.08em] text-white ">
        Go to My Purchases
      </Link>
      {status === "paid" && orderId ? (
        <Link href={`/receipts/${encodeURIComponent(orderId)}`} className="ml-3 mt-8 inline-block border border-cyan-border bg-card px-6 py-3 font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
          View Receipt
        </Link>
      ) : null}
      </section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
