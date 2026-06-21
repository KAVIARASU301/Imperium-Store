import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border border-slate-800 bg-[#0B1020] rounded-md p-5">
      <h3 className="text-white font-medium">{product.name}</h3>
      <p className="text-slate-400 text-sm mt-1">{product.short_description}</p>
      <p className="font-mono text-cyan-400 mt-3">₹{product.price}</p>
      <Link href={`/products/${product.slug}`} className="inline-block mt-4 text-sm text-cyan-400">
        View Details →
      </Link>
    </div>
  );
}
