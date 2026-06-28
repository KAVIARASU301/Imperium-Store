import { getCurrentUserFromRequest } from "@/lib/auth";
import { getProductBySlug, isProductReady } from "@/lib/products";
import { createPaidPurchase, createPendingPurchase, hasRecordedPaidPurchase } from "@/lib/purchases";
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
    const body = (await request.json()) as { productId?: unknown; productIds?: unknown };
    const requestedProductIds = Array.isArray(body.productIds)
      ? body.productIds
      : typeof body.productId === "string"
        ? [body.productId]
        : [];
    const productIds = Array.from(new Set(requestedProductIds.filter((item: unknown): item is string => typeof item === "string")));
    if (productIds.length === 0) return NextResponse.json({ message: "At least one product is required" }, { status: 400 });

    const products = productIds.map((productId) => getProductBySlug(productId));
    if (products.some((product) => !product)) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    const validProducts = products.filter((product): product is NonNullable<typeof product> => Boolean(product));
    const unavailableProducts = validProducts.filter((product) => !isProductReady(product));
    if (unavailableProducts.length > 0) {
      return NextResponse.json(
        {
          message: "One or more products are coming soon and cannot be checked out yet",
          unavailableProductIds: unavailableProducts.map((product) => product.slug),
        },
        { status: 409 },
      );
    }
    const purchasedProductIds = (
      await Promise.all(validProducts.map(async (product) => ((await hasRecordedPaidPurchase(user.id, product.slug)) ? product.slug : null)))
    ).filter((productId): productId is string => Boolean(productId));
    if (purchasedProductIds.length > 0) {
      return NextResponse.json(
        {
          message: "One or more products are already purchased",
          purchasedProductIds,
        },
        { status: 409 },
      );
    }
    const currency = validProducts[0].currency;
    if (validProducts.some((product) => product.currency !== currency)) return NextResponse.json({ message: "Cart contains mixed currencies" }, { status: 400 });

    const total = validProducts.reduce((sum, product) => sum + product.price, 0);
    if (total === 0) {
      const orderId = `free_${Date.now()}`;
      await Promise.all(validProducts.map((product) => createPaidPurchase({ userId: user.id, productSlug: product.slug, orderId, amount: 0, currency: product.currency })));
      return NextResponse.json({ orderId: null, order_id: null, amount: 0, currency, keyId: getPublicRazorpayKeyId(), productIds: validProducts.map((product) => product.slug), productId: validProducts[0].slug });
    }
    const amount = Math.round(total * 100);
    if (amount < 100) return NextResponse.json({ message: "Order amount must be at least 100 paise" }, { status: 400 });
    if (process.env.TEST_CHECKOUT_ENABLED === "true") {
      const orderId = `test_order_${Date.now()}`;
      const paymentId = `test_pay_${Date.now()}`;
      await Promise.all(validProducts.map((product) => createPaidPurchase({ userId: user.id, productSlug: product.slug, orderId, amount: product.price, currency: product.currency, paymentId })));
      return NextResponse.json({ orderId: null, amount, currency, productIds: validProducts.map((product) => product.slug), productId: validProducts[0].slug, message: "Test checkout completed" });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ message: "Razorpay checkout is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to continue." }, { status: 503 });
    }
    const order = await getRazorpayClient().orders.create({
      amount,
      currency,
      receipt: `cart-${Date.now()}`.slice(0, 40),
      notes: { productIds: validProducts.map((product) => product.slug).join(","), userId: user.id },
    });
    await Promise.all(validProducts.map((product) => createPendingPurchase({ userId: user.id, productSlug: product.slug, razorpayOrderId: order.id, amount: product.price, currency: product.currency })));
    return NextResponse.json({ orderId: order.id, order_id: order.id, amount, currency, keyId: getPublicRazorpayKeyId(), productIds: validProducts.map((product) => product.slug), productId: validProducts[0].slug });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create order" }, { status: getRazorpayErrorStatus(error) });
  }
}
