import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1020]/90 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-cyan-950/30">
      <ProductImage product={product} className="m-3 mb-0 rounded-2xl" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest text-slate-500">
          <span>{product.type}</span><span>{product.currency}</span>
        </div>
        {product.badges?.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <span key={badge} className="border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-cyan-200">
                {badge}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-3">
          <Image src={product.icon.src} alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
          <h3 className="text-2xl font-semibold text-white">{product.name}</h3>
        </div>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{product.short_description}</p>
        <p className="mt-5 font-mono text-2xl text-cyan-300">{formatPrice(product.price, product.currency)}</p>
        <Link href={`/products/${product.slug}`} className="mt-5 inline-flex justify-center rounded-full border border-slate-700 px-4 py-3 text-sm font-semibold text-cyan-300 hover:border-cyan-300 hover:bg-cyan-300/10">
          View Details
        </Link>
      </div>
    </article>
  );
}
