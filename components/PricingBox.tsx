import BuyButton from "@/components/BuyButton";
import { formatPrice } from "@/lib/products";

export default function PricingBox({
                                       price,
                                       currency,
                                       slug,
                                       productName,
                                   }: {
    price: number;
    currency: string;
    slug: string;
    productName: string;
}) {
    return (
        <aside className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Direct checkout
            </p>

            <div className="mt-3">
                <p className="text-3xl font-semibold tracking-normal text-white">
                    {formatPrice(price, currency)}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                    One-time purchase. Lifetime access to current downloads.
                </p>
            </div>

            <BuyButton
                slug={slug}
                price={price}
                productName={productName}
            />

            {price > 0 ? (
                <a
                    href="https://razorpay.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="mx-auto mt-4 flex w-fit items-center justify-center"
                    aria-label="Razorpay payment gateway"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        referrerPolicy="origin"
                        src="https://badges.razorpay.com/badge-light.png"
                        className="block h-[45px] w-[113px]"
                        alt="Razorpay | Payment Gateway | Neobank"
                    />
                </a>
            ) : null}

            <p className="mt-4 text-xs leading-5 text-slate-500">
                Access is unlocked only after trusted server-side confirmation.
                Trading involves risk.
            </p>
        </aside>
    );
}