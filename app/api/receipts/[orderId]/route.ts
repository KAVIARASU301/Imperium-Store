import { getCurrentUserFromRequest } from "@/lib/auth";
import { formatPrice, getProductBySlug, getProductsGstInclusiveText } from "@/lib/products";
import { getPurchasesByOrderId } from "@/lib/purchases";
import { SUPPORT_EMAIL } from "@/lib/support";
import { getPurchaseAccessType } from "@/lib/access";
import { NextResponse } from "next/server";

const defaultSeller = {
  name: "Imperium Store",
  email: SUPPORT_EMAIL,
  address: "India",
};

function formatReceiptDate(value: string | null) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value ?? Date.now()));
}

function createReceiptNumber(orderId: string, paidAt: string | null) {
  const date = new Date(paidAt ?? Date.now());
  const datePart = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("-", "");
  return `RCPT-${datePart}-${orderId.slice(-8).toUpperCase()}`;
}

export async function GET(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

    const { orderId } = await context.params;
    const purchases = await getPurchasesByOrderId(user.id, orderId);
    if (purchases.length === 0) return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
    if (!purchases.every((purchase) => purchase.status === "paid")) return NextResponse.json({ message: "Receipt is available only after payment is confirmed" }, { status: 409 });

    const resolvedPurchases = purchases.map((purchase) => {
      const product = getProductBySlug(purchase.product_id);
      if (!product) return null;
      return { product, purchase };
    });
    if (resolvedPurchases.some((item) => !item)) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const validPurchases = resolvedPurchases.filter((item): item is NonNullable<typeof item> => Boolean(item));
    const items = validPurchases.map(({ product, purchase }) => {
      const accessType = getPurchaseAccessType(purchase);
      const accessDescription =
        accessType === "lifetime"
          ? "Lifetime access"
          : `${accessType === "intro_month" ? "Introductory month" : "One-month access"}${
              purchase.access_starts_at && purchase.access_expires_at
                ? ` (${formatReceiptDate(purchase.access_starts_at)} to ${formatReceiptDate(purchase.access_expires_at)})`
                : ""
            }`;
      return {
        name: product.name,
        description: `${accessDescription}. ${product.short_description}`,
        amount: purchase.amount,
        formattedAmount: formatPrice(purchase.amount, purchase.currency),
      };
    });

    const firstPurchase = purchases[0];
    const paidAt = firstPurchase.paid_at ?? firstPurchase.created_at;
    const subtotal = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const currency = firstPurchase.currency;
    const gstInclusiveText = getProductsGstInclusiveText(validPurchases.map(({ product }) => product));
    return NextResponse.json({
      receipt: {
        receiptNumber: createReceiptNumber(firstPurchase.razorpay_order_id, paidAt),
        issuedAt: formatReceiptDate(paidAt),
        seller: {
          name: process.env.STORE_LEGAL_NAME ?? defaultSeller.name,
          email: process.env.STORE_SUPPORT_EMAIL ?? defaultSeller.email,
          address: process.env.STORE_BUSINESS_ADDRESS ?? defaultSeller.address,
        },
        customer: {
          email: user.email,
        },
        item: items[0],
        items,
        payment: {
          orderId: firstPurchase.razorpay_order_id,
          paymentId: firstPurchase.razorpay_payment_id,
          paidAt: formatReceiptDate(paidAt),
          method: "Razorpay",
        },
        totals: {
          subtotal,
          tax: 0,
          total: subtotal,
          currency,
          formattedSubtotal: formatPrice(subtotal, currency),
          formattedTax: gstInclusiveText,
          formattedTotal: formatPrice(subtotal, currency),
        },
        note: "This receipt records the amount paid. Prices are shown inclusive of applicable GST; issue or treat as a GST tax invoice only with valid seller GST registration details.",
      },
    });
  } catch (error) {
    console.error("Unable to load receipt", error);
    return NextResponse.json({ message: "Unable to load receipt" }, { status: 500 });
  }
}
