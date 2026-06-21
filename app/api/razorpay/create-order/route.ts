import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // TODO:
  // 1. Read productId from the request body
  // 2. Look up the price server-side — never trust a client-sent price
  // 3. Create a Razorpay order via lib/razorpay.ts
  // 4. Insert a "pending" row into the purchases table
  // 5. Return { orderId, amount, keyId } to the client
  return NextResponse.json({ message: "not implemented" }, { status: 501 });
}
