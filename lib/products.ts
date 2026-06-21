import type { Product } from "@/types/product";

// Hardcoded for MVP (Section 16). Move to a Supabase "products"
// table once the admin panel exists.
export const products: Product[] = [
  {
    slug: "imperium-option-buyer-checklist",
    name: "Imperium Option Buyer Checklist",
    type: "template",
    short_description: "A free checklist to build a repeatable pre-trade routine.",
    price: 0,
    currency: "INR",
    is_active: true,
  },
  {
    slug: "cvd-practice-chart",
    name: "CVD Practice Chart",
    type: "app",
    short_description:
      "Replay trading days, study price-volume behavior, and improve execution discipline.",
    price: 999,
    currency: "INR",
    is_active: true,
  },
  {
    slug: "banknifty-options-execution-system",
    name: "BankNifty Options Execution System",
    type: "course",
    short_description: "A structured framework for disciplined BankNifty options execution.",
    price: 2999,
    currency: "INR",
    is_active: true,
  },
];
