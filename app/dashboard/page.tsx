import DashboardLayout from "@/components/DashboardLayout";
import DashboardProducts from "@/components/DashboardProducts";
import { getActiveProducts } from "@/lib/products";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "My Purchases | Imperium Store",
  description: "Download your software, view receipts, and manage your terminal login.",
  robots: { index: false },
};

export default async function DashboardPage() {
  await connection();
  const products = getActiveProducts();
  return (
    <DashboardLayout>
      <header className="mb-6 sm:mb-8">
        <p className="section-kicker">Account</p>
        <h1 className="section-title">My Purchases</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Everything you own in one place — download your software, view receipts, and manage your terminal login.
        </p>
      </header>
      <DashboardProducts products={products} />
    </DashboardLayout>
  );
}
