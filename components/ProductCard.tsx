"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCurrencySymbol, formatPriceAmount, getProductGstInclusiveText, isProductReady } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import { usePurchasedProducts } from "@/components/usePurchasedProducts";

export default function ProductCard({ product, variant = "horizontal" }: { product: Product; variant?: "horizontal" | "vertical" }) {
  const primaryBadge = product.badges?.[0];
  const productTypeLabel = getProductTypeLabel(product.type);
  const previewImage = product.gallery?.[0] ?? product.image;
  const gstInclusiveText = getProductGstInclusiveText(product);
  const { purchasedSlugSet } = usePurchasedProducts();
  const isPurchased = purchasedSlugSet.has(product.slug);
  const ready = isProductReady(product);
  const featurePoints = product.highlights?.slice(0, 3) ?? [];
  const primaryBadgeClass =
    primaryBadge === "Indian options"
      ? "border-data/40 bg-data/10 text-data"
      : primaryBadge === "India + U.S. stocks"
        ? "border-gold/40 bg-gold/10 text-gold-bright"
        : "border-cyan-border text-muted";

  if (variant === "vertical") {
    return (
      <article className="interactive-panel group relative flex min-h-[430px] flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
        <div className="relative border-b border-cyan-border bg-main/80 p-2">
          <Image
            src={previewImage.src}
            alt={previewImage.alt}
            width={previewImage.width}
            height={previewImage.height}
            className="aspect-[16/9] w-full rounded-sm object-cover object-top opacity-95 shadow-[0_18px_40px_rgba(0,0,0,0.38)] transition duration-200 group-hover:opacity-100"
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
            suppressHydrationWarning
          />
          <div className="absolute inset-x-2 bottom-2 h-20 rounded-b-sm bg-gradient-to-t from-main/92 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            <span className="border border-cyan-border bg-main/80 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-brand backdrop-blur">
              {productTypeLabel}
            </span>
            {primaryBadge ? (
              <span className={`border px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wide backdrop-blur ${primaryBadgeClass}`}>
                {primaryBadge === "India + U.S. stocks" ? "India + U.S." : primaryBadge}
              </span>
            ) : null}
            {!ready ? (
              <span className="border border-warning/40 bg-warning/10 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-warning backdrop-blur">
                Coming Soon
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-cyan-border bg-main/70 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] transition group-hover:border-gold/40">
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
              <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Imperium workstation</p>
            </div>
          </div>

          <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-muted">{product.short_description}</p>

          <div className="mt-5 border-t border-cyan-border pt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">{ready ? "One-time purchase" : "Coming soon"}</p>
                {isPurchased ? <p className="mt-1 text-xs font-semibold text-success">Already in your account</p> : null}
              </div>
              <p className="text-right text-white">
                <span className="mr-1 align-baseline text-xs font-semibold">
                  {formatCurrencySymbol(product.currency)}
                </span>
                <span className="font-sans text-xl font-extrabold tracking-normal tabular-nums">
                  {formatPriceAmount(product.price)}
                </span>
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{gstInclusiveText}</span>
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
                isReady={ready}
                className="btn-primary flex min-h-10 items-center justify-center rounded-md px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em]"
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="interactive-panel group overflow-hidden">
      <div className="grid md:grid-cols-[180px_minmax(0,1fr)_220px]">
        <div className="relative bg-main/80 p-2 md:min-h-full">
          <Image
            src={previewImage.src}
            alt={previewImage.alt}
            width={previewImage.width}
            height={previewImage.height}
            className="aspect-[16/9] w-full rounded-sm object-cover object-top opacity-95 shadow-[0_16px_34px_rgba(0,0,0,0.36)] transition duration-200 group-hover:opacity-100 md:h-full md:aspect-auto"
            sizes="(min-width: 1024px) 180px, 100vw"
            suppressHydrationWarning
          />
          <div className="absolute inset-x-2 bottom-2 h-16 rounded-b-sm bg-gradient-to-t from-main/88 to-transparent" />
          <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-md border border-cyan-border bg-main/82 p-2 backdrop-blur">
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
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="border border-cyan-border bg-main/60 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-brand">
                {productTypeLabel}
              </span>
              {primaryBadge ? (
                <span className={`border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${primaryBadgeClass}`}>
                  {primaryBadge === "India + U.S. stocks" ? "India + U.S." : primaryBadge}
                </span>
              ) : null}
              {!ready ? (
                <span className="border border-warning/40 bg-warning/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-warning">
                  Coming Soon
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-lg font-bold tracking-tight text-white sm:text-xl">{product.name}</h3>
            <p className="mt-2 line-clamp-3 max-w-3xl text-sm leading-6 text-muted sm:line-clamp-none">{product.short_description}</p>
            {featurePoints.length ? (
              <ul className="mt-5 hidden gap-3 lg:grid lg:grid-cols-3">
                {featurePoints.map((feature) => (
                  <li key={feature.title} className="border-l border-gold/35 pl-3">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gold-bright">{feature.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{feature.text}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-cyan-border bg-main/36 p-4 sm:flex-row sm:items-stretch sm:justify-between sm:p-5 md:border-l md:border-t-0 md:bg-main/28 md:flex-col md:justify-center">
            {isPurchased ? (
              <span className="flex min-h-9 w-full items-center justify-center rounded-md border border-success/40 bg-success/10 px-3 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wide text-success">
                In your account
              </span>
            ) : null}
            <div className="text-center md:text-left">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">{ready ? "One-time purchase" : "Coming soon"}</p>
              <p className="mt-1 text-white">
                <span className="mr-1 align-baseline text-sm font-semibold">
                  {formatCurrencySymbol(product.currency)}
                </span>
                <span className="font-sans text-2xl font-extrabold tracking-normal tabular-nums">
                  {formatPriceAmount(product.price)}
                </span>
              </p>
              <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{gstInclusiveText}</p>
            </div>
            <Link
                href={`/products/${product.slug}`}
                className="btn-secondary flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em]"
            >
              Details
            </Link>
            <AddToCartButton
                slug={product.slug}
                isReady={ready}
                className="btn-primary flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white"
            />
        </div>
      </div>
    </article>
  );
}

function getProductTypeLabel(type: Product["type"]) {
  if (type === "app") return "Software";
  return type;
}
