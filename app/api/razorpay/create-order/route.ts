import { getCurrentUserFromRequest } from "@/lib/auth";
import { getProductBySlug } from "@/lib/products";
import { createPaidPurchase, createPendingPurchase } from "@/lib/purchases";
import { getRazorpayClient } from "@/lib/razorpay";
import { NextResponse } from "next/server";

function getPublicRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;
}

function getRazorpayErrorStatus(error: unknown) {
  if (typeof error !== "object" || error === null) return 500;
  const statusCode = "statusCode" in error ? (error as { statusCode?: unknown }).statusCode : undefined;
  return statusCode === 401 ? 401 : 500;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    const { productId } = await request.json();
    const product = typeof productId === "string" ? getProductBySlug(productId) : null;
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    if (product.price === 0) {
      await createPaidPurchase({ userId: user.id, productSlug: product.slug, orderId: `free_${Date.now()}`, amount: 0, currency: product.currency });
      return NextResponse.json({ orderId: null, order_id: null, amount: 0, currency: product.currency, keyId: getPublicRazorpayKeyId(), productId: product.slug });
    }
    const amount = Math.round(product.price * 100);
    if (amount < 100) return NextResponse.json({ message: "Order amount must be at least 100 paise" }, { status: 400 });
    if (process.env.TEST_CHECKOUT_ENABLED === "true") {
      const orderId = `test_order_${Date.now()}`;
      await createPaidPurchase({ userId: user.id, productSlug: product.slug, orderId, amount: product.price, currency: product.currency, paymentId: `test_pay_${Date.now()}` });
      return NextResponse.json({ orderId: null, amount, currency: product.currency, productId: product.slug, message: "Test checkout completed" });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ message: "Razorpay checkout is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to continue." }, { status: 503 });
    }
    const order = await getRazorpayClient().orders.create({ amount, currency: product.currency, receipt: `${product.slug}-${Date.now()}`.slice(0, 40), notes: { productId: product.slug, userId: user.id } });
    await createPendingPurchase({ userId: user.id, productSlug: product.slug, razorpayOrderId: order.id, amount: product.price, currency: product.currency });
    return NextResponse.json({ orderId: order.id, order_id: order.id, amount, currency: product.currency, keyId: getPublicRazorpayKeyId(), productId: product.slug });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create order" }, { status: getRazorpayErrorStatus(error) });
  }
}
