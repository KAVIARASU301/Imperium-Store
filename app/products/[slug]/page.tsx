import PricingBox from "@/components/PricingBox";
import ProductImage from "@/components/ProductImage";
import { getActiveProducts, getProductBySlug } from "@/lib/products";
import type { ProductGalleryImage, ProductHighlight } from "@/types/product";
import Image from "next/image";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getActiveProducts().map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="inline-flex border border-[#1b3055] bg-[#0c1525] px-3 py-1.5 font-mono text-sm font-semibold uppercase tracking-widest text-[#0891b2]">{product.type}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="border border-[#1b3055] bg-[#c5d5ee] p-2">
              <Image src={product.icon.src} alt="" width={56} height={56} className="h-12 w-12 shrink-0" priority />
            </span>
            <h1 className="text-4xl font-extrabold tracking-normal text-[#c5d5ee] md:text-5xl">{product.name}</h1>
          </div>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-[#c5d5ee]">{product.promise}</p>
          <p className="mt-4 max-w-3xl leading-7 text-[#6882a8]">{product.description}</p>
          {product.badges?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <span key={badge} className="border border-[#1b3055] bg-[#0c1525] px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#c5d5ee]">
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-10"><ProductImage product={product} priority /></div>
          {product.highlights?.length ? <Highlights items={product.highlights} /> : null}
          {product.gallery?.length ? <Gallery productName={product.name} items={product.gallery} /> : null}
          <Info title="Who this is for" items={product.audience} />
          <Info title="What problem it solves" items={product.problems} />
          <Info title="What you get" items={product.includes} />
          <Info title="How it helps" items={product.outcomes} />
          {product.lessons ? <Info title="Course lessons" items={product.lessons.sort((a, b) => a.sort_order - b.sort_order).map((lesson) => `${lesson.title}${lesson.is_preview ? " (preview)" : ""}`)} /> : null}
          <section className="mt-12">
            <h2 className="border-b border-[#1b3055] pb-3 text-2xl font-bold text-[#c5d5ee]">FAQ</h2>
            <div className="mt-5 grid gap-px border border-[#1b3055] bg-[#1b3055]">
              {product.faq.map((item) => (
                <div key={item.question} className="bg-[#0c1525] p-5">
                  <h3 className="font-semibold text-[#c5d5ee]">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6882a8]">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-12 border border-amber-300/30 bg-amber-300/5 p-5"><h2 className="font-semibold text-amber-200">Disclaimer</h2><p className="mt-2 text-sm leading-6 text-[#c5d5ee]">This content is for educational purposes only. It is not investment advice. Trading involves risk. Past performance does not guarantee future results.</p></section>
        </section>
        <div className="lg:sticky lg:top-8 lg:self-start"><PricingBox price={product.price} currency={product.currency} slug={product.slug} productName={product.name} /></div>
      </div>
    </main>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-12"><h2 className="border-b border-[#1b3055] pb-3 text-2xl font-bold text-[#c5d5ee]">{title}</h2><ul className="mt-5 grid gap-px border border-[#1b3055] bg-[#1b3055] md:grid-cols-2">{items.map((item) => <li key={item} className="bg-[#0c1525] p-4 text-[#c5d5ee]">{item}</li>)}</ul></section>;
}

function Highlights({ items }: { items: ProductHighlight[] }) {
  return (
    <section className="mt-10 grid gap-px border border-[#1b3055] bg-[#1b3055] md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="bg-[#0c1525] p-4">
          <div className="flex h-10 w-10 items-center justify-center border border-[#1b3055] bg-[#111d35]">
            <Image src={item.icon} alt="" width={22} height={22} />
          </div>
          <h2 className="mt-4 font-semibold text-[#c5d5ee]">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#6882a8]">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

function Gallery({ productName, items }: { productName: string; items: ProductGalleryImage[] }) {
  return (
    <section className="mt-12">
      <h2 className="border-b border-[#1b3055] pb-3 text-2xl font-bold text-[#c5d5ee]">{productName} screenshots</h2>
      <div className="mt-5 grid gap-5">
        {items.map((item) => (
          <figure key={item.src} className="overflow-hidden border border-[#1b3055] bg-[#0c1525] shadow-xl shadow-black/20">
            <div className="grid gap-px bg-[#1b3055] font-mono text-[10px] uppercase tracking-[0.16em] text-[#6882a8] sm:grid-cols-[1fr_auto]">
              <div className="bg-[#111d35] px-3 py-2 text-[#c5d5ee]">{item.title}</div>
              <div className="bg-[#111d35] px-3 py-2">Screenshot file</div>
            </div>
            <div className="bg-[#070c17] p-2">
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-full border border-[#1b3055] object-contain"
                sizes="(min-width: 1024px) 760px, 100vw"
              />
            </div>
            <figcaption className="p-4">
              <p className="text-sm leading-6 text-[#6882a8]">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
