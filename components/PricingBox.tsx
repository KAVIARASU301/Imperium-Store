import BuyButton from "@/components/BuyButton";
import { formatCurrencySymbol, formatPriceAmount } from "@/lib/products";
import Image from "next/image";

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
        <aside className="overflow-hidden rounded-lg border-2 border-[#294875] bg-[#07101f] shadow-[0_24px_60px_rgba(0,0,0,0.46),0_0_0_1px_rgba(197,213,238,0.08)_inset]">
            <div className="border-b-2 border-[#1b3055] bg-[#0f1b31] px-5 py-4">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#67e8f9]">
                    Direct checkout
                </p>
                <p className="mt-1 text-sm font-medium text-[#c5d5ee]">
                    Secure payment through Razorpay
                </p>
            </div>

            <div className="p-5">
                <div className="rounded-md border-2 border-[#1b3055] bg-[#0c1525] p-4 shadow-[0_0_0_1px_rgba(197,213,238,0.06)_inset]">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6882a8]">
                        Payable amount
                    </p>
                    <p className="mt-2 text-[#c5d5ee]">
                        <span className="mr-1 align-baseline text-xl font-semibold">
                            {formatCurrencySymbol(currency)}
                        </span>
                        <span className="font-sans text-4xl font-extrabold tracking-normal tabular-nums">
                            {formatPriceAmount(price)}
                        </span>
                    </p>
                    <p className="mt-3 border-t border-[#1b3055] pt-3 text-sm font-medium leading-6 text-[#8aa3c7]">
                        One-time purchase. Lifetime access to current downloads.
                    </p>
                </div>

                <BuyButton
                    slug={slug}
                    price={price}
                    productName={productName}
                />

                {price > 0 ? (
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-[#8aa3c7]">
                        <Image
                            src="/icons/bhim/icons8-bhim-windows-11-color-32.png"
                            alt=""
                            width={20}
                            height={20}
                            className="h-5 w-5"
                        />
                        <span>Payments processed securely via Razorpay. BHIM UPI supported.</span>
                    </div>
                ) : null}

                <p className="mt-4 rounded-md border border-[#1b3055] bg-[#111d35] px-3 py-2 text-xs font-medium leading-5 text-[#8aa3c7]">
                    After payment, your download access and receipt are added to
                    your account once Razorpay confirms the transaction.
                </p>
            </div>
        </aside>
    );
}
