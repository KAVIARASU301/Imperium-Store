"use client";

import {
  CART_UPDATED_EVENT,
  clearCart,
  clearCartItems,
  readCart,
  readCartPlans,
  removeFromCart,
  setCartPlan,
} from "@/lib/cart";
import { createRazorpayCheckout } from "@/lib/razorpay-client";
import {
  formatCurrencySymbol,
  formatPriceAmount,
  getDefaultCheckoutPlan,
  getProductGstInclusiveText,
  getProductsGstInclusiveText,
  isProductReady,
  resolveCheckoutPrice,
} from "@/lib/products";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY_ISO,
  getCountryByIso,
  getCountryFlag,
  parsePhoneValue,
} from "@/lib/country-codes";
import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { markProductsPurchased, usePurchasedProducts } from "@/components/usePurchasedProducts";
import StatePanel from "@/components/StatePanel";
import type { CheckoutPlanId } from "@/types/pricing";

interface CreateOrderResponse {
  orderId: string | null;
  amount: number;
  currency: string;
  keyId?: string;
  productIds?: string[];
  purchasedProductIds?: string[];
  unavailableProductIds?: string[];
  message?: string;
  items?: Array<{
    productId: string;
    planId: CheckoutPlanId;
    amount: number;
  }>;
}

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

const PHONE_STORAGE_PREFIX = "imperium.checkout.phone:";

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function isValidMobile(dial: string, digits: string) {
  if (dial === "91") return /^[6-9]\d{9}$/.test(digits);
  return digits.length >= 6 && digits.length <= 14;
}

function getMetadataString(user: unknown, key: string): string {
  if (!user || typeof user !== "object" || !("user_metadata" in user)) return "";
  const metadata = (user as { user_metadata?: unknown }).user_metadata;
  if (!metadata || typeof metadata !== "object") return "";
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

const orderSteps = [
  { label: "Cart", text: "Review products and account email." },
  { label: "Payment", text: "Complete payment through the secure checkout." },
  { label: "Download", text: "Get files from your dashboard." },
];

export default function CartPageClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);
  const [cartPlans, setCartPlans] = useState<Record<string, CheckoutPlanId>>({});
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [savedPhone, setSavedPhone] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    purchasedSlugs,
    lifetimeSlugSet,
    accessBySlug,
    loaded: accessLoaded,
    error: accessError,
  } = usePurchasedProducts();

  useEffect(() => {
    function sync() {
      setCartSlugs(readCart());
      setCartPlans(readCartPlans());
    }

    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    async function loadSession() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user.email ?? null);
      if (data.session) {
        const id = data.session.user.id;
        const metadataPhone = getMetadataString(data.session.user, "contact_phone");
        const storedPhone = window.localStorage.getItem(PHONE_STORAGE_PREFIX + id) ?? "";
        const parsed = parsePhoneValue(storedPhone || metadataPhone);
        setUserId(id);
        setSavedPhone(metadataPhone);
        setCountryIso(parsed.iso);
        setPhone(parsed.number);
      }
      setAuthChecked(true);
    }

    loadSession();
  }, []);

  const cartProducts = useMemo(
    () => cartSlugs.map((slug) => products.find((product) => product.slug === slug)).filter((product): product is Product => Boolean(product)),
    [cartSlugs, products],
  );
  const payableProducts = useMemo(
    () =>
      cartProducts.filter(
        (product) =>
          isProductReady(product) && !lifetimeSlugSet.has(product.slug),
      ),
    [cartProducts, lifetimeSlugSet],
  );
  const unavailableCartProducts = useMemo(
    () =>
      cartProducts.filter(
        (product) =>
          !isProductReady(product) && !lifetimeSlugSet.has(product.slug),
      ),
    [cartProducts, lifetimeSlugSet],
  );
  const purchasedCartProducts = useMemo(
    () => cartProducts.filter((product) => lifetimeSlugSet.has(product.slug)),
    [cartProducts, lifetimeSlugSet],
  );
  const checkoutItems = useMemo(
    () =>
      payableProducts.map((product) => {
        const planId =
          cartPlans[product.slug] ?? getDefaultCheckoutPlan(product);
        const pricing = resolveCheckoutPrice(
          product,
          planId,
          accessBySlug[product.slug]?.intro_eligible !== false,
        );
        return { product, planId, ...pricing };
      }),
    [accessBySlug, cartPlans, payableProducts],
  );
  const total = checkoutItems.reduce((sum, item) => sum + item.amount, 0);
  const currency = payableProducts[0]?.currency ?? cartProducts[0]?.currency ?? "INR";
  const gstInclusiveText = getProductsGstInclusiveText(payableProducts);

  async function startPayment() {
    setError("");
    if (!accessLoaded || accessError) {
      setError(
        accessError
          ? "We could not verify your account price. Refresh the page before paying."
          : "We are still checking your introductory price. Try again in a moment.",
      );
      return;
    }
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        router.push(`/login?next=${encodeURIComponent("/cart")}`);
        return;
      }

      const productIds = checkoutItems.map((item) => item.product.slug);
      if (productIds.length === 0) {
        clearCartItems(purchasedSlugs);
        if (unavailableCartProducts.length > 0) {
          setError("No ready products are available for checkout yet.");
          setLoading(false);
          return;
        }
        router.push("/dashboard");
        return;
      }
      const dial = getCountryByIso(countryIso).dial;
      const cleanPhone = normalizeDigits(phone);
      if (!isValidMobile(dial, cleanPhone)) {
        setPhoneError(
          dial === "91"
            ? "Enter your 10-digit mobile number to continue to payment."
            : "Enter a valid mobile number to continue to payment.",
        );
        setLoading(false);
        return;
      }
      setPhoneError("");
      const fullPhone = `+${dial}${cleanPhone}`;
      window.localStorage.setItem(PHONE_STORAGE_PREFIX + (userId ?? sessionData.session?.user.id ?? ""), fullPhone);
      if (fullPhone !== savedPhone) {
        setSavedPhone(fullPhone);
        void supabase.auth.updateUser({ data: { contact_phone: fullPhone } });
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: checkoutItems.map((item) => ({
            productId: item.product.slug,
            planId: item.planId,
          })),
        }),
      });
      const order: CreateOrderResponse = await res.json();
      if (!res.ok) {
        if (order.purchasedProductIds?.length) {
          markProductsPurchased(order.purchasedProductIds);
          clearCartItems(order.purchasedProductIds);
        }
        throw new Error(order.message ?? "Unable to start checkout");
      }

      if (!order.orderId) {
        clearCartItems(productIds);
        markProductsPurchased(order.productIds ?? productIds);
        router.push("/dashboard");
        return;
      }
      if (!order.keyId) throw new Error("Checkout is not configured");

      let paymentFailed = false;

      const checkout = await createRazorpayCheckout({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Imperium Store",
        description:
          productIds.length === 1
            ? `${payableProducts[0]?.name} — ${checkoutItems[0]?.planId === "monthly" ? "one-month access" : "lifetime access"}`
            : `${productIds.length} Imperium products`,
        prefill: {
          email: sessionData.session?.user.email ?? undefined,
          contact: fullPhone,
          name: getMetadataString(sessionData.session?.user, "full_name") || getMetadataString(sessionData.session?.user, "name") || undefined,
        },
        theme: { color: "#2F6FA6" },
        handler: (response: RazorpaySuccessResponse) => {
          // Kick off server verification but do not gate on it: the success
          // page polls the status API, which reconciles with Razorpay on its
          // own. Blocking here risks stranding a charged user on the cart.
          void fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(response),
            keepalive: true,
          }).catch(() => {});
          router.push(`/checkout/success?order_id=${response.razorpay_order_id}`);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            // Failed attempts stay inside the modal so Razorpay can offer a
            // retry with another method; only a close-after-failure lands on
            // the failed page.
            if (paymentFailed) router.push(`/checkout/failed?order_id=${order.orderId}`);
          },
        },
      });

      checkout.on("payment.failed", () => {
        paymentFailed = true;
      });

      checkout.open();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
      setLoading(false);
    }
  }

  function retryAccessCheck() {
    if (accessError) {
      window.location.reload();
      return;
    }
    void startPayment();
  }

  return (
    <main className="page-container py-12">
      <section className="section-heading">
        <p className="section-kicker">Checkout</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-normal text-white sm:text-4xl">
          Complete your purchase
        </h1>
      </section>

      {cartProducts.length === 0 ? (
        <div className="mt-8 grid gap-5">
          <StatePanel
            eyebrow="Cart is empty"
            title="Add a product to start checkout."
            description="Browse the catalog, or open My Purchases if you already completed payment."
            icon="/icons/cart.svg"
            actions={
              <>
                <Link href="/products" className="inline-flex min-h-11 items-center justify-center btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  Browse products
                </Link>
                <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-md border border-cyan-border bg-card px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
                  My purchases
                </Link>
              </>
            }
          />
          <OrderSteps />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_390px]">
          <section className="surface-panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-border bg-card-hover px-5 py-4">
              <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand">Selected access</p>
                <p className="mt-1 text-sm text-muted">{payableProducts.length} item{payableProducts.length === 1 ? "" : "s"} ready for payment</p>
              </div>
              <button type="button" className="border border-cyan-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-brand" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
            {payableProducts.length === 0 ? (
              <div className="border-b border-cyan-border bg-section p-5">
                <StatePanel
                  compact
                  tone={unavailableCartProducts.length > 0 ? "warning" : "success"}
                  eyebrow="Nothing to pay"
                  title={unavailableCartProducts.length > 0 ? "No ready products are available for checkout." : "Everything in this cart is already in your account."}
                  description={
                    unavailableCartProducts.length > 0
                      ? "Coming-soon products stay visible for review, but they cannot be paid for until release."
                      : "Open your purchase library to download licensed builds and receipts, or clear the cart to start over."
                  }
                  actions={
                    <>
                      <Link href="/dashboard" className="inline-flex min-h-10 items-center justify-center btn-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                        My purchases
                      </Link>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-cyan-border bg-card px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:border-brand"
                      >
                        Clear cart
                      </button>
                    </>
                  }
                />
              </div>
            ) : null}
            {cartProducts.map((product) => {
              if (lifetimeSlugSet.has(product.slug)) return null;
              const ready = isProductReady(product);
              const checkoutItem = checkoutItems.find(
                (item) => item.product.slug === product.slug,
              );
              const selectedPlan =
                checkoutItem?.planId ?? getDefaultCheckoutPlan(product);
              const hasActiveMonthly =
                accessBySlug[product.slug]?.has_access &&
                accessBySlug[product.slug]?.access_type !== "lifetime";
              return (
                <article key={product.slug} className="grid gap-4 border-b border-cyan-border bg-section p-5 last:border-b-0 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-md border border-cyan-border bg-main p-2 shadow-inner shadow-black/30">
                    <Image src={product.icon.src} alt="" width={product.icon.width} height={product.icon.height} className="h-12 w-12 object-contain" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-white">{product.name}</h2>
                      {!ready ? (
                        <span className="border border-warning/40 bg-warning/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-warning">
                          Coming Soon
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {ready
                        ? selectedPlan === "monthly"
                          ? hasActiveMonthly
                            ? "Add one month after your current access period."
                            : accessBySlug[product.slug]?.intro_eligible !== false
                              ? "Complete terminal access for your introductory month."
                              : "One month of complete terminal access."
                          : hasActiveMonthly
                            ? "Upgrade your active monthly access to permanent lifetime access."
                            : "Permanent access to downloads and updates."
                        : "This product is not ready for checkout yet."}
                    </p>
                    {ready && product.monthly_pricing ? (
                      <div className="mt-3 inline-flex overflow-hidden rounded-md border border-cyan-border bg-main p-1">
                        <button
                          type="button"
                          onClick={() => setCartPlan(product.slug, "monthly")}
                          className={`rounded-sm px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                            selectedPlan === "monthly"
                              ? "bg-brand-deep text-white"
                              : "text-muted hover:text-white"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setCartPlan(product.slug, "lifetime")}
                          className={`rounded-sm px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                            selectedPlan === "lifetime"
                              ? "bg-brand-deep text-white"
                              : "text-muted hover:text-white"
                          }`}
                        >
                          Lifetime
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="mt-3 border border-cyan-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted hover:border-red-400/50 hover:text-red-100"
                      onClick={() => removeFromCart(product.slug)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-left sm:text-right">
                    {ready ? (
                      <>
                        <p className="font-semibold tabular-nums text-white">
                          <span className="mr-1 text-sm">{formatCurrencySymbol(product.currency)}</span>
                          {formatPriceAmount(checkoutItem?.amount ?? product.price)}
                        </p>
                        <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                          {selectedPlan === "monthly"
                            ? "One month access"
                            : "Lifetime access"}{" "}
                          · {getProductGstInclusiveText(product)}
                        </p>
                      </>
                    ) : (
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-warning">Not in checkout</p>
                    )}
                  </div>
                </article>
              );
            })}
            {purchasedCartProducts.length ? (
              <div className="border-t border-success/30 bg-success/5 p-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-success">Lifetime access already owned</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {purchasedCartProducts.map((product) => product.name).join(", ")} {purchasedCartProducts.length === 1 ? "is" : "are"} already permanently unlocked and {purchasedCartProducts.length === 1 ? "has" : "have"} been removed from checkout.
                </p>
              </div>
            ) : null}
          </section>

          <aside className="surface-panel h-fit overflow-hidden">
            <div className="border-b border-cyan-border bg-card-hover px-5 py-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand">Payment summary</p>
              <p className="mt-1 text-sm font-medium text-white">Payments are processed through secure checkout</p>
            </div>
            <div className="p-5">
              <div className="rounded-md border border-cyan-border bg-section p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
                <div className="space-y-3 text-sm text-muted">
                  <div className="flex justify-between gap-4"><span>Customer</span><span className="text-right">{authChecked ? email ?? "Sign in required" : "Checking..."}</span></div>
                  <div className="flex justify-between gap-4"><span>Access plans</span><span>{payableProducts.length}</span></div>
                  <div className="flex justify-between gap-4"><span>Subtotal</span><span>{formatCurrencySymbol(currency)} {formatPriceAmount(total)}</span></div>
                  <div className="flex justify-between gap-4"><span>GST</span><span className="text-right">{gstInclusiveText}</span></div>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4 border-t border-cyan-border pt-4 text-white">
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-muted">Total payable</span>
                  <span className="text-3xl font-extrabold tabular-nums">{formatCurrencySymbol(currency)} {formatPriceAmount(total)}</span>
                </div>
              </div>
              {email ? (
                <>
                  <label className="mt-5 block text-sm font-medium text-white">
                    Mobile number
                    <div className={`mt-2 flex items-center rounded-md border bg-main focus-within:border-brand ${phoneError ? "border-error/50" : "border-cyan-border"}`}>
                      <CountryCodeSelect
                        value={countryIso}
                        onChange={(nextIso) => {
                          setCountryIso(nextIso);
                          if (nextIso === DEFAULT_COUNTRY_ISO) setPhone((current) => current.slice(0, 10));
                          setPhoneError("");
                        }}
                      />
                      <span className="h-6 w-px bg-cyan-border" aria-hidden="true" />
                      <input
                        value={phone}
                        onChange={(event) => {
                          const maxDigits = countryIso === DEFAULT_COUNTRY_ISO ? 10 : 14;
                          setPhone(normalizeDigits(event.target.value).slice(0, maxDigits));
                          setPhoneError("");
                        }}
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder={countryIso === DEFAULT_COUNTRY_ISO ? "10-digit mobile" : "Mobile number"}
                        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-white outline-none"
                      />
                    </div>
                  </label>
                  {phoneError ? (
                    <p className="mt-2 text-xs font-medium text-error">{phoneError}</p>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-muted">Used for the payment — checkout opens directly on payment options.</p>
                  )}
                  <button type="button" disabled={loading || !accessLoaded || payableProducts.length === 0} onClick={startPayment} className="mt-4 inline-flex w-full items-center justify-center gap-2 btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/30  disabled:cursor-not-allowed disabled:bg-cyan-border disabled:text-muted">
                    {loading
                      ? "Starting Payment..."
                      : !accessLoaded
                        ? "Checking Your Price..."
                        : accessError
                          ? "Refresh to Verify Price"
                        : payableProducts.length === 0 && unavailableCartProducts.length > 0
                          ? "No Ready Products"
                          : "Pay Securely Now"}
                  </button>
                </>
              ) : (
                <Link href={`/login?next=${encodeURIComponent("/cart")}`} className="mt-5 block btn-primary px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/30 ">
                  Sign In to Pay
                </Link>
              )}
              {error ? (
                <div className="mt-4 rounded-md border border-error/35 bg-error/10 p-4" role="alert">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-error">Checkout could not start</p>
                  <p className="mt-2 text-sm leading-6 text-white">{error}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={retryAccessCheck}
                      disabled={loading || !accessLoaded || payableProducts.length === 0}
                      className="inline-flex min-h-10 items-center justify-center rounded-md border border-error/35 bg-main/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-error disabled:cursor-not-allowed disabled:text-muted"
                    >
                      {accessError ? "Refresh page" : "Try again"}
                    </button>
                    <Link href="/support" className="inline-flex min-h-10 items-center justify-center rounded-md border border-cyan-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
                      Contact support
                    </Link>
                  </div>
                </div>
              ) : null}
              {checkoutItems.some((item) => item.planId === "monthly") ? (
                <p className="mt-4 rounded-md border border-cyan-border bg-main/45 p-3 text-xs leading-5 text-muted">
                  Monthly access is paid one month at a time. It does not auto-renew or charge you automatically; renew from your account whenever you choose.
                </p>
              ) : null}
            </div>
          </aside>

          <OrderSteps />
        </div>
      )}
    </main>
  );
}

function CountryCodeSelect({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = getCountryByIso(value);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Country code"
        className="flex shrink-0 items-center gap-1 rounded-l-md bg-transparent py-3 pl-4 pr-2 text-sm font-semibold text-muted outline-none hover:text-white"
      >
        <span>{getCountryFlag(selected.iso)}</span>
        <span>+{selected.dial}</span>
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Country code"
          className="absolute left-0 top-full z-20 mt-1 max-h-64 w-60 overflow-y-auto rounded-md border border-cyan-border bg-main shadow-lg shadow-black/40"
        >
          {COUNTRY_CODES.map((country) => (
            <li key={country.iso}>
              <button
                type="button"
                role="option"
                aria-selected={country.iso === value}
                onClick={() => {
                  onChange(country.iso);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-card-hover ${
                  country.iso === value ? "bg-card-hover text-white" : "text-muted"
                }`}
              >
                <span>{getCountryFlag(country.iso)}</span>
                <span className="font-semibold">+{country.dial}</span>
                <span className="truncate">{country.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function OrderSteps() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-md border border-cyan-border bg-cyan-border sm:grid-cols-3 lg:col-span-2">
      {orderSteps.map((step, index) => (
        <li key={step.label} className="bg-section px-3 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/45 bg-main font-mono text-[11px] font-bold text-brand">
              {index + 1}
            </span>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white">{step.label}</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
