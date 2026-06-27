import { getCurrentUserFromRequest } from "@/lib/auth";
import { formatPrice, getProductBySlug } from "@/lib/products";
import { getPurchasesByOrderId } from "@/lib/purchases";
import { NextResponse } from "next/server";

const defaultSeller = {
  name: "Imperium Store",
  email: "support@imperiumstore.in",
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

    const items = purchases.map((purchase) => {
      const product = getProductBySlug(purchase.product_id);
      if (!product) return null;
      return {
        name: product.name,
        description: product.short_description,
        amount: purchase.amount,
        formattedAmount: formatPrice(purchase.amount, purchase.currency),
      };
    });
    if (items.some((item) => !item)) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const firstPurchase = purchases[0];
    const paidAt = firstPurchase.paid_at ?? firstPurchase.created_at;
    const subtotal = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const currency = firstPurchase.currency;
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
          formattedTax: formatPrice(0, currency),
          formattedTotal: formatPrice(subtotal, currency),
        },
        note: "This is a payment receipt for a non-GST registered business. It is not a GST tax invoice.",
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load receipt" }, { status: 500 });
  }
}
