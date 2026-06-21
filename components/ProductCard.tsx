import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col border border-slate-800 bg-[#0B1020] p-5 transition hover:border-cyan-400/60">
      <div className="mb-4 flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest text-slate-500">
        <span>{product.type}</span><span>{product.currency}</span>
      </div>
      <h3 className="text-xl font-semibold text-white">{product.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{product.short_description}</p>
      <p className="mt-5 font-mono text-2xl text-cyan-300">{formatPrice(product.price, product.currency)}</p>
      <Link href={`/products/${product.slug}`} className="mt-5 inline-flex justify-center border border-slate-700 px-4 py-3 text-sm font-semibold text-cyan-300 hover:border-cyan-300">
        View Details
      </Link>
    </article>
  );
}
