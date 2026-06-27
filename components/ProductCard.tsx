import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
      <article className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-6">
        <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-sm border border-white/10 sm:h-20 sm:w-20">
          <Image src={product.image.src} alt={product.image.alt} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{product.type}</p>
              {product.badges?.[0] ? (
                  <span className="border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {product.badges[0]}
              </span>
              ) : null}
            </div>
            <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
            <p className="mt-1 max-w-xl text-sm leading-5 text-slate-400">{product.short_description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
            <p className="text-lg font-semibold text-white">{formatPrice(product.price, product.currency)}</p>
            <Link
                href={`/products/${product.slug}`}
                className="whitespace-nowrap rounded-sm border border-white/15 px-4 py-1.5 text-xs font-semibold text-white hover:border-white/30 hover:bg-white/5"
            >
              View Details
            </Link>
          </div>
        </div>
      </article>
  );
}