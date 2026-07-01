export default function Page() {
  return (
    <main className="page-container max-w-3xl py-14">
      <section className="policy-card">
        <p className="section-kicker">Store policy</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-6 leading-8 text-muted">
          We collect account, purchase, and support information needed to provide access, checkout, downloads, and customer support.
        </p>
        <div className="mt-8 border-t border-cyan-border pt-5 text-sm leading-7 text-muted">
          <p>Payment processing is handled through Razorpay. We do not store your card, UPI, or net banking credentials on Imperium Store.</p>
          <p className="mt-3">Order records may be retained for receipts, access verification, customer support, tax, and compliance purposes.</p>
        </div>
      </section>
    </main>
  );
}
