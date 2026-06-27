import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductImage({ product, priority = false, className = "" }: { product: Product; priority?: boolean; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950 shadow-2xl shadow-black/30 ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.12),rgba(15,23,42,.18)_34%,rgba(2,6,23,.78))]" />
      <div className="relative p-2 md:p-3">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          width={product.image.width}
          height={product.image.height}
          priority={priority}
          className="h-auto w-full rounded-2xl border border-white/10 object-cover transition duration-500 group-hover:scale-[1.015]"
          sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}
