export default function CheckoutSuccessPage() {
  return (
    <main className="px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-white">Payment Successful</h1>
      <p className="text-slate-400 mt-2">
        Access unlocks once the Razorpay webhook confirms your purchase.
      </p>
    </main>
  );
}
