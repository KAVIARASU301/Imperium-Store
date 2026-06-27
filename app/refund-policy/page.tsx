export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <section className="border border-[#1b3055] bg-[#0c1525] p-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Store policy</p>
        <h1 className="mt-3 text-4xl font-bold text-[#c5d5ee]">Refund Policy</h1>
        <div className="mt-6 space-y-5 leading-8 text-[#6882a8]">
          <p>
            All products sold through Imperium Store are digital delivery products. Once payment is completed and product access is
            issued to your account, the purchase is final and non-refundable.
          </p>
          <p>
            We do not provide refunds for digital products in any case, including accidental purchases, change of mind, lack of use,
            device changes, or account access issues after delivery.
          </p>
          <p>
            If you lose access to a purchased product, contact support with your order details and registered account email. We will
            assist with access recovery where possible, but recovery support does not make the purchase eligible for a refund.
          </p>
        </div>
      </section>
    </main>
  );
}
