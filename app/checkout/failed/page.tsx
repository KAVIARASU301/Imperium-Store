import Link from "next/link";
import StatePanel from "@/components/StatePanel";

export default async function CheckoutFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const orderId = Array.isArray(params.order_id) ? params.order_id[0] : params.order_id;

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <StatePanel
        tone="error"
        eyebrow="Checkout status"
        title="Payment needs attention."
        description="The payment did not complete or was cancelled before confirmation. Review your cart and try again when you are ready. Razorpay handles any eligible reversal automatically."
        icon="/icons/error/error-color-32.png"
        actions={
          <>
            <Link href="/cart" className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
              Back to cart
            </Link>
            <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
              My purchases
            </Link>
            <Link href="/support" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
              Contact support
            </Link>
          </>
        }
      >
        {orderId ? (
          <div className="rounded-md border border-cyan-border bg-main/60 p-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Order reference</p>
            <p className="mt-1 break-all font-mono text-xs text-white">{orderId}</p>
          </div>
        ) : null}
      </StatePanel>
    </main>
  );
}
