"use client";

import AddToCartButton from "@/components/AddToCartButton";
import { usePurchasedProducts } from "@/components/usePurchasedProducts";
import {
  formatCurrencySymbol,
  formatPriceAmount,
  getProductGstInclusiveText,
  isProductReady,
} from "@/lib/products";
import type { CheckoutPlanId } from "@/types/pricing";
import type { Product } from "@/types/product";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PricingBox({
  product,
  anchorId = "plans",
}: {
  product: Product;
  anchorId?: string;
}) {
  const ready = isProductReady(product);
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] =
    useState<CheckoutPlanId>(
      searchParams.get("plan") === "lifetime" || !product.monthly_pricing
        ? "lifetime"
        : "monthly",
    );
  const { accessBySlug, loaded } = usePurchasedProducts();
  const access = accessBySlug[product.slug];
  const hasLifetime = access?.access_type === "lifetime";
  const hasActiveMonthly =
    access?.has_access &&
    (access.access_type === "intro_month" ||
      access.access_type === "monthly");
  const introEligible = !loaded || access?.intro_eligible !== false;
  const monthlyPrice = introEligible
    ? product.monthly_pricing?.introductory_price
    : product.monthly_pricing?.renewal_price;
  const effectiveSelectedPlan = hasLifetime ? "lifetime" : selectedPlan;
  const selectedPrice =
    effectiveSelectedPlan === "monthly" && monthlyPrice !== undefined
      ? monthlyPrice
      : product.price;

  return (
    <aside id={anchorId} className="surface-panel scroll-mt-28 overflow-hidden">
      <div className="border-b border-cyan-border bg-card-hover px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand">
              {ready ? "Choose your access" : "Coming soon"}
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              {ready
                ? "Start for a month or own the terminal for life"
                : "Checkout opens when this product is ready"}
            </p>
          </div>
          {hasLifetime ? (
            <span className="shrink-0 border border-success/35 bg-success/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-success">
              Lifetime owned
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {hasActiveMonthly ? (
          <div className="mb-4 rounded-md border border-success/30 bg-success/8 p-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-success">
              Monthly access active
            </p>
            <p className="mt-1 text-sm leading-5 text-white">
              Available until {formatAccessDate(access.current_period_end)}.
              You can renew or switch to lifetime access now.
            </p>
          </div>
        ) : null}

        {product.monthly_pricing ? (
          <div
            className="grid gap-3"
            role="radiogroup"
            aria-label="Access plan"
          >
            <PlanOption
              selected={effectiveSelectedPlan === "monthly"}
              onSelect={() => setSelectedPlan("monthly")}
              disabled={hasLifetime}
              eyebrow={
                introEligible ? "Try it for one month" : "One-month renewal"
              }
              title={introEligible ? "First month" : "Monthly access"}
              price={monthlyPrice ?? product.monthly_pricing.renewal_price}
              currency={product.currency}
              suffix="for 1 month"
              badge={introEligible ? "Best way to start" : undefined}
              details={
                introEligible
                  ? `One introductory month for ₹${formatPriceAmount(product.monthly_pricing.introductory_price)}. Renew later at ₹${formatPriceAmount(product.monthly_pricing.renewal_price)} per month.`
                  : `Add one more month for ₹${formatPriceAmount(product.monthly_pricing.renewal_price)}. Active time is carried forward.`
              }
            />
            <PlanOption
              selected={effectiveSelectedPlan === "lifetime"}
              onSelect={() => setSelectedPlan("lifetime")}
              eyebrow={
                hasActiveMonthly ? "Upgrade anytime" : "Pay once, keep forever"
              }
              title="Lifetime access"
              price={product.price}
              currency={product.currency}
              suffix="one-time"
              badge={hasActiveMonthly ? "Upgrade" : undefined}
              details="Permanent download and update access on this account. No expiry and no renewals."
            />
          </div>
        ) : (
          <div className="rounded-md border border-cyan-border bg-section p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              Lifetime access
            </p>
            <Price
              price={product.price}
              currency={product.currency}
              suffix="one-time"
            />
            <p className="mt-3 border-t border-cyan-border pt-3 text-sm font-medium leading-6 text-muted">
              {ready
                ? "One payment. Lifetime access to downloads and updates."
                : "This product is not ready for purchase yet."}
            </p>
          </div>
        )}

        <AddToCartButton
          slug={product.slug}
          planId={effectiveSelectedPlan}
          checkout
          isReady={ready}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 btn-primary rounded-md px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white"
        >
          <Image
            src="/icons/cart.svg"
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
          {effectiveSelectedPlan === "monthly"
            ? introEligible
              ? `Start one month for ₹${formatPriceAmount(selectedPrice)}`
              : `Add one month for ₹${formatPriceAmount(selectedPrice)}`
            : hasActiveMonthly
              ? `Upgrade to lifetime for ₹${formatPriceAmount(selectedPrice)}`
              : `Buy lifetime for ₹${formatPriceAmount(selectedPrice)}`}
        </AddToCartButton>

        <p className="mt-3 text-center text-xs font-medium leading-5 text-muted">
          {ready
            ? effectiveSelectedPlan === "monthly"
              ? "One-month access. Renew only when you choose; there is no automatic charge."
              : "One-time payment for permanent access."
            : "Checkout will be enabled when this product is ready."}
        </p>
        <p className="mt-3 font-mono text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          {getProductGstInclusiveText(product)} · Secure Razorpay checkout
        </p>
      </div>
    </aside>
  );
}

function PlanOption({
  selected,
  onSelect,
  eyebrow,
  title,
  price,
  currency,
  suffix,
  badge,
  details,
  disabled = false,
}: {
  selected: boolean;
  onSelect: () => void;
  eyebrow: string;
  title: string;
  price: number;
  currency: string;
  suffix: string;
  badge?: string;
  details: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      disabled={disabled}
      className={`relative w-full rounded-md border p-4 text-left transition ${
        selected
          ? "border-brand bg-card-hover shadow-[0_0_0_1px_rgba(139,188,232,0.14)_inset]"
          : disabled
            ? "cursor-not-allowed border-cyan-border bg-section opacity-55"
            : "border-cyan-border bg-section hover:border-brand/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
            {eyebrow}
          </p>
          <p className="mt-1 text-base font-bold text-white">{title}</p>
        </div>
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? "border-brand bg-brand"
              : "border-cyan-border bg-main"
          }`}
          aria-hidden="true"
        >
          {selected ? (
            <span className="h-1.5 w-1.5 rounded-full bg-main" />
          ) : null}
        </span>
      </div>
      <Price price={price} currency={currency} suffix={suffix} />
      {badge ? (
        <span className="mt-2 inline-flex border border-gold/35 bg-gold/10 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-gold-bright">
          {badge}
        </span>
      ) : null}
      <p className="mt-2 text-xs leading-5 text-muted">{details}</p>
    </button>
  );
}

function Price({
  price,
  currency,
  suffix,
}: {
  price: number;
  currency: string;
  suffix: string;
}) {
  return (
    <p className="mt-2 flex items-baseline gap-1 text-white">
      <span className="text-base font-semibold">
        {formatCurrencySymbol(currency)}
      </span>
      <span className="font-sans text-3xl font-extrabold tracking-normal tabular-nums">
        {formatPriceAmount(price)}
      </span>
      <span className="ml-1 text-xs font-medium text-muted">{suffix}</span>
    </p>
  );
}

function formatAccessDate(value: string | null) {
  if (!value) return "the end of your current term";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}
