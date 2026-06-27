import BuyButton from "@/components/BuyButton";
import { formatPrice } from "@/lib/products";

export default function PricingBox({
  price,
  currency,
  slug,
  productName,
}: { price: number; currency: string; slug: string; productName: string }) {
  return (
    <aside className="border border-cyan-400/30 bg-[#0B1020] p-6">
      <p className="font-mono text-sm uppercase tracking-widest text-slate-500">Direct checkout</p>
      <div className="mt-3 font-mono text-4xl text-cyan-300">{formatPrice(price, currency)}</div>
      <BuyButton slug={slug} price={price} productName={productName} />
      {price > 0 ? (
        <a
          href="https://razorpay.com/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex"
          aria-label="Razorpay payment gateway"
        >
          {/* Razorpay provides this hosted badge as an embeddable img snippet. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            referrerPolicy="origin"
            src="https://badges.razorpay.com/badge-dark.png"
            style={{ height: 45, width: 113 }}
            alt="Razorpay | Payment Gateway | Neobank"
          />
        </a>
      ) : null}
      <p className="mt-4 text-xs leading-5 text-slate-500">Access is unlocked only after trusted server-side confirmation. Trading involves risk.</p>
    </aside>
  );
}
