export default function Page() {
  return (
    <main className="page-container max-w-3xl py-14">
      <section className="policy-card">
        <p className="section-kicker">Risk notice</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Disclaimer</h1>
        <p className="mt-6 leading-8 text-muted">
          Imperium Store content is for educational purposes only. It is not investment advice. Trading involves risk, and past performance does not guarantee future results.
        </p>
        <div className="mt-8 border-t border-cyan-border pt-5 text-sm leading-7 text-muted">
          <p>Users are responsible for their own trading and investment decisions. Please evaluate suitability, risk, and broker requirements before using any product.</p>
          <p className="mt-3">Imperium Store does not guarantee profits, trade outcomes, market availability, or uninterrupted third-party broker and payment services.</p>
        </div>
      </section>
    </main>
  );
}
