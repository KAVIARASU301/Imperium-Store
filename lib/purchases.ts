import { getProductBySlug } from "@/lib/products";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function createPendingPurchase(input: { userId: string; productSlug: string; razorpayOrderId: string; amount: number; currency: string }) {
  return getSupabaseServerClient(true).from("purchases").insert({ user_id: input.userId, product_id: input.productSlug, razorpay_order_id: input.razorpayOrderId, status: "pending", amount: input.amount, currency: input.currency });
}
export async function hasPaidAccess(userId: string, productSlug: string) {
  const product = getProductBySlug(productSlug);
  if (product?.price === 0) return true;
  const { data, error } = await getSupabaseServerClient(true).from("purchases").select("id").eq("user_id", userId).eq("product_id", productSlug).eq("status", "paid").limit(1);
  if (error) return false;
  return Boolean(data?.length);
}
export async function getPurchasesForUser(userId: string) {
  const { data, error } = await getSupabaseServerClient(true).from("purchases").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
