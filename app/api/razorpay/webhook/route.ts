import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // TODO:
  // 1. Read the raw body + the x-razorpay-signature header
  // 2. Verify the signature with RAZORPAY_WEBHOOK_SECRET (lib/razorpay.ts)
  // 3. On payment.captured: set purchases.status = "paid", set paid_at
  // 4. On payment.failed: set purchases.status = "failed"
  //
  // Rule (Section 8): never unlock access from a frontend-only
  // payment success callback. The webhook is the trusted source.
  return NextResponse.json({ message: "not implemented" }, { status: 501 });
}
