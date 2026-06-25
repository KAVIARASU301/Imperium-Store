import { getProductBySlug } from "@/lib/products";
import { createLocalPurchase, getLocalPurchaseByOrderId, getLocalPurchasesForUser, hasLocalPaidAccess, updateLocalPurchaseStatus } from "@/lib/local-store";
import { getSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase";

export async function createPendingPurchase(input: { userId: string; productSlug: string; razorpayOrderId: string; amount: number; currency: string }) {
  if (!hasSupabaseEnv()) {
    return createLocalPurchase({ userId: input.userId, productSlug: input.productSlug, orderId: input.razorpayOrderId, amount: input.amount, currency: input.currency });
  }
  return getSupabaseServerClient(true).from("purchases").insert({ user_id: input.userId, product_id: input.productSlug, razorpay_order_id: input.razorpayOrderId, status: "pending", amount: input.amount, currency: input.currency });
}

export async function createPaidPurchase(input: { userId: string; productSlug: string; orderId: string; amount: number; currency: string; paymentId?: string }) {
  if (!hasSupabaseEnv()) {
    return createLocalPurchase({ ...input, status: "paid", paymentId: input.paymentId ?? `local_pay_${Date.now()}` });
  }
  return getSupabaseServerClient(true).from("purchases").insert({ user_id: input.userId, product_id: input.productSlug, razorpay_order_id: input.orderId, razorpay_payment_id: input.paymentId ?? null, status: "paid", amount: input.amount, currency: input.currency, paid_at: new Date().toISOString() });
}

export async function hasPaidAccess(userId: string, productSlug: string) {
  const product = getProductBySlug(productSlug);
  if (product?.price === 0) return true;
  if (!hasSupabaseEnv()) return hasLocalPaidAccess(userId, productSlug);
  const { data, error } = await getSupabaseServerClient(true).from("purchases").select("id").eq("user_id", userId).eq("product_id", productSlug).eq("status", "paid").limit(1);
  if (error) return false;
  return Boolean(data?.length);
}
export async function getPurchasesForUser(userId: string) {
  if (!hasSupabaseEnv()) return getLocalPurchasesForUser(userId);
  const { data, error } = await getSupabaseServerClient(true).from("purchases").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPurchaseByOrderId(userId: string, orderId: string) {
  if (!hasSupabaseEnv()) return getLocalPurchaseByOrderId(userId, orderId);
  const { data, error } = await getSupabaseServerClient(true)
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("razorpay_order_id", orderId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updatePurchaseStatus(input: {
  orderId: string;
  status: "paid" | "failed";
  paymentId?: string | null;
  userId?: string;
}) {
  if (!hasSupabaseEnv()) {
    return updateLocalPurchaseStatus(input);
  }

  let query = getSupabaseServerClient(true)
    .from("purchases")
    .update({
      status: input.status,
      razorpay_payment_id: input.paymentId ?? null,
      paid_at: input.status === "paid" ? new Date().toISOString() : null,
    })
    .eq("razorpay_order_id", input.orderId);

  if (input.userId) query = query.eq("user_id", input.userId);

  const { data, error } = await query.select("*").maybeSingle();
  if (error) throw error;
  return data;
}
