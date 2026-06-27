import DashboardLayout from "@/components/DashboardLayout";
import DashboardProducts from "@/components/DashboardProducts";
import { getActiveProducts } from "@/lib/products";

export default function DashboardPage() {
  const products = getActiveProducts();
  return (
    <DashboardLayout>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0891b2]">Customer access</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-normal text-[#c5d5ee]">My Purchases</h1>
      <p className="mt-3 max-w-2xl text-[#6882a8]">
        Access your licensed products, platform-specific builds, version details, and release downloads from one secure account workspace.
      </p>
      <DashboardProducts products={products} />
    </DashboardLayout>
  );
}
