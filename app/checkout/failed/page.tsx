export default function CheckoutFailedPage() {
  return (
    <main className="px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-white">Payment Failed</h1>
      <p className="text-slate-400 mt-2">
        No amount was deducted, or it will be refunded automatically.
      </p>
    </main>
  );
}
