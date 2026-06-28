import DashboardLayout from "@/components/DashboardLayout";
import DashboardProducts from "@/components/DashboardProducts";
import { getActiveProducts } from "@/lib/products";

export default function DashboardPage() {
  const products = getActiveProducts();
  return (
    <DashboardLayout>
      <section className="overflow-hidden rounded-md border border-cyan-border bg-[linear-gradient(180deg,rgba(16,29,47,0.92),rgba(11,22,38,0.96))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">Account library</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-normal text-white">My Purchases</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Your licensed Imperium products, verified receipts, and platform builds in one secure workspace.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-md border border-cyan-border bg-cyan-border text-xs text-muted sm:grid-cols-3 md:min-w-[420px]">
            <div className="bg-main/80 px-4 py-3">
              <p className="font-mono uppercase tracking-[0.14em]">Access</p>
              <p className="mt-1 font-semibold text-white">Account verified</p>
            </div>
            <div className="bg-main/80 px-4 py-3">
              <p className="font-mono uppercase tracking-[0.14em]">Delivery</p>
              <p className="mt-1 font-semibold text-white">Direct downloads</p>
            </div>
            <div className="bg-main/80 px-4 py-3">
              <p className="font-mono uppercase tracking-[0.14em]">Records</p>
              <p className="mt-1 font-semibold text-white">Receipts stored</p>
            </div>
          </div>
        </div>
      </section>
      <DashboardProducts products={products} />
    </DashboardLayout>
  );
}
