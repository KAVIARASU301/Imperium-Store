import type { ProductAccess, PurchaseAccessType } from "@/types/pricing";
import type { Purchase } from "@/types/purchase";

export function getPurchaseAccessType(
  purchase: Pick<Purchase, "access_type"> | Partial<Pick<Purchase, "access_type">>,
): PurchaseAccessType {
  if (
    purchase.access_type === "intro_month" ||
    purchase.access_type === "monthly" ||
    purchase.access_type === "lifetime"
  ) {
    return purchase.access_type;
  }
  // Rows created before access plans were introduced are lifetime purchases.
  return "lifetime";
}

export function isPurchaseActive(
  purchase: Purchase,
  now = new Date(),
) {
  if (purchase.status !== "paid") return false;
  if (getPurchaseAccessType(purchase) === "lifetime") return true;
  if (!purchase.access_expires_at) return false;
  return new Date(purchase.access_expires_at).getTime() > now.getTime();
}

export function summarizeProductAccess(
  purchases: Purchase[],
  productId: string,
  now = new Date(),
): ProductAccess {
  const productPurchases = purchases.filter(
    (purchase) => purchase.product_id === productId,
  );
  const paidPurchases = productPurchases.filter(
    (purchase) => purchase.status === "paid",
  );
  const lifetimePurchase = paidPurchases.find(
    (purchase) => getPurchaseAccessType(purchase) === "lifetime",
  );
  const activeMonthlyPurchases = paidPurchases
    .filter(
      (purchase) =>
        getPurchaseAccessType(purchase) !== "lifetime" &&
        isPurchaseActive(purchase, now),
    )
    .sort(
      (a, b) =>
        new Date(b.access_expires_at ?? 0).getTime() -
        new Date(a.access_expires_at ?? 0).getTime(),
    );
  const activeMonthlyPurchase = activeMonthlyPurchases[0];
  const hasClaimedIntro = productPurchases.some(
    (purchase) =>
      (purchase.status === "paid" || purchase.status === "refunded") &&
      getPurchaseAccessType(purchase) === "intro_month",
  );
  const hasAnyCompletedPurchase = productPurchases.some(
    (purchase) =>
      purchase.status === "paid" || purchase.status === "refunded",
  );

  return {
    product_id: productId,
    has_access: Boolean(lifetimePurchase || activeMonthlyPurchase),
    access_type: lifetimePurchase
      ? "lifetime"
      : activeMonthlyPurchase
        ? getPurchaseAccessType(activeMonthlyPurchase)
        : null,
    current_period_end: lifetimePurchase
      ? null
      : activeMonthlyPurchase?.access_expires_at ?? null,
    intro_eligible: !hasClaimedIntro && !hasAnyCompletedPurchase,
    can_buy_lifetime: !lifetimePurchase,
  };
}
