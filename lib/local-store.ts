import { promises as fs } from "node:fs";
import path from "node:path";
import type { PurchaseAccessType } from "@/types/pricing";
import type { Purchase } from "@/types/purchase";

const dataDir = path.join(process.cwd(), ".local-store");
const purchasesFile = path.join(dataDir, "purchases.json");

type LocalPurchaseInput = {
  userId: string;
  productSlug: string;
  orderId: string;
  amount: number;
  currency: string;
  status?: Purchase["status"];
  paymentId?: string | null;
  accessType?: PurchaseAccessType;
  accessStartsAt?: string | null;
  accessExpiresAt?: string | null;
};

async function readPurchases(): Promise<Purchase[]> {
  try {
    const contents = await fs.readFile(purchasesFile, "utf8");
    const purchases = JSON.parse(contents) as Purchase[];
    return purchases.map((purchase) => ({
      ...purchase,
      access_type: purchase.access_type ?? "lifetime",
      access_starts_at: purchase.access_starts_at ?? purchase.paid_at ?? null,
      access_expires_at: purchase.access_expires_at ?? null,
    }));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

async function writePurchases(purchases: Purchase[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(purchasesFile, JSON.stringify(purchases, null, 2));
}

export async function createLocalPurchase(input: LocalPurchaseInput) {
  const purchases = await readPurchases();
  const now = new Date().toISOString();
  const purchase: Purchase = {
    id: `local_${crypto.randomUUID()}`,
    user_id: input.userId,
    product_id: input.productSlug,
    razorpay_order_id: input.orderId,
    razorpay_payment_id: input.paymentId ?? null,
    status: input.status ?? "pending",
    access_type: input.accessType ?? "lifetime",
    access_starts_at: input.accessStartsAt ?? null,
    access_expires_at: input.accessExpiresAt ?? null,
    amount: input.amount,
    currency: input.currency,
    created_at: now,
    paid_at: input.status === "paid" ? now : null,
  };
  purchases.unshift(purchase);
  await writePurchases(purchases);
  return purchase;
}

export async function getLocalPurchasesForUser(userId: string) {
  const purchases = await readPurchases();
  return purchases.filter((purchase) => purchase.user_id === userId);
}

export async function getLocalPurchasesByOrderId(userId: string, orderId: string) {
  const purchases = await getLocalPurchasesForUser(userId);
  return purchases.filter((purchase) => purchase.razorpay_order_id === orderId);
}

export async function updateLocalPurchasesStatus(input: {
  orderId: string;
  status: Purchase["status"];
  paymentId?: string | null;
  userId?: string;
  accessWindows?: Record<string, { startsAt: string; expiresAt: string | null }>;
}) {
  const purchases = await readPurchases();
  const matchingPurchases = purchases.filter(
    (item) =>
      item.razorpay_order_id === input.orderId &&
      (!input.userId || item.user_id === input.userId),
  );
  const paidAt = new Date().toISOString();

  for (const purchase of matchingPurchases) {
    purchase.status = input.status;
    if (input.paymentId !== undefined) purchase.razorpay_payment_id = input.paymentId;
    if (input.status === "paid") {
      purchase.paid_at = purchase.paid_at ?? paidAt;
      const accessWindow = input.accessWindows?.[purchase.id];
      if (accessWindow) {
        purchase.access_starts_at = accessWindow.startsAt;
        purchase.access_expires_at = accessWindow.expiresAt;
      }
    }
  }

  await writePurchases(purchases);
  return matchingPurchases;
}
