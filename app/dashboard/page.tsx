import DashboardLayout from "@/components/DashboardLayout";
import DashboardProducts from "@/components/DashboardProducts";
import { getActiveProducts } from "@/lib/products";

export default function DashboardPage() {
  const products = getActiveProducts();
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-white">My Purchases</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Paid products unlock automatically once Razorpay confirms your payment. Free products are available immediately after login.
      </p>
      <DashboardProducts products={products} />
    </DashboardLayout>
  );
}
