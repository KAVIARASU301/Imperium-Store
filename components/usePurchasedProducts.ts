"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase";
import { summarizeProductAccess } from "@/lib/access";
import type { ProductAccess } from "@/types/pricing";
import type { Purchase } from "@/types/purchase";
import { useEffect, useMemo, useState } from "react";

type PurchaseResponse = {
  purchases?: Purchase[];
  access?: Record<string, ProductAccess>;
};

type PurchaseCache = {
  userId: string | null;
  slugs: string[];
  access: Record<string, ProductAccess>;
  loaded: boolean;
  refreshing: boolean;
  error: boolean;
};

const PURCHASED_PRODUCTS_UPDATED_EVENT = "imperium-purchased-products-updated";
const AUTH_CHANGE_EVENT = "imperium-auth-change";
const PURCHASE_LOAD_TIMEOUT_MS = 5000;

let cache: PurchaseCache = {
  userId: null,
  slugs: [],
  access: {},
  loaded: false,
  refreshing: false,
  error: false,
};
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
  const lifetimeSlugSet = useMemo(
    () =>
      new Set(
        Object.values(snapshot.access)
          .filter((access) => access.access_type === "lifetime")
          .map((access) => access.product_id),
      ),
    [snapshot.access],
  );

  return {
    purchasedSlugs: snapshot.slugs,
    purchasedSlugSet,
    lifetimeSlugSet,
    accessBySlug: snapshot.access,
    loaded: snapshot.loaded,
    refreshing: snapshot.refreshing,
    error: snapshot.error,
  };
}

export function markProductsPurchased(productSlugs: string[]) {
  if (productSlugs.length === 0) return;
  cache = {
    ...cache,
    slugs: Array.from(new Set([...cache.slugs, ...productSlugs])),
    loaded: true,
    refreshing: false,
    error: false,
  };
  notifyPurchasedProductsUpdated();
  void refreshPurchasedProducts({ force: true });
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
  cache = {
    userId: null,
    slugs: [],
    access: {},
    loaded: false,
    refreshing: false,
    error: false,
  };
  loadPromise = null;
  notifyPurchasedProductsUpdated();
  void refreshPurchasedProducts({ force: true });
}

async function loadPurchasedSlugs() {
  cache = { ...cache, refreshing: true, error: false };
  notifyPurchasedProductsUpdated();

  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const userId = data.session?.user?.id ?? null;

    if (!token) {
      cache = {
        userId: null,
        slugs: [],
        access: {},
        loaded: true,
        refreshing: false,
        error: false,
      };
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
      const purchases = payload.purchases ?? [];
      const productSlugs = Array.from(
        new Set(purchases.map((purchase) => purchase.product_id)),
      );
      const access =
        payload.access ??
        Object.fromEntries(
          productSlugs.map((productSlug) => [
            productSlug,
            summarizeProductAccess(purchases, productSlug),
          ]),
        );
      const activeSlugs = Object.values(access)
        .filter((productAccess) => productAccess.has_access)
        .map((productAccess) => productAccess.product_id);
      cache = {
        userId,
        slugs: activeSlugs,
        access,
        loaded: true,
        refreshing: false,
        error: false,
      };
      notifyPurchasedProductsUpdated();
      return cache.slugs;
    } finally {
      window.clearTimeout(timeout);
    }
  } catch {
    cache = { ...cache, loaded: true, refreshing: false, error: true };
    notifyPurchasedProductsUpdated();
    return cache.slugs;
  }
}

function notifyPurchasedProductsUpdated() {
  window.dispatchEvent(new Event(PURCHASED_PRODUCTS_UPDATED_EVENT));
}
