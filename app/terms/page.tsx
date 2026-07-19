export default function Page() {
  return (
    <main className="page-container max-w-3xl py-14">
      <section className="policy-card">
        <p className="section-kicker">Store policy</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Terms</h1>
        <div className="mt-6 space-y-5 leading-8 text-muted">
          <p>
            By purchasing or using products from Imperium Store, you agree to use the software, tools, and educational material
            responsibly and only for lawful purposes.
          </p>
          <p>
            The introductory terminal offer provides one month of access for ₹199 and may be used once per account. Later monthly
            payments add one month of access for ₹499. Monthly access does not renew automatically. Lifetime access is a separate
            one-time purchase that permanently removes the access expiry for that product on your account.
          </p>
          <p>
            Trading and investing in financial markets involve risk, including the possible loss of capital. Our products are intended
            to support analysis, workflow, execution, learning, or review, but they do not provide financial advice and do not guarantee
            profit, income, accuracy, or trading performance.
          </p>
          <p>
            You are fully responsible for your trading decisions, broker accounts, credentials, order placement, risk management, and
            compliance with applicable laws and broker terms.
          </p>
        </div>
      </section>
    </main>
  );
}
