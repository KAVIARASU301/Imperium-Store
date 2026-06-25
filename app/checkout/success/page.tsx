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
    <main className="px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-white">
        {status === "paid" ? "Payment Confirmed" : status === "failed" ? "Payment Not Completed" : "Payment Successful"}
      </h1>
      <p className="text-slate-400 mt-2">
        {status === "paid"
          ? "Your access is unlocked. Head to your dashboard to download."
          : status === "failed"
            ? "Razorpay reported this payment did not go through. No access was unlocked."
            : "Access unlocks once the server verifies your Razorpay payment. This usually takes a few seconds."}
      </p>
      <Link href="/dashboard" className="mt-8 inline-block bg-cyan-300 px-6 py-3 font-semibold text-black hover:bg-cyan-200">
        Go to My Purchases
      </Link>
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
