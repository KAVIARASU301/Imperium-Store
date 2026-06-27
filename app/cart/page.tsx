import CartPageClient from "@/components/CartPageClient";
import { getActiveProducts } from "@/lib/products";

export default function CartPage() {
  return <CartPageClient products={getActiveProducts()} />;
}
