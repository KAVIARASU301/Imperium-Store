import BuyButton from "@/components/BuyButton";
import { formatCurrencySymbol, formatPriceAmount, getProductGstInclusiveText } from "@/lib/products";
import type { Product } from "@/types/product";

export default function PricingBox({
                                       price,
                                       currency,
                                       slug,
                                       productName,
                                       productType,
                                   }: {
    price: number;
    currency: string;
    slug: string;
    productName: string;
    productType: Product["type"];
}) {
    const gstInclusiveText = getProductGstInclusiveText({ type: productType });

    return (
        <aside className="overflow-hidden rounded-lg border-2 border-cyan-border bg-card shadow-[0_24px_60px_rgba(0,0,0,0.46),0_0_0_1px_rgba(255,255,255,0.08)_inset]">
            <div className="border-b-2 border-cyan-border bg-card-hover px-5 py-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand">
                    Direct checkout
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                    Secure payment through Razorpay
                </p>
            </div>

            <div className="p-5">
                <div className="rounded-md border-2 border-cyan-border bg-section p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Payable amount
                    </p>
                    <p className="mt-2 text-white">
                        <span className="mr-1 align-baseline text-xl font-semibold">
                            {formatCurrencySymbol(currency)}
                        </span>
                        <span className="font-sans text-4xl font-extrabold tracking-normal tabular-nums">
                            {formatPriceAmount(price)}
                        </span>
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                        {gstInclusiveText}
                    </p>
                    <p className="mt-3 border-t border-cyan-border pt-3 text-sm font-medium leading-6 text-muted">
                        One-time purchase. Lifetime access to current downloads.
                    </p>
                </div>

                <BuyButton
                    slug={slug}
                    price={price}
                    productName={productName}
                />

                <p className="mt-4 rounded-md border border-cyan-border bg-card px-3 py-2 text-xs font-medium leading-5 text-muted">
                    After payment, your download access and receipt are added to
                    your account once Razorpay confirms the transaction.
                </p>
            </div>
        </aside>
    );
}
