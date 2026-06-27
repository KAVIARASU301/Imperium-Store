import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductImage({ product, priority = false, className = "" }: { product: Product; priority?: boolean; className?: string }) {
  return (
    <figure className={`border border-[#1b3055] bg-[#0c1525] shadow-2xl shadow-black/30 ${className}`}>
      <div className="grid gap-px bg-[#1b3055] font-mono text-[10px] uppercase tracking-[0.16em] text-[#6882a8] sm:grid-cols-[1fr_auto]">
        <div className="bg-[#111d35] px-3 py-2">
          <span className="text-[#c5d5ee]">Imperium product viewer</span>
          <span className="mx-2 text-[#6882a8]">/</span>
          <span>{product.type}</span>
        </div>
        <div className="bg-[#111d35] px-3 py-2 text-left sm:text-right">
          <span>Image ref</span>
          <span className="mx-2 text-[#6882a8]">/</span>
          <span className="text-[#0891b2]">{product.slug}</span>
        </div>
      </div>
      <div className="bg-[#070c17] p-2 md:p-3">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          width={product.image.width}
          height={product.image.height}
          priority={priority}
          className="h-auto w-full border border-[#1b3055] object-contain"
          sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <figcaption className="grid gap-px bg-[#1b3055] font-mono text-[10px] uppercase tracking-[0.16em] text-[#6882a8] sm:grid-cols-3">
        <span className="bg-[#111d35] px-3 py-2">Classification: commercial</span>
        <span className="bg-[#111d35] px-3 py-2">Market: India</span>
        <span className="bg-[#111d35] px-3 py-2">Format: desktop software</span>
      </figcaption>
    </figure>
  );
}
