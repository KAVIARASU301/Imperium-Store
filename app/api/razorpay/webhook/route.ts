import { verifyWebhookSignature } from "@/lib/razorpay";
import { updatePurchaseStatus } from "@/lib/purchases";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!verifyWebhookSignature(rawBody, request.headers.get("x-razorpay-signature"))) return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    const event = JSON.parse(rawBody) as { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    if (!orderId) return NextResponse.json({ ok: true });
    if (event.event === "payment.captured") {
      await updatePurchaseStatus({ orderId, status: "paid", paymentId: payment.id });
    }
    if (event.event === "payment.failed") {
      await updatePurchaseStatus({ orderId, status: "failed", paymentId: payment.id });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to process Razorpay webhook", error);
    return NextResponse.json({ message: "Unable to process webhook" }, { status: 400 });
  }
}
