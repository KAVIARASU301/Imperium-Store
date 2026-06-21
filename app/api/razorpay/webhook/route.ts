import { verifyWebhookSignature } from "@/lib/razorpay";
import { getSupabaseServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyWebhookSignature(rawBody, request.headers.get("x-razorpay-signature"))) return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  const event = JSON.parse(rawBody);
  const payment = event.payload?.payment?.entity;
  const orderId = payment?.order_id;
  if (!orderId) return NextResponse.json({ ok: true });
  if (event.event === "payment.captured") {
    await getSupabaseServerClient(true).from("purchases").update({ status: "paid", razorpay_payment_id: payment.id, paid_at: new Date().toISOString() }).eq("razorpay_order_id", orderId);
  }
  if (event.event === "payment.failed") {
    await getSupabaseServerClient(true).from("purchases").update({ status: "failed", razorpay_payment_id: payment.id }).eq("razorpay_order_id", orderId);
  }
  return NextResponse.json({ ok: true });
}
