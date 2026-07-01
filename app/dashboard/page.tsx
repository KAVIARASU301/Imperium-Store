import DashboardLayout from "@/components/DashboardLayout";
import DashboardProducts from "@/components/DashboardProducts";
import { getActiveProducts } from "@/lib/products";
import { connection } from "next/server";

export default async function DashboardPage() {
  await connection();
  const products = getActiveProducts();
  return (
    <DashboardLayout>
      <DashboardProducts products={products} />
    </DashboardLayout>
  );
}
