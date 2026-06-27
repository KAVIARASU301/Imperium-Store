import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCurrencySymbol, formatPriceAmount } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const primaryBadge = product.badges?.[0];
  const primaryBadgeClass =
    primaryBadge === "Indian options"
      ? "border-success/45 bg-success/10 text-success"
      : primaryBadge === "India + U.S. stocks"
        ? "border-brand/50 bg-brand/10 text-brand"
        : "border-cyan-border text-muted";

  return (
      <article className="grid gap-px border border-cyan-border bg-cyan-border shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:border-brand hover:shadow-[0_0_28px_rgba(0,207,255,0.18)] md:grid-cols-[136px_1fr_180px]">
        <div className="bg-section p-3">
          <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden border border-cyan-border bg-main md:h-full">
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
        <div className="bg-section p-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">{product.type}</p>
              {primaryBadge ? (
                  <span className={`border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${primaryBadgeClass}`}>
                {primaryBadge === "India + U.S. stocks" ? "India + United States stocks" : primaryBadge}
              </span>
              ) : null}
            </div>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-white">{product.name}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{product.short_description}</p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between gap-3 bg-section p-5 md:flex-col md:items-end">
            <p className="text-white">
              <span className="mr-1 align-baseline text-sm font-semibold">
                {formatCurrencySymbol(product.currency)}
              </span>
              <span className="font-sans text-lg font-bold tracking-normal tabular-nums">
                {formatPriceAmount(product.price)}
              </span>
            </p>
            <Link
                href={`/products/${product.slug}`}
                className="whitespace-nowrap border border-cyan-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-brand"
            >
              View Details
            </Link>
            <AddToCartButton
                slug={product.slug}
                className="whitespace-nowrap btn-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white "
            />
        </div>
      </article>
  );
}
