import { getCurrentUserFromRequest } from "@/lib/auth";
import { getPurchasesByOrderId, updatePurchasesStatus } from "@/lib/purchases";
import { getPaymentById, verifyCheckoutSignature } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      return NextResponse.json({ message: "Payment verification details are required" }, { status: 400 });
    }

    const purchases = await getPurchasesByOrderId(user.id, razorpay_order_id);
    if (purchases.length === 0) return NextResponse.json({ message: "Purchase not found" }, { status: 404 });

    const verified = verifyCheckoutSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    if (!verified) return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });

    const payment = await getPaymentById(razorpay_payment_id);
    const expectedAmount = Math.round(purchases.reduce((sum, purchase) => sum + purchase.amount, 0) * 100);
    const expectedCurrency = purchases[0]?.currency;
    if (
      !payment ||
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      Number(payment.amount) !== expectedAmount ||
      payment.currency !== expectedCurrency
    ) {
      return NextResponse.json({ message: "Payment could not be confirmed" }, { status: 400 });
    }

    const updatedPurchases = await updatePurchasesStatus({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "paid",
      userId: user.id,
    });

    return NextResponse.json({
      status: updatedPurchases[0]?.status ?? "paid",
      productId: purchases[0].product_id,
      productIds: purchases.map((purchase) => purchase.product_id),
    });
  } catch (error) {
    console.error("Unable to verify payment", error);
    return NextResponse.json({ message: "Unable to verify payment" }, { status: 500 });
  }
}
