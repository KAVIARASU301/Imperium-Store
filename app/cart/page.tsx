import CartPageClient from "@/components/CartPageClient";
import { getActiveProducts } from "@/lib/products";
import { connection } from "next/server";

export default async function CartPage() {
  await connection();
  return <CartPageClient products={getActiveProducts()} />;
}
