import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <section className="border border-cyan-border bg-section p-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">Checkout status</p>
      <h1 className="mt-3 text-2xl font-bold text-white">Payment Needs Attention</h1>
      <p className="mt-2 text-muted">Please review your cart and try again when you are ready. Razorpay will handle any eligible reversal automatically.</p>
      <Link href="/cart" className="mt-8 inline-block border border-cyan-border bg-card px-6 py-3 font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
        Back to Cart
      </Link>
      </section>
    </main>
  );
}
