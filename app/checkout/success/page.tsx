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
      <section className="border border-[#1b3055] bg-[#0c1525] p-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Checkout status</p>
      <h1 className="mt-3 text-2xl font-bold text-[#c5d5ee]">
        {status === "paid" ? "Payment Confirmed" : status === "failed" ? "Payment Not Completed" : "Payment Successful"}
      </h1>
      <p className="mt-2 text-[#6882a8]">
        {status === "paid"
          ? "Your access is unlocked. Head to your dashboard to download."
          : status === "failed"
            ? "Razorpay reported this payment did not go through. No access was unlocked."
            : "Access unlocks once the server verifies your Razorpay payment. This usually takes a few seconds."}
      </p>
      <Link href="/dashboard" className="mt-8 inline-block bg-[#1e52e8] px-6 py-3 font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#2b63ff]">
        Go to My Purchases
      </Link>
      {status === "paid" && orderId ? (
        <Link href={`/receipts/${encodeURIComponent(orderId)}`} className="ml-3 mt-8 inline-block border border-[#1b3055] bg-[#111d35] px-6 py-3 font-semibold uppercase tracking-[0.08em] text-[#c5d5ee] hover:border-[#1e52e8]">
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
