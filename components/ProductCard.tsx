import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCurrencySymbol, formatPriceAmount } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const primaryBadge = product.badges?.[0];
  const primaryBadgeClass =
    primaryBadge === "Indian options"
      ? "border-[#22C55E]/45 bg-[#22C55E]/10 text-[#86efac]"
      : primaryBadge === "India + U.S. stocks"
        ? "border-[#0891b2]/50 bg-[#0891b2]/12 text-[#67e8f9]"
        : "border-[#1b3055] text-[#6882a8]";

  return (
      <article className="grid gap-px border border-[#1b3055] bg-[#1b3055] transition hover:border-[#1e52e8] hover:bg-[#1e52e8] md:grid-cols-[136px_1fr_180px]">
        <div className="bg-[#0c1525] p-3">
          <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden border border-[#1b3055] bg-[#070c17] md:h-full">
            <Image
              src={product.icon.src}
              alt={product.icon.alt}
              width={product.icon.width}
              height={product.icon.height}
              className="h-16 w-16 object-contain"
              sizes="64px"
            />
          </div>
        </div>
        <div className="bg-[#0c1525] p-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6882a8]">{product.type}</p>
              {primaryBadge ? (
                  <span className={`border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${primaryBadgeClass}`}>
                {primaryBadge === "India + U.S. stocks" ? "India + United States stocks" : primaryBadge}
              </span>
              ) : null}
            </div>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-[#c5d5ee]">{product.name}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6882a8]">{product.short_description}</p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between gap-3 bg-[#0c1525] p-5 md:flex-col md:items-end">
            <p className="text-[#c5d5ee]">
              <span className="mr-1 align-baseline text-sm font-semibold">
                {formatCurrencySymbol(product.currency)}
              </span>
              <span className="font-sans text-lg font-bold tracking-normal tabular-nums">
                {formatPriceAmount(product.price)}
              </span>
            </p>
            <Link
                href={`/products/${product.slug}`}
                className="whitespace-nowrap border border-[#1b3055] bg-[#111d35] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#c5d5ee] hover:border-[#1e52e8]"
            >
              View Details
            </Link>
            <AddToCartButton
                slug={product.slug}
                className="whitespace-nowrap bg-[#1e52e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#2b63ff]"
            />
        </div>
      </article>
  );
}
