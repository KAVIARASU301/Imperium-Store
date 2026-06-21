import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// TODO: add verifyWebhookSignature(rawBody, signature) using
// process.env.RAZORPAY_WEBHOOK_SECRET (used in the webhook route)
