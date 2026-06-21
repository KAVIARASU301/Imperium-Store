import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductImage({ product, priority = false, className = "" }: { product: Product; priority?: boolean; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-slate-950 shadow-2xl shadow-cyan-950/30 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(34,211,238,.22),transparent_34%),linear-gradient(135deg,rgba(15,23,42,.15),rgba(2,6,23,.75))]" />
      <div className="relative p-2 md:p-3">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          width={product.image.width}
          height={product.image.height}
          priority={priority}
          className="h-auto w-full rounded-xl border border-white/10 object-cover transition duration-500 group-hover:scale-[1.015]"
          sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
    </div>
  );
}
