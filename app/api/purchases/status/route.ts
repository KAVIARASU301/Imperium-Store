import { getCurrentUserFromRequest } from "@/lib/auth";
import { getPurchasesByOrderId, updatePurchasesStatus } from "@/lib/purchases";
import { getLatestPaymentForOrder } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    const orderId = new URL(request.url).searchParams.get("order_id");
    if (!orderId) return NextResponse.json({ message: "order_id is required" }, { status: 400 });
    const purchases = await getPurchasesByOrderId(user.id, orderId);
    if (purchases.length === 0) return NextResponse.json({ message: "Purchase not found" }, { status: 404 });
    const productIds = purchases.map((purchase) => purchase.product_id);
    const status = purchases.every((purchase) => purchase.status === "paid")
      ? "paid"
      : purchases.some((purchase) => purchase.status === "failed")
        ? "failed"
        : "pending";
    if (status === "pending") {
      const payment = await getLatestPaymentForOrder(orderId);
      if (payment?.status === "captured") {
        const expectedAmount = Math.round(
          purchases.reduce((sum, purchase) => sum + purchase.amount, 0) * 100,
        );
        if (
          Number(payment.amount) !== expectedAmount ||
          payment.currency !== purchases[0]?.currency
        ) {
          return NextResponse.json(
            { message: "Payment amount does not match the order" },
            { status: 409 },
          );
        }
        const updatedPurchases = await updatePurchasesStatus({ orderId, status: "paid", paymentId: payment.id, userId: user.id });
        return NextResponse.json({ status: updatedPurchases[0]?.status ?? "paid", productId: productIds[0], productIds });
      }
      if (payment?.status === "failed") {
        const updatedPurchases = await updatePurchasesStatus({ orderId, status: "failed", paymentId: payment.id, userId: user.id });
        return NextResponse.json({ status: updatedPurchases[0]?.status ?? "failed", productId: productIds[0], productIds });
      }
    }
    return NextResponse.json({ status, productId: productIds[0], productIds });
  } catch (error) {
    console.error("Unable to load purchase status", error);
    return NextResponse.json({ message: "Unable to load purchase status" }, { status: 500 });
  }
}
