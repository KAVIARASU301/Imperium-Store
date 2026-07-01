export default function Page() {
  return (
    <main className="page-container max-w-3xl py-14">
      <section className="policy-card">
        <p className="section-kicker">Store policy</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Refund Policy</h1>
        <div className="mt-6 space-y-5 leading-8 text-muted">
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
