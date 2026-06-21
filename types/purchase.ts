export type PurchaseStatus = "pending" | "paid" | "failed" | "refunded";

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  status: PurchaseStatus;
  amount: number;
  currency: string;
  created_at: string;
  paid_at: string | null;
}
