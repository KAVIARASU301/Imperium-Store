import { getCurrentUserFromRequest } from "@/lib/auth";
import { getPurchaseByOrderId, updatePurchaseStatus } from "@/lib/purchases";
import { getLatestPaymentForOrder } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    const orderId = new URL(request.url).searchParams.get("order_id");
    if (!orderId) return NextResponse.json({ message: "order_id is required" }, { status: 400 });
    const purchase = await getPurchaseByOrderId(user.id, orderId);
    if (!purchase) return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
    if (purchase.status === "pending") {
      const payment = await getLatestPaymentForOrder(orderId);
      if (payment?.status === "captured") {
        const updatedPurchase = await updatePurchaseStatus({ orderId, status: "paid", paymentId: payment.id, userId: user.id });
        return NextResponse.json({ status: updatedPurchase?.status ?? "paid", productId: purchase.product_id });
      }
      if (payment?.status === "failed") {
        const updatedPurchase = await updatePurchaseStatus({ orderId, status: "failed", paymentId: payment.id, userId: user.id });
        return NextResponse.json({ status: updatedPurchase?.status ?? "failed", productId: purchase.product_id });
      }
    }
    return NextResponse.json({ status: purchase.status, productId: purchase.product_id });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load purchase status" }, { status: 500 });
  }
}
