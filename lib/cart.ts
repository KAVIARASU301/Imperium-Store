export const CART_STORAGE_KEY = "imperium_cart_v1";
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

export function addToCart(slug: string) {
  writeCart([...readCart(), slug]);
}

export function removeFromCart(slug: string) {
  writeCart(readCart().filter((item) => item !== slug));
}

export function clearCart() {
  writeCart([]);
}

export function clearCartItems(slugs: string[]) {
  const purchased = new Set(slugs);
  writeCart(readCart().filter((item) => !purchased.has(item)));
}
