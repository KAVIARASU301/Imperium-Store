"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCurrencySymbol, formatPriceAmount } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import { usePurchasedProducts } from "@/components/usePurchasedProducts";

export default function ProductCard({ product, variant = "horizontal" }: { product: Product; variant?: "horizontal" | "vertical" }) {
  const primaryBadge = product.badges?.[0];
  const { purchasedSlugSet } = usePurchasedProducts();
  const isPurchased = purchasedSlugSet.has(product.slug);
  const featurePoints = product.highlights?.slice(0, 3) ?? [];
  const primaryBadgeClass =
    primaryBadge === "Indian options"
      ? "border-success/45 bg-success/10 text-success"
      : primaryBadge === "India + U.S. stocks"
        ? "border-brand/50 bg-brand/10 text-brand"
        : "border-cyan-border text-muted";

  if (variant === "vertical") {
    return (
      <article className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-lg border-2 border-[rgba(0,207,255,0.22)] bg-[linear-gradient(145deg,rgba(8,26,52,0.99),rgba(3,12,28,0.99)_48%,rgba(7,22,43,0.99))] shadow-[0_28px_80px_rgba(0,0,0,0.52),0_0_0_1px_rgba(255,255,255,0.09)_inset,0_0_0_4px_rgba(0,207,255,0.025)_inset] transition hover:-translate-y-0.5 hover:border-[rgba(0,207,255,0.3)] hover:shadow-[0_24px_68px_rgba(0,0,0,0.54),0_0_0_1px_rgba(255,255,255,0.11)_inset,0_0_18px_rgba(0,207,255,0.07)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_24%,transparent_80%,rgba(0,207,255,0.045)),radial-gradient(circle_at_18%_0%,rgba(0,207,255,0.08),transparent_34%)] opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[length:28px_28px]" />
        <div className="relative border-b-2 border-cyan-border bg-main p-2">
          <Image
            src={product.gallery?.[0]?.src ?? product.image.src}
            alt={product.gallery?.[0]?.alt ?? product.image.alt}
            width={product.gallery?.[0]?.width ?? product.image.width}
            height={product.gallery?.[0]?.height ?? product.image.height}
            className="aspect-[16/9] w-full rounded-md border border-[rgba(0,207,255,0.28)] object-cover object-top opacity-100 shadow-[0_18px_36px_rgba(0,0,0,0.38)] transition group-hover:border-[rgba(0,207,255,0.34)]"
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
            suppressHydrationWarning
          />
          <div className="absolute inset-x-2 bottom-2 h-16 rounded-b-md bg-gradient-to-t from-card to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="rounded-md border border-cyan-border bg-section/90 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-brand shadow-[0_0_16px_rgba(0,207,255,0.12)] backdrop-blur">
              {product.type === "app" ? "Software" : product.type}
            </span>
            {primaryBadge ? (
              <span className={`hidden rounded-md border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide shadow-[0_0_16px_rgba(0,0,0,0.24)] backdrop-blur sm:inline-flex ${primaryBadgeClass}`}>
                {primaryBadge === "India + U.S. stocks" ? "India + U.S." : primaryBadge}
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[rgba(0,207,255,0.28)] bg-[linear-gradient(145deg,rgba(8,28,57,0.98),rgba(3,13,29,0.98))] p-2 shadow-[0_0_18px_rgba(0,207,255,0.09),0_0_0_1px_rgba(255,255,255,0.07)_inset] transition group-hover:border-[rgba(0,207,255,0.34)]">
              <Image
                src={product.icon.src}
                alt={product.icon.alt}
                width={product.icon.width}
                height={product.icon.height}
                className="h-8 w-8 object-contain"
                sizes="32px"
                suppressHydrationWarning
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold leading-6 tracking-tight text-white">{product.name}</h3>
              <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">English</p>
            </div>
          </div>

          <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-muted">{product.short_description}</p>

          <div className="mt-4 rounded-md border border-cyan-border bg-section/55 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
            <div className="flex items-end justify-between gap-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">One-time purchase</p>
              <p className="text-right text-white">
                <span className="mr-1 align-baseline text-xs font-semibold">
                  {formatCurrencySymbol(product.currency)}
                </span>
                <span className="font-sans text-xl font-extrabold tracking-normal tabular-nums">
                  {formatPriceAmount(product.price)}
                </span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href={`/products/${product.slug}`}
                className="btn-secondary flex min-h-10 items-center justify-center rounded-md px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em]"
              >
                Details
              </Link>
              <AddToCartButton
                slug={product.slug}
                className="btn-primary flex min-h-10 items-center justify-center rounded-md px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em]"
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

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
              suppressHydrationWarning
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
            {featurePoints.length ? (
              <ul className="mt-4 grid gap-2 lg:grid-cols-3">
                {featurePoints.map((feature) => (
                  <li key={feature.title} className="border border-cyan-border bg-main/35 p-3">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand">{feature.title}</p>
                    <p className="mt-1 text-xs leading-5 text-copy">{feature.text}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-3 bg-section p-5 sm:flex-row sm:items-stretch sm:justify-between md:flex-col md:justify-center">
            {isPurchased ? (
              <span className="flex min-h-9 w-full items-center justify-center border border-success/45 bg-success/10 px-3 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wide text-success">
                In your account
              </span>
            ) : null}
            <p className="flex min-h-11 w-full items-center justify-center border border-cyan-border bg-main/35 px-3 py-2 text-center text-white">
              <span className="mr-1 align-baseline text-sm font-semibold">
                {formatCurrencySymbol(product.currency)}
              </span>
              <span className="font-sans text-lg font-bold tracking-normal tabular-nums">
                {formatPriceAmount(product.price)}
              </span>
            </p>
            <Link
                href={`/products/${product.slug}`}
                className="flex min-h-11 w-full items-center justify-center whitespace-nowrap border border-cyan-border bg-card px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-brand"
            >
              View Details
            </Link>
            <AddToCartButton
                slug={product.slug}
                className="btn-primary flex min-h-11 w-full items-center justify-center whitespace-nowrap px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white"
            />
        </div>
      </article>
  );
}
