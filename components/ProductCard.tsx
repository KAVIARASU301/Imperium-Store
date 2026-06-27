import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]">
      <ProductImage product={product} className="m-3 mb-0 rounded-2xl" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          <span>{product.type}</span><span>{product.currency} checkout</span>
        </div>
        {product.badges?.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <span key={badge} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-200">
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
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">One-time license</p>
          <p className="mt-1 text-3xl font-semibold tracking-normal text-white">{formatPrice(product.price, product.currency)}</p>
        </div>
        <Link href={`/products/${product.slug}`} className="mt-5 inline-flex justify-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-slate-100 hover:border-white/25 hover:bg-white/[0.1]">
          View Details
        </Link>
      </div>
    </article>
  );
}
