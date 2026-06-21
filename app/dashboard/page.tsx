export default function DashboardPage() {
  // TODO: fetch the logged-in user's purchases from Supabase.
  // Only render products where purchase.status === "paid".
  return (
    <main className="px-6 py-16 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-white">My Purchases</h1>
    </main>
  );
}
