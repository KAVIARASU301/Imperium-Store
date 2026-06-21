"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import DownloadButton from "@/components/DownloadButton";
import type { Product } from "@/types/product";
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
            if (!existing || new Date(purchase.created_at) > new Date(existing.created_at)) map[purchase.product_id] = purchase;
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

  if (state === "checking") return <p className="mt-8 text-sm text-slate-500">Checking your access...</p>;

  if (state === "signed-out") {
    return (
      <div className="mt-8 border border-slate-800 bg-[#0B1020] p-6">
        <p className="text-slate-300">Log in to see which products you have unlocked.</p>
        <Link href="/login?next=/dashboard" className="mt-4 inline-block bg-cyan-300 px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-200">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      {products.map((product) => {
        const purchase = purchasesBySlug[product.slug];
        const hasAccess = product.price === 0 || purchase?.status === "paid";
        return (
          <article key={product.slug} className="border border-slate-800 bg-[#0B1020] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{product.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{product.short_description}</p>
              </div>
              <StatusBadge hasAccess={hasAccess} status={purchase?.status} />
            </div>
            {hasAccess ? (
              <div className="mt-4 space-y-3">
                {product.files?.map((file) => (
                  <div key={file.id} className="flex flex-col gap-3 border border-slate-800 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-white">{file.file_name}</p>
                      <p className="font-mono text-xs uppercase text-slate-500">Version {file.version} / {file.platform}</p>
                    </div>
                    <DownloadButton fileId={file.id} />
                  </div>
                ))}
                {!product.files?.length ? <p className="text-sm text-slate-500">No downloadable files for this product yet.</p> : null}
              </div>
            ) : (
              <div className="mt-4">
                <Link href={`/products/${product.slug}`} className="inline-block border border-slate-700 px-4 py-2 text-sm font-semibold text-cyan-300 hover:border-cyan-300">
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

function StatusBadge({ hasAccess, status }: { hasAccess: boolean; status?: string }) {
  if (hasAccess) return <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">Unlocked</span>;
  if (status === "pending") return <span className="font-mono text-xs uppercase tracking-widest text-amber-300">Payment pending</span>;
  if (status === "failed") return <span className="font-mono text-xs uppercase tracking-widest text-red-400">Payment failed</span>;
  return <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Locked</span>;
}
