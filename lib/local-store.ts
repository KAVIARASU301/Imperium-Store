import { promises as fs } from "node:fs";
import path from "node:path";
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
};

async function readPurchases(): Promise<Purchase[]> {
  try {
    const contents = await fs.readFile(purchasesFile, "utf8");
    return JSON.parse(contents) as Purchase[];
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

export async function hasLocalPaidAccess(userId: string, productSlug: string) {
  const purchases = await getLocalPurchasesForUser(userId);
  return purchases.some((purchase) => purchase.product_id === productSlug && purchase.status === "paid");
}

export async function getLocalPurchaseByOrderId(userId: string, orderId: string) {
  const purchases = await getLocalPurchasesForUser(userId);
  return purchases.find((purchase) => purchase.razorpay_order_id === orderId) ?? null;
}
