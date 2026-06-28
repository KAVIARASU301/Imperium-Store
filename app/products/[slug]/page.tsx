import PricingBox from "@/components/PricingBox";
import ProductImage from "@/components/ProductImage";
import { getActiveProducts, getProductBySlug, isProductReady } from "@/lib/products";
import { truncateDescription } from "@/lib/seo";
import type { ProductGalleryImage, ProductHighlight } from "@/types/product";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connection } from "next/server";

export function generateStaticParams() {
  return getActiveProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Imperium Store",
      description: "This product could not be found on Imperium Store.",
    };
  }

  const title = `${product.name} | Imperium Store`;
  const description = truncateDescription(product.short_description);
  const path = `/products/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Imperium Store",
      type: "website",
      images: [
        {
          url: product.image.src,
          width: product.image.width,
          height: product.image.height,
          alt: product.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image.src],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connection();
  const product = getProductBySlug(slug);
  if (!product) return notFound();
  const isReady = isProductReady(product);
  const keepTitleOnOneLine = product.slug === "imperium-option-trading-terminal";
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="inline-flex border border-cyan-border bg-section px-3 py-1.5 font-mono text-sm font-semibold uppercase tracking-widest text-brand">{product.type}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center border border-cyan-border bg-section p-3">
              <Image
                src={product.icon.src}
                alt=""
                width={product.icon.width}
                height={product.icon.height}
                className="max-h-12 w-auto object-contain"
                priority
              />
            </span>
            <h1 className={`${keepTitleOnOneLine ? "whitespace-nowrap text-4xl lg:text-[2.65rem]" : "text-4xl md:text-5xl"} font-extrabold tracking-normal text-white`}>
              {product.name}
            </h1>
          </div>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-white">{product.promise}</p>
          <p className="mt-4 max-w-3xl leading-7 text-muted">{product.description}</p>
          {product.badges?.length || !isReady ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {!isReady ? (
                <span className="border border-warning/40 bg-warning/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-warning">
                  Coming Soon
                </span>
              ) : null}
              {product.badges?.map((badge) => (
                <span key={badge} className="border border-cyan-border bg-section px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white">
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
            <h2 className="border-b border-cyan-border pb-3 text-2xl font-bold text-white">FAQ</h2>
            <div className="mt-5 grid gap-px border border-cyan-border bg-cyan-border">
              {product.faq.map((item) => (
                <div key={item.question} className="bg-section p-5">
                  <h3 className="font-semibold text-white">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-12 border border-amber-300/30 bg-amber-300/5 p-5"><h2 className="font-semibold text-amber-200">Disclaimer</h2><p className="mt-2 text-sm leading-6 text-white">This content is for educational purposes only. It is not investment advice. Trading involves risk. Past performance does not guarantee future results.</p></section>
        </section>
        <div className="lg:sticky lg:top-24 lg:self-start"><PricingBox price={product.price} currency={product.currency} slug={product.slug} productName={product.name} productType={product.type} status={product.status} /></div>
      </div>
    </main>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-12"><h2 className="border-b border-cyan-border pb-3 text-2xl font-bold text-white">{title}</h2><ul className="mt-5 grid gap-px border border-cyan-border bg-cyan-border md:grid-cols-2">{items.map((item) => <li key={item} className="bg-section p-4 text-white">{item}</li>)}</ul></section>;
}

function Highlights({ items }: { items: ProductHighlight[] }) {
  return (
    <section className="mt-10 grid gap-px border border-cyan-border bg-cyan-border md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="bg-section p-4">
          <div className="flex h-10 w-10 items-center justify-center border border-cyan-border bg-card">
            <Image src={item.icon} alt="" width={22} height={22} />
          </div>
          <h2 className="mt-4 font-semibold text-white">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

function Gallery({ productName, items }: { productName: string; items: ProductGalleryImage[] }) {
  return (
    <section className="mt-12">
      <h2 className="border-b border-cyan-border pb-3 text-2xl font-bold text-white">{productName} screenshots</h2>
      <div className="mt-5 grid gap-5">
        {items.map((item) => (
          <figure key={item.src} className="overflow-hidden border border-cyan-border bg-section shadow-xl shadow-black/20">
            <div className="grid gap-px bg-cyan-border font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:grid-cols-[1fr_auto]">
              <div className="bg-card px-3 py-2 text-white">{item.title}</div>
              <div className="bg-card px-3 py-2">Screenshot file</div>
            </div>
            <div className="bg-main p-2">
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-full border border-cyan-border object-contain"
                sizes="(min-width: 1024px) 760px, 100vw"
              />
            </div>
            <figcaption className="p-4">
              <p className="text-sm leading-6 text-muted">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
