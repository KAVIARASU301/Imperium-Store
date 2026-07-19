import { verifyWebhookSignature } from "@/lib/razorpay";
import {
  getPurchasesByOrderIdForWebhook,
  updatePurchasesStatus,
} from "@/lib/purchases";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!verifyWebhookSignature(rawBody, request.headers.get("x-razorpay-signature"))) return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    const event = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            order_id?: string;
            id?: string;
            amount?: number | string;
            currency?: string;
          };
        };
      };
    };
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    if (!orderId) return NextResponse.json({ ok: true });

    const purchases = await getPurchasesByOrderIdForWebhook(orderId);
    if (purchases.length === 0) return NextResponse.json({ ok: true });

    if (event.event === "payment.captured") {
      const expectedAmount = Math.round(
        purchases.reduce((sum, purchase) => sum + purchase.amount, 0) * 100,
      );
      const expectedCurrency = purchases[0].currency;
      if (
        Number(payment.amount) !== expectedAmount ||
        payment.currency !== expectedCurrency
      ) {
        return NextResponse.json(
          { message: "Payment amount does not match the order" },
          { status: 400 },
        );
      }
      await updatePurchasesStatus({
        orderId,
        status: "paid",
        paymentId: payment.id,
      });
    }
    if (event.event === "payment.failed") {
      await updatePurchasesStatus({
        orderId,
        status: "failed",
        paymentId: payment.id,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to process Razorpay webhook", error);
    return NextResponse.json({ message: "Unable to process webhook" }, { status: 400 });
  }
}
