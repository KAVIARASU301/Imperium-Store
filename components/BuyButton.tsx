"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { createRazorpayCheckout } from "@/lib/razorpay-client";

interface CreateOrderResponse {
  orderId: string | null;
  amount: number;
  currency: string;
  keyId?: string;
  productId: string;
  message?: string;
}

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export default function BuyButton({ slug, price, productName }: { slug: string; price: number; productName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        router.push(`/login?next=${encodeURIComponent(`/products/${slug}`)}`);
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: slug }),
      });
      const order: CreateOrderResponse = await res.json();
      if (!res.ok) throw new Error(order.message ?? "Unable to start checkout");

      if (!order.orderId) {
        router.push("/dashboard");
        return;
      }
      if (!order.keyId) throw new Error("Checkout is not configured");

      const checkout = await createRazorpayCheckout({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Imperium Store",
        description: productName,
        prefill: { email: sessionData.session?.user.email ?? undefined },
        theme: { color: "#22D3EE" },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify(response),
            });
            const verifyPayload = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyPayload.message ?? "Payment verification failed");
            router.push(`/checkout/success?order_id=${response.razorpay_order_id}`);
          } catch (error) {
            setError(error instanceof Error ? error.message : "Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      checkout.on("payment.failed", () => {
        router.push(`/checkout/failed?order_id=${order.orderId}`);
      });

      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
      <div>
        <button
            onClick={handleClick}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
              <>
                <span className="h-4 w-4 animate-spin border-2 border-slate-600 border-t-black" aria-hidden="true" />
                Starting checkout...
              </>
          ) : (
              <>
                <Image src={price === 0 ? "/icons/tick.svg" : "/icons/cart.svg"} alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                {price === 0 ? "Get Access" : "Buy Now"}
              </>
          )}
        </button>
        {error ? <p className="mt-3 text-sm text-amber-200">{error}</p> : null}
      </div>
  );
}