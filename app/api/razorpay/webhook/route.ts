import { verifyWebhookSignature } from "@/lib/razorpay";
import { updatePurchaseStatus } from "@/lib/purchases";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyWebhookSignature(rawBody, request.headers.get("x-razorpay-signature"))) return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  const event = JSON.parse(rawBody);
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
}
