import BuyButton from "@/components/BuyButton";
import { formatCurrencySymbol, formatPriceAmount } from "@/lib/products";

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
        <aside className="border border-[#1b3055] bg-[#0c1525] p-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6882a8]">
                Direct checkout
            </p>

            <div className="mt-3 border-y border-[#1b3055] py-4">
                <p className="text-[#c5d5ee]">
                    <span className="mr-1 align-baseline text-xl font-semibold">
                        {formatCurrencySymbol(currency)}
                    </span>
                    <span className="font-sans text-3xl font-bold tracking-normal tabular-nums">
                        {formatPriceAmount(price)}
                    </span>
                </p>
                <p className="mt-2 text-sm text-[#6882a8]">
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

            <p className="mt-4 text-xs leading-5 text-[#6882a8]">
                Access is unlocked only after trusted server-side confirmation.
                Trading involves risk.
            </p>
        </aside>
    );
}
