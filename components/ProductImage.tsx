import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductImage({
  product,
  priority = false,
  className = "",
  compactMobile = false,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
  compactMobile?: boolean;
}) {
  return (
    <figure className={`overflow-hidden border border-cyan-border bg-section shadow-2xl shadow-black/30 ${className}`}>
      <div className={`${compactMobile ? "hidden sm:grid" : "grid"} gap-px bg-cyan-border font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:grid-cols-[1fr_auto]`}>
        <div className="bg-card px-3 py-2">
          <span className="text-white">Imperium product viewer</span>
          <span className="mx-2 text-muted">/</span>
          <span>{product.type}</span>
        </div>
        <div className="bg-card px-3 py-2 text-left sm:text-right">
          <span>Image ref</span>
          <span className="mx-2 text-muted">/</span>
          <span className="text-brand">{product.slug}</span>
        </div>
      </div>
      <div className="bg-main p-1.5 sm:p-2 md:p-3">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          width={product.image.width}
          height={product.image.height}
          priority={priority}
          className="h-auto w-full rounded-sm border border-cyan-border object-contain"
          sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <figcaption className={`${compactMobile ? "hidden sm:grid" : "grid"} gap-px bg-cyan-border font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:grid-cols-3`}>
        <span className="bg-card px-3 py-2">Classification: commercial</span>
        <span className="bg-card px-3 py-2">Market: India</span>
        <span className="bg-card px-3 py-2">Format: desktop software</span>
      </figcaption>
    </figure>
  );
}
