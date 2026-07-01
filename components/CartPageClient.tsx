"use client";

import { CART_UPDATED_EVENT, clearCart, clearCartItems, readCart, removeFromCart } from "@/lib/cart";
import { createRazorpayCheckout } from "@/lib/razorpay-client";
import { formatCurrencySymbol, formatPriceAmount, getProductGstInclusiveText, getProductsGstInclusiveText, isProductReady } from "@/lib/products";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { markProductsPurchased, usePurchasedProducts } from "@/components/usePurchasedProducts";
import StatePanel from "@/components/StatePanel";

interface CreateOrderResponse {
  orderId: string | null;
  amount: number;
  currency: string;
  keyId?: string;
  productIds?: string[];
  purchasedProductIds?: string[];
  unavailableProductIds?: string[];
  message?: string;
}

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

const orderSteps = [
  { label: "Cart", text: "Review products and account email." },
  { label: "Payment", text: "Complete payment through the secure checkout." },
  { label: "Download", text: "Get files from your dashboard." },
];

export default function CartPageClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { purchasedSlugs, purchasedSlugSet } = usePurchasedProducts();

  useEffect(() => {
    function sync() {
      setCartSlugs(readCart());
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
      setAuthChecked(true);
    }

    loadSession();
  }, []);

  const cartProducts = useMemo(
    () => cartSlugs.map((slug) => products.find((product) => product.slug === slug)).filter((product): product is Product => Boolean(product)),
    [cartSlugs, products],
  );
  const payableProducts = useMemo(
    () => cartProducts.filter((product) => isProductReady(product) && !purchasedSlugSet.has(product.slug)),
    [cartProducts, purchasedSlugSet],
  );
  const unavailableCartProducts = useMemo(
    () => cartProducts.filter((product) => !isProductReady(product) && !purchasedSlugSet.has(product.slug)),
    [cartProducts, purchasedSlugSet],
  );
  const purchasedCartProducts = useMemo(
    () => cartProducts.filter((product) => purchasedSlugSet.has(product.slug)),
    [cartProducts, purchasedSlugSet],
  );
  const total = payableProducts.reduce((sum, product) => sum + product.price, 0);
  const currency = payableProducts[0]?.currency ?? cartProducts[0]?.currency ?? "INR";
  const gstInclusiveText = getProductsGstInclusiveText(payableProducts);

  async function startPayment() {
    setError("");
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        router.push(`/login?next=${encodeURIComponent("/cart")}`);
        return;
      }

      const productIds = payableProducts.map((product) => product.slug);
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
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productIds }),
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

      const checkout = await createRazorpayCheckout({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Imperium Store",
        description: productIds.length === 1 ? payableProducts[0]?.name : `${productIds.length} Imperium products`,
        prefill: { email: sessionData.session?.user.email ?? undefined },
        theme: { color: "#2F6FA6" },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify(response),
            });
            const verifyPayload = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyPayload.message ?? "Payment verification failed");
            clearCartItems(verifyPayload.productIds ?? productIds);
            markProductsPurchased(verifyPayload.productIds ?? productIds);
            router.push(`/checkout/success?order_id=${response.razorpay_order_id}`);
          } catch (error) {
            setError(error instanceof Error ? error.message : "Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      checkout.on("payment.failed", () => {
        router.push(`/checkout/failed?order_id=${order.orderId}`);
      });

      checkout.open();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="page-container py-12">
      <section className="section-heading">
        <p className="section-kicker">Secure order review</p>
        <h1 className="mt-2 max-w-4xl text-3xl font-extrabold tracking-normal text-white sm:text-4xl">
          Review Cart and Complete Payment
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Review your selected products, add more tools if needed, and complete payment through the secure checkout from this page.
        </p>
      </section>

      {cartProducts.length === 0 ? (
        <div className="mt-8 grid gap-5">
          <StatePanel
            eyebrow="Cart is empty"
            title="Add a product to start checkout."
            description="Your cart has no products right now. Browse the catalog, or open your purchase library if you already completed payment."
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
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand">Selected products</p>
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
              if (purchasedSlugSet.has(product.slug)) return null;
              const ready = isProductReady(product);
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
                      {ready ? "Digital download access after payment confirmation." : "This product is not ready for checkout yet."}
                    </p>
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
                          {formatPriceAmount(product.price)}
                        </p>
                        <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{getProductGstInclusiveText(product)}</p>
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
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-success">Already purchased</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {purchasedCartProducts.map((product) => product.name).join(", ")} {purchasedCartProducts.length === 1 ? "has" : "have"} been removed from checkout.
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
                  <div className="flex justify-between gap-4"><span>Items</span><span>{payableProducts.length}</span></div>
                  <div className="flex justify-between gap-4"><span>Subtotal</span><span>{formatCurrencySymbol(currency)} {formatPriceAmount(total)}</span></div>
                  <div className="flex justify-between gap-4"><span>GST</span><span className="text-right">{gstInclusiveText}</span></div>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4 border-t border-cyan-border pt-4 text-white">
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-muted">Total payable</span>
                  <span className="text-3xl font-extrabold tabular-nums">{formatCurrencySymbol(currency)} {formatPriceAmount(total)}</span>
                </div>
              </div>
              {email ? (
                <button type="button" disabled={loading || payableProducts.length === 0} onClick={startPayment} className="mt-5 inline-flex w-full items-center justify-center gap-2 btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/30  disabled:cursor-not-allowed disabled:bg-cyan-border disabled:text-muted">
                  {loading ? "Starting Payment..." : payableProducts.length === 0 && unavailableCartProducts.length > 0 ? "No Ready Products" : "Pay Securely Now"}
                </button>
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
                      onClick={startPayment}
                      disabled={loading || payableProducts.length === 0}
                      className="inline-flex min-h-10 items-center justify-center rounded-md border border-error/35 bg-main/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-error disabled:cursor-not-allowed disabled:text-muted"
                    >
                      Try again
                    </button>
                    <Link href="/support" className="inline-flex min-h-10 items-center justify-center rounded-md border border-cyan-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:border-brand">
                      Contact support
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </aside>

          <OrderSteps />
        </div>
      )}
    </main>
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
