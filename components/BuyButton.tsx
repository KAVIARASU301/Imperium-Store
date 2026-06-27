"use client";

import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { usePurchasedProducts } from "@/components/usePurchasedProducts";

export default function BuyButton({ slug, price, productName }: { slug: string; price: number; productName: string }) {
  const { purchasedSlugSet } = usePurchasedProducts();
  const isPurchased = purchasedSlugSet.has(slug);

  return (
      <div>
        <AddToCartButton
            slug={slug}
            checkout
            className="mt-6 inline-flex w-full items-center justify-center gap-2 btn-primary px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white "
        >
          <Image src={price === 0 ? "/icons/tick.svg" : "/icons/cart.svg"} alt="" width={18} height={18} className="h-[18px] w-[18px]" />
          {price === 0 ? "Get Access" : "Review and Pay"}
        </AddToCartButton>
        <p className="mt-2 text-center text-xs font-medium text-muted">
          {isPurchased ? `${productName} is already available in your account.` : `${productName} will be added to your cart for final review.`}
        </p>
      </div>
  );
}
