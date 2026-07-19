import { getCurrentUserFromRequest } from "@/lib/auth";
import {
  getProductBySlug,
  isCheckoutPlanAvailable,
  isProductReady,
  resolveCheckoutPrice,
} from "@/lib/products";
import {
  createPaidPurchase,
  createPendingPurchase,
  getProductAccessMap,
} from "@/lib/purchases";
import { getRazorpayClient } from "@/lib/razorpay";
import { canUseDevelopmentFallbacks } from "@/lib/runtime";
import type { CheckoutPlanId } from "@/types/pricing";
import { NextResponse } from "next/server";

type RequestedItem = {
  productId: string;
  planId: CheckoutPlanId;
};

function getPublicRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;
}

function getRazorpayErrorStatus(error: unknown) {
  if (typeof error !== "object" || error === null) return 500;
  const statusCode =
    "statusCode" in error
      ? (error as { statusCode?: unknown }).statusCode
      : undefined;
  return statusCode === 401 ? 401 : 500;
}

function parseRequestedItems(body: {
  items?: unknown;
  productId?: unknown;
  productIds?: unknown;
}): RequestedItem[] {
  if (Array.isArray(body.items)) {
    return body.items
      .filter(
        (item): item is { productId: string; planId?: string } =>
          Boolean(item) &&
          typeof item === "object" &&
          "productId" in item &&
          typeof item.productId === "string",
      )
      .map((item) => ({
        productId: item.productId,
        planId: item.planId === "monthly" ? "monthly" : "lifetime",
      }));
  }

  const productIds = Array.isArray(body.productIds)
    ? body.productIds
    : typeof body.productId === "string"
      ? [body.productId]
      : [];
  return productIds
    .filter((item): item is string => typeof item === "string")
    .map((productId) => ({ productId, planId: "lifetime" }));
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      items?: unknown;
      productId?: unknown;
      productIds?: unknown;
    };
    const requestedItems = parseRequestedItems(body);
    if (requestedItems.length === 0) {
      return NextResponse.json(
        { message: "At least one product is required" },
        { status: 400 },
      );
    }
    if (
      new Set(requestedItems.map((item) => item.productId)).size !==
      requestedItems.length
    ) {
      return NextResponse.json(
        { message: "A product can appear only once in an order" },
        { status: 400 },
      );
    }

    const products = requestedItems.map((item) =>
      getProductBySlug(item.productId),
    );
    if (products.some((product) => !product)) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    const validProducts = products.filter(
      (product): product is NonNullable<typeof product> => Boolean(product),
    );
    const unavailableProducts = validProducts.filter(
      (product) => !isProductReady(product),
    );
    if (unavailableProducts.length > 0) {
      return NextResponse.json(
        {
          message:
            "One or more products are coming soon and cannot be checked out yet",
          unavailableProductIds: unavailableProducts.map(
            (product) => product.slug,
          ),
        },
        { status: 409 },
      );
    }

    const accessByProduct = await getProductAccessMap(
      user.id,
      requestedItems.map((item) => item.productId),
    );
    const ownedProductIds = requestedItems
      .filter((item) => !accessByProduct[item.productId].can_buy_lifetime)
      .map((item) => item.productId);
    if (ownedProductIds.length > 0) {
      return NextResponse.json(
        {
          message:
            "One or more products already have lifetime access on this account",
          purchasedProductIds: ownedProductIds,
        },
        { status: 409 },
      );
    }

    const checkoutItems = requestedItems.map((item, index) => {
      const product = validProducts[index];
      const planId = item.planId;
      if (!isCheckoutPlanAvailable(product, planId)) {
        throw new Error(`The ${planId} plan is not available for ${product.name}`);
      }
      const pricing = resolveCheckoutPrice(
        product,
        planId,
        accessByProduct[product.slug].intro_eligible,
      );
      return {
        product,
        productId: product.slug,
        planId,
        amount: pricing.amount,
        accessType: pricing.accessType,
      };
    });

    const currency = validProducts[0].currency;
    if (validProducts.some((product) => product.currency !== currency)) {
      return NextResponse.json(
        { message: "Cart contains mixed currencies" },
        { status: 400 },
      );
    }

    const total = checkoutItems.reduce((sum, item) => sum + item.amount, 0);
    const responseItems = checkoutItems.map((item) => ({
      productId: item.productId,
      planId: item.planId,
      accessType: item.accessType,
      amount: item.amount,
    }));

    if (total === 0) {
      const orderId = `free_${Date.now()}`;
      await Promise.all(
        checkoutItems.map((item) =>
          createPaidPurchase({
            userId: user.id,
            productSlug: item.productId,
            orderId,
            amount: 0,
            currency: item.product.currency,
            accessType: item.accessType,
          }),
        ),
      );
      return NextResponse.json({
        orderId: null,
        order_id: null,
        amount: 0,
        currency,
        keyId: getPublicRazorpayKeyId(),
        items: responseItems,
        productIds: responseItems.map((item) => item.productId),
        productId: responseItems[0].productId,
      });
    }

    const amount = Math.round(total * 100);
    if (amount < 100) {
      return NextResponse.json(
        { message: "Order amount must be at least 100 paise" },
        { status: 400 },
      );
    }

    if (
      canUseDevelopmentFallbacks() &&
      process.env.TEST_CHECKOUT_ENABLED === "true"
    ) {
      const orderId = `test_order_${Date.now()}`;
      const paymentId = `test_pay_${Date.now()}`;
      await Promise.all(
        checkoutItems.map((item) =>
          createPaidPurchase({
            userId: user.id,
            productSlug: item.productId,
            orderId,
            amount: item.amount,
            currency: item.product.currency,
            accessType: item.accessType,
            paymentId,
          }),
        ),
      );
      return NextResponse.json({
        orderId: null,
        amount,
        currency,
        items: responseItems,
        productIds: responseItems.map((item) => item.productId),
        productId: responseItems[0].productId,
        message: "Test checkout completed",
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { message: "Checkout is not configured." },
        { status: 503 },
      );
    }

    const order = await getRazorpayClient().orders.create({
      amount,
      currency,
      receipt: `cart-${Date.now()}`.slice(0, 40),
      notes: {
        productIds: responseItems.map((item) => item.productId).join(","),
        accessTypes: responseItems.map((item) => item.accessType).join(","),
        userId: user.id,
      },
    });
    await Promise.all(
      checkoutItems.map((item) =>
        createPendingPurchase({
          userId: user.id,
          productSlug: item.productId,
          razorpayOrderId: order.id,
          amount: item.amount,
          currency: item.product.currency,
          accessType: item.accessType,
        }),
      ),
    );
    return NextResponse.json({
      orderId: order.id,
      order_id: order.id,
      amount,
      currency,
      keyId: getPublicRazorpayKeyId(),
      items: responseItems,
      productIds: responseItems.map((item) => item.productId),
      productId: responseItems[0].productId,
    });
  } catch (error) {
    console.error("Unable to create Razorpay order", error);
    const message =
      error instanceof Error &&
      (error.message.includes("plan is not available") ||
        error.message.includes("Monthly access"))
        ? error.message
        : "Unable to create order";
    return NextResponse.json(
      { message },
      { status: message === "Unable to create order" ? getRazorpayErrorStatus(error) : 400 },
    );
  }
}
