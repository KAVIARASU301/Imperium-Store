import type { CheckoutPlanId } from "@/types/pricing";

export const CART_STORAGE_KEY = "imperium_cart_v1";
export const CART_PLAN_STORAGE_KEY = "imperium_cart_plans_v1";
export const CART_UPDATED_EVENT = "imperium-cart-updated";

export function readCart(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeCart(slugs: string[]) {
  if (typeof window === "undefined") return;
  const uniqueSlugs = Array.from(new Set(slugs));
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(uniqueSlugs));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function readCartPlans(): Record<string, CheckoutPlanId> {
  if (typeof window === "undefined") return {};
  try {
    const value = window.localStorage.getItem(CART_PLAN_STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, CheckoutPlanId] =>
          entry[1] === "monthly" || entry[1] === "lifetime",
      ),
    );
  } catch {
    return {};
  }
}

export function setCartPlan(slug: string, planId: CheckoutPlanId) {
  if (typeof window === "undefined") return;
  const plans = { ...readCartPlans(), [slug]: planId };
  window.localStorage.setItem(CART_PLAN_STORAGE_KEY, JSON.stringify(plans));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addToCart(slug: string, planId?: CheckoutPlanId) {
  if (planId && typeof window !== "undefined") {
    const plans = { ...readCartPlans(), [slug]: planId };
    window.localStorage.setItem(CART_PLAN_STORAGE_KEY, JSON.stringify(plans));
  }
  writeCart([...readCart(), slug]);
}

export function removeFromCart(slug: string) {
  if (typeof window !== "undefined") {
    const plans = readCartPlans();
    delete plans[slug];
    window.localStorage.setItem(CART_PLAN_STORAGE_KEY, JSON.stringify(plans));
  }
  writeCart(readCart().filter((item) => item !== slug));
}

export function clearCart() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CART_PLAN_STORAGE_KEY);
  }
  writeCart([]);
}

export function clearCartItems(slugs: string[]) {
  const purchased = new Set(slugs);
  if (typeof window !== "undefined") {
    const plans = readCartPlans();
    for (const slug of slugs) delete plans[slug];
    window.localStorage.setItem(CART_PLAN_STORAGE_KEY, JSON.stringify(plans));
  }
  writeCart(readCart().filter((item) => !purchased.has(item)));
}
