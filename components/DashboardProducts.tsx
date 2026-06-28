"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import DownloadButton from "@/components/DownloadButton";
import StatePanel from "@/components/StatePanel";
import TerminalPasswordPanel from "@/components/TerminalPasswordPanel";
import { isProductReady } from "@/lib/products";
import type { Product, ProductFile } from "@/types/product";
import type { Purchase } from "@/types/purchase";

type AccessState = "checking" | "signed-out" | "ready" | "error";
const TERMINAL_PRODUCT_SLUG = "imperium-option-trading-terminal";

export default function DashboardProducts({ products }: { products: Product[] }) {
  const [state, setState] = useState<AccessState>("checking");
  const [purchasesBySlug, setPurchasesBySlug] = useState<Record<string, Purchase>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setState("checking");
      setErrorMessage("");
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          if (active) setState("signed-out");
          return;
        }
        const res = await fetch("/api/purchases/me", { headers: { Authorization: `Bearer ${token}` } });
        const payload = await res.json().catch(() => ({}));
        if (!active) return;
        if (!res.ok) {
          throw new Error(typeof payload.message === "string" ? payload.message : "Unable to load purchases");
        }
        const map: Record<string, Purchase> = {};
        for (const purchase of (payload.purchases ?? []) as Purchase[]) {
          const existing = map[purchase.product_id];
          if (shouldUsePurchaseForProduct(purchase, existing)) map[purchase.product_id] = purchase;
        }
        setPurchasesBySlug(map);
        setState("ready");
      } catch (error) {
        if (!active) return;
        setPurchasesBySlug({});
        setErrorMessage(error instanceof Error ? error.message : "Unable to load purchases");
        setState("error");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  if (state === "checking") {
    return (
      <div className="mt-6 rounded-md border border-cyan-border bg-section/90 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)]" role="status" aria-live="polite">
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-border border-t-brand" aria-hidden="true" />
          <span className="font-mono uppercase tracking-[0.12em]">Checking purchase access...</span>
        </div>
      </div>
    );
  }

  if (state === "signed-out") {
    return (
      <StatePanel
        className="mt-6"
        eyebrow="Secure account required"
        title="Log in to view your purchase library."
        description="Downloads and receipts are tied to the account used during checkout. Sign in with that email to restore access."
        actions={
          <>
            <Link href="/login?next=/dashboard" className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
              Log in
            </Link>
            <Link href="/support" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
              Get help
            </Link>
          </>
        }
      />
    );
  }

  if (state === "error") {
    return (
      <StatePanel
        className="mt-6"
        tone="error"
        eyebrow="Library unavailable"
        title="We could not load your purchases."
        description={errorMessage || "Your account is signed in, but the purchase service did not return a usable response."}
        actions={
          <>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              Retry
            </button>
            <Link href="/support" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
              Contact support
            </Link>
          </>
        }
      />
    );
  }

  if (products.length === 0) {
    return (
      <StatePanel
        className="mt-6"
        tone="warning"
        eyebrow="No products available"
        title="Your library is ready, but there are no active products to show."
        description="Product listings may be temporarily disabled. Refresh this page or contact support if you expected to see a purchase."
        actions={
          <>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              Refresh
            </button>
            <Link href="/support" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
              Contact support
            </Link>
          </>
        }
      />
    );
  }

  const unlockedCount = products.filter((product) => {
    const ready = isProductReady(product);
    const purchase = purchasesBySlug[product.slug];
    return (ready && product.price === 0) || purchase?.status === "paid";
  }).length;
  const hasTerminalPurchase = purchasesBySlug[TERMINAL_PRODUCT_SLUG]?.status === "paid";

  return (
    <div className="mt-6 grid gap-5">
      {hasTerminalPurchase ? <TerminalPasswordPanel /> : null}
      {unlockedCount === 0 ? (
        <StatePanel
          tone="info"
          eyebrow="No purchases yet"
          title="This account does not have unlocked downloads."
          description="Buy a product with this signed-in account to unlock downloads and receipts here. If you just paid, refresh the library after Razorpay finishes confirmation."
          actions={
            <>
              <Link href="/products" className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                Browse products
              </Link>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand"
              >
                Refresh library
              </button>
            </>
          }
        />
      ) : null}
      {products.map((product) => {
        const purchase = purchasesBySlug[product.slug];
        const ready = isProductReady(product);
        const hasAccess = (ready && product.price === 0) || purchase?.status === "paid";
        return (
          <article
            key={product.slug}
            className="overflow-hidden rounded-md border border-cyan-border bg-[linear-gradient(180deg,rgba(16,29,47,0.94),rgba(11,22,38,0.98))] p-5 shadow-[0_20px_58px_rgba(0,0,0,0.30)] transition hover:border-brand/40 hover:shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-cyan-border bg-main/70 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
                  <Image src={product.icon.src} alt="" width={42} height={42} className="h-10 w-10 object-contain" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-cyan-border bg-main/55 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
                      {product.type === "app" ? "Software" : product.type}
                    </span>
                    {hasAccess ? (
                      <span className="border border-gold/30 bg-gold/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-bright">
                        Lifetime access
                      </span>
                    ) : null}
                    {!ready && !hasAccess ? (
                      <span className="border border-warning/40 bg-warning/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-warning">
                        Coming Soon
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-white">{product.name}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{product.short_description}</p>
                </div>
              </div>
              <StatusBadge hasAccess={hasAccess} status={purchase?.status} ready={ready} />
            </div>
            {hasAccess ? (
              <div className="mt-5 border-t border-cyan-border pt-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-bright">Licensed builds</p>
                    <p className="mt-1 text-sm text-muted">Download the current release for your operating system.</p>
                  </div>
                  {purchase?.status === "paid" ? (
                    <Link
                      href={`/receipts/${encodeURIComponent(purchase.razorpay_order_id)}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-md border border-cyan-border bg-card px-4 py-2 text-sm font-semibold text-white hover:border-brand hover:bg-card-hover"
                    >
                      View receipt
                    </Link>
                  ) : null}
                </div>
                {product.files?.length ? (
                  <div className="grid gap-3">
                    {product.files.map((file) => (
                      <div
                        key={file.id}
                        className="group grid gap-4 rounded-md border border-cyan-border bg-main/60 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-150 hover:border-brand/60 hover:bg-card/80 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-cyan-border bg-section p-2 transition duration-150 group-hover:border-gold/40">
                            <Image src={getPlatformIcon(file)} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-white">{getPlatformTitle(file)}</p>
                              <span className="border border-cyan-border bg-section px-2 py-1 font-mono text-[11px] font-semibold uppercase text-muted">
                                v{file.version}
                              </span>
                            </div>
                            <p className="mt-1 flex min-w-0 items-center gap-2 font-mono text-xs uppercase text-muted">
                              <Image src="/icons/file.svg" alt="" width={16} height={16} className="h-4 w-4 shrink-0 object-contain" />
                              <span className="truncate">{file.file_name}</span>
                            </p>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{getPlatformNote(file)}</p>
                          </div>
                        </div>
                        <DownloadButton
                          fileId={file.id}
                          label={`Download ${getPlatformLabel(file)}`}
                          wrapperClassName="w-full sm:w-52"
                          className="w-full min-w-0"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <StatePanel
                    compact
                    tone="warning"
                    eyebrow="Builds pending"
                    title="No download files are published yet."
                    description="Your license is active. The product build is still being prepared and will appear here when it is published."
                    actions={
                      <Link href="/support" className="inline-flex min-h-10 items-center justify-center rounded-md border border-cyan-border bg-card px-4 py-2 text-sm font-semibold text-white hover:border-brand hover:bg-card-hover">
                        Ask support
                      </Link>
                    }
                  />
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-cyan-border bg-main/45 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{getLockedTitle(purchase?.status, ready)}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{getLockedMessage(purchase?.status, ready)}</p>
                  </div>
                  <Link href={`/products/${product.slug}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-cyan-border bg-card px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand hover:bg-card-hover sm:w-52">
                    {ready && purchase?.status === "pending" ? "Complete payment" : "View product"}
                  </Link>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function getLockedTitle(status?: string, ready = true) {
  if (!ready) return "Coming soon";
  if (status === "pending") return "Payment confirmation pending";
  if (status === "failed") return "Payment was not completed";
  return "Product not purchased";
}

function getLockedMessage(status?: string, ready = true) {
  if (!ready) return "This product is not ready for checkout yet.";
  if (status === "pending") return "Open the product page to complete checkout or refresh payment confirmation.";
  if (status === "failed") return "You can start checkout again when you are ready.";
  return "Purchase this product to unlock downloads and receipts in your account.";
}

function shouldUsePurchaseForProduct(purchase: Purchase, existing?: Purchase) {
  if (!existing) return true;
  if (existing.status !== "paid" && purchase.status === "paid") return true;
  if (existing.status === "paid" && purchase.status !== "paid") return false;
  return new Date(purchase.created_at) > new Date(existing.created_at);
}

function getPlatformIcon(file: ProductFile) {
  if (file.platform === "linux") return "/icons/linux-mint.svg";
  if (file.platform === "windows") return "/icons/windows.svg";
  return "/icons/file.svg";
}

function getPlatformLabel(file: ProductFile) {
  if (file.platform === "linux") return "Linux Mint";
  if (file.platform === "windows") return "Windows";
  return file.platform;
}

function getPlatformTitle(file: ProductFile) {
  return `${getPlatformLabel(file)} version`;
}

function getPlatformNote(file: ProductFile) {
  if (file.platform === "linux") return "Developed and tested on Linux Mint. Recommended for Linux Mint users.";
  if (file.platform === "windows") return "Windows build for users running Imperium on Windows.";
  return "Download package for this platform.";
}

function StatusBadge({ hasAccess, status, ready }: { hasAccess: boolean; status?: string; ready: boolean }) {
  if (hasAccess) {
    return (
      <span className="inline-flex min-h-9 items-center justify-center rounded-md border border-success/35 bg-success/10 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-success">
        Unlocked
      </span>
    );
  }
  if (!ready) {
    return (
      <span className="inline-flex min-h-9 items-center justify-center rounded-md border border-warning/35 bg-warning/10 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-warning">
        Coming soon
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex min-h-9 items-center justify-center rounded-md border border-warning/35 bg-warning/10 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-warning">
        Payment pending
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex min-h-9 items-center justify-center rounded-md border border-error/35 bg-error/10 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-error">
        Payment failed
      </span>
    );
  }
  return (
    <span className="inline-flex min-h-9 items-center justify-center rounded-md border border-cyan-border bg-main/50 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
      Locked
    </span>
  );
}
