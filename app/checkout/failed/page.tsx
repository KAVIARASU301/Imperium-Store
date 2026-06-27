import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <section className="border border-[#1b3055] bg-[#0c1525] p-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Checkout status</p>
      <h1 className="mt-3 text-2xl font-bold text-[#c5d5ee]">Payment Needs Attention</h1>
      <p className="mt-2 text-[#6882a8]">Please review your cart and try again when you are ready. Razorpay will handle any eligible reversal automatically.</p>
      <Link href="/cart" className="mt-8 inline-block border border-[#1b3055] bg-[#111d35] px-6 py-3 font-semibold uppercase tracking-[0.08em] text-[#c5d5ee] hover:border-[#1e52e8]">
        Back to Cart
      </Link>
      </section>
    </main>
  );
}
