import "server-only";

import { summarizeProductAccess } from "@/lib/access";
import {
  createLocalPurchase,
  getLocalPurchasesByOrderId,
  getLocalPurchasesForUser,
  updateLocalPurchasesStatus,
} from "@/lib/local-store";
import { getProductBySlug } from "@/lib/products";
import { canUseDevelopmentFallbacks } from "@/lib/runtime";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";
import type { ProductAccess, PurchaseAccessType } from "@/types/pricing";
import type { Purchase } from "@/types/purchase";

function canUseLocalPurchases() {
  return canUseDevelopmentFallbacks() && !hasSupabaseEnv();
}

function normalizePurchase(purchase: Purchase): Purchase {
  return {
    ...purchase,
    access_type: purchase.access_type ?? "lifetime",
    access_starts_at: purchase.access_starts_at ?? purchase.paid_at ?? null,
    access_expires_at: purchase.access_expires_at ?? null,
  };
}

export async function createPendingPurchase(input: {
  userId: string;
  productSlug: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  accessType: PurchaseAccessType;
}) {
  if (canUseLocalPurchases()) {
    return createLocalPurchase({
      userId: input.userId,
      productSlug: input.productSlug,
      orderId: input.razorpayOrderId,
      amount: input.amount,
      currency: input.currency,
      accessType: input.accessType,
    });
  }

  const { data, error } = await getSupabaseServerClient(true)
    .from("purchases")
    .insert({
      user_id: input.userId,
      product_id: input.productSlug,
      razorpay_order_id: input.razorpayOrderId,
      status: "pending",
      access_type: input.accessType,
      access_starts_at: null,
      access_expires_at: null,
      amount: input.amount,
      currency: input.currency,
    })
    .select("*")
    .single();
  if (error) throw error;
  return normalizePurchase(data as Purchase);
}

export async function createPaidPurchase(input: {
  userId: string;
  productSlug: string;
  orderId: string;
  amount: number;
  currency: string;
  accessType: PurchaseAccessType;
  paymentId?: string;
}) {
  const now = new Date();
  const existingPurchases = await getPurchasesForUser(input.userId);
  const accessWindow = getNextAccessWindow(
    existingPurchases,
    input.productSlug,
    input.accessType,
    now,
  );

  if (canUseLocalPurchases()) {
    return createLocalPurchase({
      ...input,
      status: "paid",
      paymentId: input.paymentId ?? `local_pay_${Date.now()}`,
      accessType: input.accessType,
      accessStartsAt: accessWindow.startsAt,
      accessExpiresAt: accessWindow.expiresAt,
    });
  }

  const { data, error } = await getSupabaseServerClient(true)
    .from("purchases")
    .insert({
      user_id: input.userId,
      product_id: input.productSlug,
      razorpay_order_id: input.orderId,
      razorpay_payment_id: input.paymentId ?? null,
      status: "paid",
      access_type: input.accessType,
      access_starts_at: accessWindow.startsAt,
      access_expires_at: accessWindow.expiresAt,
      amount: input.amount,
      currency: input.currency,
      paid_at: now.toISOString(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return normalizePurchase(data as Purchase);
}

export async function hasPaidAccess(userId: string, productSlug: string) {
  const product = getProductBySlug(productSlug);
  if (product?.price === 0) return true;
  return (await getProductAccess(userId, productSlug)).has_access;
}

export async function getProductAccess(
  userId: string,
  productSlug: string,
): Promise<ProductAccess> {
  const purchases = await getPurchasesForUser(userId);
  return summarizeProductAccess(purchases, productSlug);
}

export async function getProductAccessMap(
  userId: string,
  productSlugs: string[],
) {
  const purchases = await getPurchasesForUser(userId);
  return Object.fromEntries(
    productSlugs.map((productSlug) => [
      productSlug,
      summarizeProductAccess(purchases, productSlug),
    ]),
  ) as Record<string, ProductAccess>;
}

export async function getPurchasesForUser(userId: string): Promise<Purchase[]> {
  if (canUseLocalPurchases()) return getLocalPurchasesForUser(userId);
  const { data, error } = await getSupabaseServerClient(true)
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as Purchase[]).map(normalizePurchase);
}

export async function getPurchasesByOrderId(
  userId: string,
  orderId: string,
): Promise<Purchase[]> {
  if (canUseLocalPurchases()) {
    return getLocalPurchasesByOrderId(userId, orderId);
  }
  const { data, error } = await getSupabaseServerClient(true)
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("razorpay_order_id", orderId);
  if (error) throw error;
  return ((data ?? []) as Purchase[]).map(normalizePurchase);
}

export async function getPurchasesByOrderIdForWebhook(
  orderId: string,
): Promise<Purchase[]> {
  if (canUseLocalPurchases()) {
    return [];
  }
  const { data, error } = await getSupabaseServerClient(true)
    .from("purchases")
    .select("*")
    .eq("razorpay_order_id", orderId);
  if (error) throw error;
  return ((data ?? []) as Purchase[]).map(normalizePurchase);
}

export async function updatePurchasesStatus(input: {
  orderId: string;
  status: "paid" | "failed";
  paymentId?: string | null;
  userId?: string;
}): Promise<Purchase[]> {
  if (canUseLocalPurchases()) {
    const purchases = input.userId
      ? await getLocalPurchasesByOrderId(input.userId, input.orderId)
      : [];
    const accessWindows =
      input.status === "paid"
        ? buildLocalAccessWindows(purchases)
        : undefined;
    return updateLocalPurchasesStatus({
      ...input,
      accessWindows,
    });
  }

  const { data, error } = await getSupabaseServerClient(true).rpc(
    "activate_purchase_order",
    {
      p_order_id: input.orderId,
      p_status: input.status,
      p_payment_id: input.paymentId ?? null,
      p_user_id: input.userId ?? null,
    },
  );
  if (error) throw error;
  return ((data ?? []) as Purchase[]).map(normalizePurchase);
}

function buildLocalAccessWindows(purchases: Purchase[]) {
  const windows: Record<string, { startsAt: string; expiresAt: string | null }> =
    {};
  const now = new Date();
  for (const purchase of purchases) {
    const window = getNextAccessWindow(
      purchases,
      purchase.product_id,
      purchase.access_type,
      now,
    );
    windows[purchase.id] = window;
  }
  return windows;
}

function getNextAccessWindow(
  purchases: Purchase[],
  productSlug: string,
  accessType: PurchaseAccessType,
  now: Date,
) {
  const startsAt =
    accessType === "lifetime"
      ? now
      : purchases
          .filter(
            (purchase) =>
              purchase.product_id === productSlug &&
              purchase.status === "paid" &&
              purchase.access_type !== "lifetime" &&
              Boolean(purchase.access_expires_at),
          )
          .reduce((latest, purchase) => {
            const expiry = new Date(purchase.access_expires_at as string);
            return expiry > latest ? expiry : latest;
          }, now);

  if (accessType === "lifetime") {
    return { startsAt: startsAt.toISOString(), expiresAt: null };
  }

  const product = getProductBySlug(productSlug);
  const durationMonths = product?.monthly_pricing?.duration_months ?? 1;
  return {
    startsAt: startsAt.toISOString(),
    expiresAt: addCalendarMonths(startsAt, durationMonths).toISOString(),
  };
}

function addCalendarMonths(value: Date, months: number) {
  const result = new Date(value);
  const originalDate = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDayOfTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(originalDate, lastDayOfTargetMonth));
  return result;
}
