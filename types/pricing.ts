export type CheckoutPlanId = "monthly" | "lifetime";

export type PurchaseAccessType = "intro_month" | "monthly" | "lifetime";

export interface ProductAccess {
  product_id: string;
  has_access: boolean;
  access_type: PurchaseAccessType | null;
  current_period_end: string | null;
  intro_eligible: boolean;
  can_buy_lifetime: boolean;
}
