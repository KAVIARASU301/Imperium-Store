"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import PostPurchaseOnboarding from "@/components/PostPurchaseOnboarding";
import StatePanel from "@/components/StatePanel";

type Status = "checking" | "paid" | "pending" | "failed" | "unknown" | "stalled" | "error";
const TERMINAL_PRODUCT_SLUG = "imperium-option-trading-terminal";

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<Status>(orderId ? "checking" : "unknown");
  const [message, setMessage] = useState("");
  const [confirmedProductIds, setConfirmedProductIds] = useState<string[]>([]);
  const [pollKey, setPollKey] = useState(0);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    let attempts = 0;
    let lastError = "";

    async function poll() {
      if (!active) return;
      attempts += 1;
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        const res = await fetch(`/api/purchases/status?order_id=${orderId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const payload = await res.json().catch(() => ({}));
        if (!active) return;
        if (!res.ok) throw new Error(typeof payload.message === "string" ? payload.message : "Unable to load payment status");
        lastError = "";
        setMessage("");
        if (Array.isArray(payload.productIds)) {
          setConfirmedProductIds(payload.productIds.filter((productId: unknown): productId is string => typeof productId === "string"));
        }
        if (payload.status === "paid") return setStatus("paid");
        if (payload.status === "failed") return setStatus("failed");
        setStatus("pending");
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Unable to load payment status";
      }
      if (!active) return;
      if (attempts < 10) {
        setTimeout(poll, 2000);
      } else {
        setMessage(lastError || "Razorpay confirmation is taking longer than usual.");
        setStatus(lastError ? "error" : "stalled");
      }
    }

    poll();
    return () => {
      active = false;
    };
  }, [orderId, pollKey]);

  function retryStatusCheck() {
    setStatus(orderId ? "checking" : "unknown");
    setMessage("");
    setConfirmedProductIds([]);
    setPollKey((key) => key + 1);
  }

  const displayedStatus: Status = orderId ? status : "unknown";
  const isWaiting = displayedStatus === "checking" || displayedStatus === "pending";
  const includesTerminalPurchase = confirmedProductIds.includes(TERMINAL_PRODUCT_SLUG);

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-16 lg:py-24">
      <StatePanel
        tone={getStatusTone(displayedStatus)}
        eyebrow="Checkout status"
        title={getStatusTitle(displayedStatus)}
        description={getStatusDescription(displayedStatus, message)}
        icon={displayedStatus === "paid" ? "/icons/success/success-color-32.png" : displayedStatus === "failed" || displayedStatus === "error" ? "/icons/error/error-color-32.png" : "/icons/update/update-infographic-32.png"}
        actions={
          <>
            {displayedStatus === "paid" ? (
              <>
                <Link href="/dashboard#downloads" className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  Go to downloads
                </Link>
                {orderId ? (
                  <Link href={`/receipts/${encodeURIComponent(orderId)}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
                    View receipt
                  </Link>
                ) : null}
              </>
            ) : null}
            {isWaiting || displayedStatus === "stalled" || displayedStatus === "error" ? (
              <button
                type="button"
                onClick={retryStatusCheck}
                className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                Refresh status
              </button>
            ) : null}
            {displayedStatus === "failed" || displayedStatus === "unknown" ? (
              <Link href="/cart" className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                Back to cart
              </Link>
            ) : null}
            {displayedStatus !== "paid" ? (
              <>
                <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
                  My purchases
                </Link>
                <Link href="/support" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
                  Contact support
                </Link>
              </>
            ) : null}
          </>
        }
      >
        {isWaiting ? (
          <div className="flex items-center gap-3 rounded-md border border-cyan-border bg-main/60 p-3 text-sm text-muted" role="status" aria-live="polite">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-border border-t-brand" aria-hidden="true" />
            <span>Checking Razorpay confirmation...</span>
          </div>
        ) : null}
      </StatePanel>
      {displayedStatus === "paid" ? (
        <PostPurchaseOnboarding
          className="mt-6"
          context="success"
          orderId={orderId}
          showTerminalPasswordStep={includesTerminalPurchase}
        />
      ) : null}
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutStatusFallback />}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}

function CheckoutStatusFallback() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <StatePanel
        eyebrow="Checkout status"
        title="Loading payment status."
        description="Preparing the checkout confirmation page."
        icon="/icons/update/update-infographic-32.png"
      />
    </main>
  );
}

function getStatusTone(status: Status) {
  if (status === "paid") return "success";
  if (status === "failed" || status === "error") return "error";
  if (status === "stalled" || status === "unknown") return "warning";
  return "info";
}

function getStatusTitle(status: Status) {
  if (status === "paid") return "Payment confirmed.";
  if (status === "failed") return "Payment needs attention.";
  if (status === "unknown") return "We need an order reference.";
  if (status === "stalled") return "Payment confirmation is still pending.";
  if (status === "error") return "We could not verify the payment status.";
  return "Confirming your payment.";
}

function getStatusDescription(status: Status, message: string) {
  if (status === "paid") return "Your products are unlocked. Use the next steps below to download builds, prepare terminal authentication when needed, and keep support details ready.";
  if (status === "failed") return "Razorpay reported that the payment did not complete. You can retry checkout from the cart when you are ready.";
  if (status === "unknown") return message || "This checkout link is missing its Razorpay order reference. Open your cart or purchase library to continue.";
  if (status === "stalled") return message || "You may refresh this status, check your purchase library, or contact support with your payment details.";
  if (status === "error") return message || "The status service did not return a usable response. Retry or contact support if the payment was charged.";
  return "Access unlocks once the server verifies your Razorpay payment. This usually takes a few seconds.";
}
