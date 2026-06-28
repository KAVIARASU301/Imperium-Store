"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import DownloadButton from "@/components/DownloadButton";
import type { Product, ProductFile } from "@/types/product";
import type { Purchase } from "@/types/purchase";

type AccessState = "checking" | "signed-out" | "ready";

export default function DashboardProducts({ products }: { products: Product[] }) {
  const [state, setState] = useState<AccessState>("checking");
  const [purchasesBySlug, setPurchasesBySlug] = useState<Record<string, Purchase>>({});

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          if (active) setState("signed-out");
          return;
        }
        const res = await fetch("/api/purchases/me", { headers: { Authorization: `Bearer ${token}` } });
        const payload = await res.json();
        if (!active) return;
        if (res.ok) {
          const map: Record<string, Purchase> = {};
          for (const purchase of payload.purchases as Purchase[]) {
            const existing = map[purchase.product_id];
            if (shouldUsePurchaseForProduct(purchase, existing)) map[purchase.product_id] = purchase;
          }
          setPurchasesBySlug(map);
        }
        setState("ready");
      } catch {
        if (active) setState("ready");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (state === "checking") return <p className="mt-8 font-mono text-sm uppercase tracking-[0.12em] text-muted">Checking your access...</p>;

  if (state === "signed-out") {
    return (
      <div className="mt-8 border border-cyan-border bg-section p-6 shadow-xl shadow-black/20">
        <p className="text-white">Log in to see which products you have unlocked.</p>
        <Link href="/login?next=/dashboard" className="mt-4 inline-block btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/20 ">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-px border border-cyan-border bg-cyan-border">
      {products.map((product) => {
        const purchase = purchasesBySlug[product.slug];
        const hasAccess = product.price === 0 || purchase?.status === "paid";
        return (
          <article key={product.slug} className="bg-section p-5 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <Image src={product.icon.src} alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white">{product.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{product.short_description}</p>
                </div>
              </div>
              <StatusBadge hasAccess={hasAccess} status={purchase?.status} />
            </div>
            {hasAccess ? (
              <div className="mt-4 space-y-3">
                {purchase?.status === "paid" ? (
                  <Link
                    href={`/receipts/${encodeURIComponent(purchase.razorpay_order_id)}`}
                    className="inline-block border border-cyan-border bg-card px-4 py-2 text-sm font-semibold text-white hover:border-brand hover:bg-section"
                  >
                    View payment receipt
                  </Link>
                ) : null}
                {product.files?.map((file) => (
                  <div
                    key={file.id}
                    className="group flex flex-col gap-4 border border-cyan-border bg-main p-4 transition duration-150 hover:border-brand hover:bg-card sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-cyan-border bg-section p-2 transition duration-150 group-hover:border-brand">
                        <Image src={getPlatformIcon(file)} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-white">{getPlatformTitle(file)}</p>
                          <span className="border border-cyan-border bg-section px-2 py-1 font-mono text-[11px] font-semibold uppercase text-muted">
                            v{file.version}
                          </span>
                        </div>
                        <p className="mt-1 flex items-center gap-2 font-mono text-xs uppercase text-muted">
                          <Image src="/icons/file.svg" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                          <span>{file.file_name}</span>
                        </p>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{getPlatformNote(file)}</p>
                      </div>
                    </div>
                    <DownloadButton fileId={file.id} label={`Download ${getPlatformLabel(file)}`} />
                  </div>
                ))}
                {!product.files?.length ? <p className="text-sm text-muted">No downloadable files for this product yet.</p> : null}
              </div>
            ) : (
              <div className="mt-4">
                <Link href={`/products/${product.slug}`} className="inline-block border border-cyan-border bg-card px-4 py-2 text-sm font-semibold text-white hover:border-brand hover:bg-section">
                  {purchase?.status === "pending" ? "Complete payment" : "View product"}
                </Link>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
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

function StatusBadge({ hasAccess, status }: { hasAccess: boolean; status?: string }) {
  if (hasAccess) return <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">Unlocked</span>;
  if (status === "pending") return <span className="font-mono text-xs uppercase tracking-widest text-amber-300">Payment pending</span>;
  if (status === "failed") return <span className="font-mono text-xs uppercase tracking-widest text-red-400">Payment failed</span>;
  return <span className="font-mono text-xs uppercase tracking-widest text-muted">Locked</span>;
}
