import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <section className="border border-[#1b3055] bg-[#0c1525] p-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Checkout status</p>
      <h1 className="mt-3 text-2xl font-bold text-[#c5d5ee]">Payment Failed</h1>
      <p className="mt-2 text-[#6882a8]">No amount was deducted, or it will be refunded automatically by Razorpay.</p>
      <Link href="/products" className="mt-8 inline-block border border-[#1b3055] bg-[#111d35] px-6 py-3 font-semibold uppercase tracking-[0.08em] text-[#c5d5ee] hover:border-[#1e52e8]">
        Back to Products
      </Link>
      </section>
    </main>
  );
}
