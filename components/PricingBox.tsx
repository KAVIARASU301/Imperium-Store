import Link from "next/link";
import { formatPrice } from "@/lib/products";

export default function PricingBox({ price, currency, slug }: { price: number; currency: string; slug: string }) {
  return (
    <aside className="border border-cyan-400/30 bg-[#0B1020] p-6">
      <p className="font-mono text-sm uppercase tracking-widest text-slate-500">Direct checkout</p>
      <div className="mt-3 font-mono text-4xl text-cyan-300">{formatPrice(price, currency)}</div>
      <Link href={`/login?next=/products/${slug}`} className="mt-6 block bg-cyan-300 px-5 py-3 text-center font-semibold text-black hover:bg-cyan-200">
        {price === 0 ? "Get Access" : "Buy Now"}
      </Link>
      <p className="mt-4 text-xs leading-5 text-slate-500">Access is unlocked only after trusted server-side confirmation. Trading involves risk.</p>
    </aside>
  );
}
