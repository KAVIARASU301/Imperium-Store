"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Purchase } from "@/types/purchase";
import { useEffect, useMemo, useState } from "react";

type PurchaseResponse = {
  purchases?: Purchase[];
};

type PurchaseCache = {
  userId: string | null;
  slugs: string[];
  loaded: boolean;
  refreshing: boolean;
};

const PURCHASED_PRODUCTS_UPDATED_EVENT = "imperium-purchased-products-updated";
const AUTH_CHANGE_EVENT = "imperium-auth-change";
const PURCHASE_LOAD_TIMEOUT_MS = 8000;

let cache: PurchaseCache = { userId: null, slugs: [], loaded: false, refreshing: false };
let loadPromise: Promise<string[]> | null = null;
let isListeningForAuthChanges = false;

export function usePurchasedProducts() {
  const [snapshot, setSnapshot] = useState(cache);

  useEffect(() => {
    let cancelled = false;

    function syncSnapshot() {
      if (!cancelled) setSnapshot({ ...cache });
    }

    void refreshPurchasedProducts({ force: false });
    syncSnapshot();

    ensureAuthChangeListener();

    window.addEventListener(PURCHASED_PRODUCTS_UPDATED_EVENT, syncSnapshot);
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    return () => {
      cancelled = true;
      window.removeEventListener(PURCHASED_PRODUCTS_UPDATED_EVENT, syncSnapshot);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  const purchasedSlugSet = useMemo(() => new Set(snapshot.slugs), [snapshot.slugs]);

  return {
    purchasedSlugs: snapshot.slugs,
    purchasedSlugSet,
    loaded: snapshot.loaded,
    refreshing: snapshot.refreshing,
  };
}

export function markProductsPurchased(productSlugs: string[]) {
  if (productSlugs.length === 0) return;
  cache = {
    ...cache,
    slugs: Array.from(new Set([...cache.slugs, ...productSlugs])),
    loaded: true,
    refreshing: false,
  };
  notifyPurchasedProductsUpdated();
}

export async function refreshPurchasedProducts({ force = true }: { force?: boolean } = {}) {
  if (loadPromise && !force) return loadPromise;
  if (cache.loaded && !force) return cache.slugs;

  loadPromise = loadPurchasedSlugs();
  return loadPromise.finally(() => {
    loadPromise = null;
  });
}

function ensureAuthChangeListener() {
  if (isListeningForAuthChanges) return;
  isListeningForAuthChanges = true;
  const supabase = getSupabaseBrowserClient();
  supabase.auth.onAuthStateChange(() => {
    handleAuthChange();
  });
}

function handleAuthChange() {
  cache = { userId: null, slugs: [], loaded: false, refreshing: false };
  loadPromise = null;
  notifyPurchasedProductsUpdated();
  void refreshPurchasedProducts({ force: true });
}

async function loadPurchasedSlugs() {
  cache = { ...cache, refreshing: true };
  notifyPurchasedProductsUpdated();

  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const userId = data.session?.user?.id ?? null;

    if (!token) {
      cache = { userId: null, slugs: [], loaded: true, refreshing: false };
      notifyPurchasedProductsUpdated();
      return cache.slugs;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), PURCHASE_LOAD_TIMEOUT_MS);

    try {
      const response = await fetch("/api/purchases/me", {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Unable to load purchases");

      const payload = (await response.json()) as PurchaseResponse;
      const paidSlugs = Array.from(
        new Set((payload.purchases ?? []).filter((purchase) => purchase.status === "paid").map((purchase) => purchase.product_id)),
      );
      cache = { userId, slugs: paidSlugs, loaded: true, refreshing: false };
      notifyPurchasedProductsUpdated();
      return cache.slugs;
    } finally {
      window.clearTimeout(timeout);
    }
  } catch {
    cache = { ...cache, loaded: true, refreshing: false };
    notifyPurchasedProductsUpdated();
    return cache.slugs;
  }
}

function notifyPurchasedProductsUpdated() {
  window.dispatchEvent(new Event(PURCHASED_PRODUCTS_UPDATED_EVENT));
}
