import crypto from "node:crypto";
import Razorpay from "razorpay";
import type { Payments } from "razorpay/dist/types/payments";

export function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new Error("Missing Razorpay credentials");
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

function isSafeSignatureMatch(expected: string, received: string | null) {
  if (!received) return false;
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return isSafeSignatureMatch(expected, signature);
}

export function verifyCheckoutSignature(input: { orderId: string; paymentId: string; signature: string }) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  return isSafeSignatureMatch(expected, input.signature);
}

export async function getLatestPaymentForOrder(orderId: string) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  const payments = await getRazorpayClient().orders.fetchPayments(orderId);
  return payments.items
    .filter((payment) => payment.order_id === orderId)
    .sort((a, b) => Number(b.created_at ?? 0) - Number(a.created_at ?? 0))[0] as Payments.RazorpayPayment | undefined ?? null;
}
