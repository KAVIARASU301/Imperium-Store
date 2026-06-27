"use client";

import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

export default function BuyButton({ slug, price, productName }: { slug: string; price: number; productName: string }) {
  return (
      <div>
        <AddToCartButton
            slug={slug}
            checkout
            className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#1e52e8] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#2b63ff]"
        >
          <Image src={price === 0 ? "/icons/tick.svg" : "/icons/cart.svg"} alt="" width={18} height={18} className="h-[18px] w-[18px]" />
          {price === 0 ? "Get Access" : "Review and Pay"}
        </AddToCartButton>
        <p className="mt-2 text-center text-xs font-medium text-[#6882a8]">
          {productName} will be added to your cart for final review.
        </p>
      </div>
  );
}
