import { getCurrentUserFromRequest } from "@/lib/auth";
import { formatPrice, getProductBySlug } from "@/lib/products";
import { getPurchaseByOrderId } from "@/lib/purchases";
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
    const purchase = await getPurchaseByOrderId(user.id, orderId);
    if (!purchase) return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
    if (purchase.status !== "paid") return NextResponse.json({ message: "Receipt is available only after payment is confirmed" }, { status: 409 });

    const product = getProductBySlug(purchase.product_id);
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const paidAt = purchase.paid_at ?? purchase.created_at;
    return NextResponse.json({
      receipt: {
        receiptNumber: createReceiptNumber(purchase.razorpay_order_id, paidAt),
        issuedAt: formatReceiptDate(paidAt),
        seller: {
          name: process.env.STORE_LEGAL_NAME ?? defaultSeller.name,
          email: process.env.STORE_SUPPORT_EMAIL ?? defaultSeller.email,
          address: process.env.STORE_BUSINESS_ADDRESS ?? defaultSeller.address,
        },
        customer: {
          email: user.email,
        },
        item: {
          name: product.name,
          description: product.short_description,
        },
        payment: {
          orderId: purchase.razorpay_order_id,
          paymentId: purchase.razorpay_payment_id,
          paidAt: formatReceiptDate(paidAt),
          method: "Razorpay",
        },
        totals: {
          subtotal: purchase.amount,
          tax: 0,
          total: purchase.amount,
          currency: purchase.currency,
          formattedSubtotal: formatPrice(purchase.amount, purchase.currency),
          formattedTax: formatPrice(0, purchase.currency),
          formattedTotal: formatPrice(purchase.amount, purchase.currency),
        },
        note: "This is a payment receipt for a non-GST registered business. It is not a GST tax invoice.",
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load receipt" }, { status: 500 });
  }
}
