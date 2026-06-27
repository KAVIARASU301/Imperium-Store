import DashboardLayout from "@/components/DashboardLayout";
import DashboardProducts from "@/components/DashboardProducts";
import { getActiveProducts } from "@/lib/products";

export default function DashboardPage() {
  const products = getActiveProducts();
  return (
    <DashboardLayout>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">Customer access</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-normal text-white">My Purchases</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Access your licensed products, platform-specific builds, version details, and release downloads from one secure account workspace.
      </p>
      <DashboardProducts products={products} />
    </DashboardLayout>
  );
}
