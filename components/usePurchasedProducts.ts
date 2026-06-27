"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Purchase } from "@/types/purchase";
import { useEffect, useMemo, useState } from "react";

type PurchaseResponse = {
  purchases?: Purchase[];
};

const PURCHASED_PRODUCTS_UPDATED_EVENT = "imperium-purchased-products-updated";
let cachedPurchasedSlugs: string[] | null = null;
let loadPromise: Promise<string[]> | null = null;

export function usePurchasedProducts() {
  const [purchasedSlugs, setPurchasedSlugs] = useState<string[]>(cachedPurchasedSlugs ?? []);
  const [loaded, setLoaded] = useState(cachedPurchasedSlugs !== null);

  useEffect(() => {
    let cancelled = false;

    if (!loadPromise) {
      loadPromise = loadPurchasedSlugs();
    }

    loadPromise.then((slugs) => {
      if (!cancelled) {
        setPurchasedSlugs(slugs);
        setLoaded(true);
      }
    });

    function syncPurchasedSlugs() {
      setPurchasedSlugs(cachedPurchasedSlugs ?? []);
      setLoaded(cachedPurchasedSlugs !== null);
    }

    window.addEventListener(PURCHASED_PRODUCTS_UPDATED_EVENT, syncPurchasedSlugs);

    return () => {
      cancelled = true;
      window.removeEventListener(PURCHASED_PRODUCTS_UPDATED_EVENT, syncPurchasedSlugs);
    };
  }, []);

  const purchasedSlugSet = useMemo(() => new Set(purchasedSlugs), [purchasedSlugs]);

  return { purchasedSlugs, purchasedSlugSet, loaded };
}

export function markProductsPurchased(productSlugs: string[]) {
  if (productSlugs.length === 0) return;
  cachedPurchasedSlugs = Array.from(new Set([...(cachedPurchasedSlugs ?? []), ...productSlugs]));
  window.dispatchEvent(new Event(PURCHASED_PRODUCTS_UPDATED_EVENT));
}

async function loadPurchasedSlugs() {
  if (cachedPurchasedSlugs !== null) return cachedPurchasedSlugs;

  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      cachedPurchasedSlugs = [];
      return cachedPurchasedSlugs;
    }

    const response = await fetch("/api/purchases/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      cachedPurchasedSlugs = [];
      return cachedPurchasedSlugs;
    }

    const payload = (await response.json()) as PurchaseResponse;
    const paidSlugs = Array.from(
      new Set((payload.purchases ?? []).filter((purchase) => purchase.status === "paid").map((purchase) => purchase.product_id)),
    );
    cachedPurchasedSlugs = paidSlugs;
    return cachedPurchasedSlugs;
  } catch {
    cachedPurchasedSlugs = [];
    return cachedPurchasedSlugs;
  }
}
