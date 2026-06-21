import { getCurrentUserFromRequest } from "@/lib/auth";
import { getProductBySlug } from "@/lib/products";
import { createPendingPurchase } from "@/lib/purchases";
import { getRazorpayClient } from "@/lib/razorpay";
import { hasSupabaseEnv } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!hasSupabaseEnv()) return NextResponse.json({ message: "Supabase is not configured" }, { status: 503 });
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    const { productId } = await request.json();
    const product = typeof productId === "string" ? getProductBySlug(productId) : null;
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    if (product.price === 0) return NextResponse.json({ orderId: null, amount: 0, keyId: process.env.RAZORPAY_KEY_ID, productId: product.slug });
    const amount = product.price * 100;
    const order = await getRazorpayClient().orders.create({ amount, currency: product.currency, receipt: `${product.slug}-${Date.now()}`.slice(0, 40), notes: { productId: product.slug, userId: user.id } });
    await createPendingPurchase({ userId: user.id, productSlug: product.slug, razorpayOrderId: order.id, amount: product.price, currency: product.currency });
    return NextResponse.json({ orderId: order.id, amount, currency: product.currency, keyId: process.env.RAZORPAY_KEY_ID, productId: product.slug });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create order" }, { status: 500 });
  }
}
