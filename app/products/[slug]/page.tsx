import PricingBox from "@/components/PricingBox";
import ProductImage from "@/components/ProductImage";
import { getActiveProducts, getProductBySlug, isProductReady } from "@/lib/products";
import { getSiteUrl, truncateDescription } from "@/lib/seo";
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

  const title = product.seo_title ?? `${product.name} | Imperium Store`;
  const description = truncateDescription(
    product.seo_description ?? product.short_description,
  );
  const path = `/products/${product.slug}`;

  return {
    title,
    description,
    category: product.type === "app" ? "Trading Software" : product.type,
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
  const siteUrl = getSiteUrl();
  const path = `/products/${product.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}${path}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Imperium Store",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Trading Software",
            item: `${siteUrl}/products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.alternate_names?.[0] ?? product.name,
            item: `${siteUrl}${path}`,
          },
        ],
      },
      ...(product.type === "app"
        ? [
            {
              "@type": "SoftwareApplication",
              "@id": `${siteUrl}${path}#software`,
              name: product.name,
              alternateName: product.alternate_names,
              applicationCategory: "FinanceApplication",
              operatingSystem: "Windows, Linux",
              description:
                product.seo_description ?? product.short_description,
              image: `${siteUrl}${product.image.src}`,
              url: `${siteUrl}${path}`,
              mainEntityOfPage: `${siteUrl}${path}`,
              offers: product.monthly_pricing
                ? [
                    {
                      "@type": "Offer",
                      name: "First month access",
                      price: product.monthly_pricing.introductory_price,
                      priceCurrency: product.currency,
                      availability: "https://schema.org/InStock",
                      url: `${siteUrl}${path}`,
                    },
                    {
                      "@type": "Offer",
                      name: "One-month renewal",
                      price: product.monthly_pricing.renewal_price,
                      priceCurrency: product.currency,
                      availability: "https://schema.org/InStock",
                      url: `${siteUrl}${path}`,
                    },
                    {
                      "@type": "Offer",
                      name: "Lifetime access",
                      price: product.price,
                      priceCurrency: product.currency,
                      availability: "https://schema.org/InStock",
                      url: `${siteUrl}${path}`,
                    },
                  ]
                : {
                    "@type": "Offer",
                    name: "Lifetime access",
                    price: product.price,
                    priceCurrency: product.currency,
                    availability: "https://schema.org/InStock",
                    url: `${siteUrl}${path}`,
                  },
              publisher: {
                "@id": `${siteUrl}/#organization`,
              },
            },
          ]
        : []),
    ],
  };
  return (
    <main className="page-container py-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="grid gap-6 sm:gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="inline-flex rounded-md border border-cyan-border bg-section px-3 py-1.5 font-mono text-sm font-semibold uppercase tracking-widest text-brand">{product.type === "app" ? "Software" : product.type}</p>
          <div className="mt-4 flex items-start gap-3 sm:items-center sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-cyan-border bg-section p-2 shadow-[0_12px_28px_rgba(0,0,0,0.24)] sm:h-16 sm:w-16 sm:p-3">
              <Image
                src={product.icon.src}
                alt=""
                width={product.icon.width}
                height={product.icon.height}
                className="max-h-9 w-auto object-contain sm:max-h-12"
                priority
              />
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-normal text-white sm:text-4xl md:text-5xl lg:text-[2.65rem]">
              {product.name}
            </h1>
          </div>
          {product.alternate_names?.[0] ? (
            <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              {product.alternate_names[0]} · Official Imperium options terminal
            </p>
          ) : null}
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white sm:mt-5 sm:text-xl sm:leading-8">{product.promise}</p>
          <div className="mt-5 lg:hidden">
            <PricingBox product={product} />
          </div>
          <p className="mt-4 max-w-3xl text-justify text-sm leading-6 text-muted sm:text-base sm:leading-7">{product.description}</p>
          {product.badges?.length || !isReady ? (
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
              {!isReady ? (
                <span className="border border-warning/40 bg-warning/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-warning">
                  Coming Soon
                </span>
              ) : null}
              {product.badges?.map((badge, index) => (
                <span key={badge} className={`${index >= 5 ? "hidden sm:inline-flex" : "inline-flex"} rounded-md border border-cyan-border bg-section px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white`}>
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-6 sm:mt-10"><ProductImage product={product} priority compactMobile /></div>
          {product.highlights?.length ? <Highlights items={product.highlights} /> : null}
          {product.gallery?.length ? <Gallery productName={product.name} items={product.gallery} /> : null}
          <Info title="What you get" items={product.includes} />
          {product.lessons ? <Info title="Course lessons" items={[...product.lessons].sort((a, b) => a.sort_order - b.sort_order).map((lesson) => `${lesson.title}${lesson.is_preview ? " (preview)" : ""}`)} /> : null}
          <section className="mt-8 sm:mt-12">
            <h2 className="section-title border-b border-cyan-border pb-3">FAQ</h2>
            <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
              {product.faq.map((item) => (
                <div key={item.question} className="surface-panel p-3 sm:p-5">
                  <h3 className="font-semibold text-white">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-8 rounded-md border border-amber-300/30 bg-amber-300/5 p-4 sm:mt-12 sm:p-5">
            <h2 className="font-semibold text-amber-200">Disclaimer</h2>
            <p className="mt-2 text-sm leading-6 text-white">This content is for educational purposes only. It is not investment advice. Trading involves risk. Past performance does not guarantee future results.</p>
          </section>
        </section>
        <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start"><PricingBox product={product} anchorId="plans-desktop" /></div>
      </div>
    </main>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-8 sm:mt-12">
      <h2 className="section-title border-b border-cyan-border pb-3">{title}</h2>
      <ul className="mt-4 grid gap-2 sm:mt-5 sm:gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <li key={item} className={`${index >= 6 ? "hidden sm:block" : ""} surface-panel p-3 text-sm leading-6 text-white sm:p-4`}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Highlights({ items }: { items: ProductHighlight[] }) {
  return (
    <section className="mt-8 grid gap-3 sm:mt-10 md:grid-cols-3">
      {items.map((item, index) => (
        <div key={item.title} className={`${index >= 4 ? "hidden md:block" : ""} surface-panel p-3 sm:p-4`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-border bg-card">
            <Image src={item.icon} alt="" width={22} height={22} />
          </div>
          <h2 className="mt-3 font-semibold text-white sm:mt-4">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

function Gallery({ productName, items }: { productName: string; items: ProductGalleryImage[] }) {
  return (
    <section className="mt-8 sm:mt-12">
      <h2 className="section-title border-b border-cyan-border pb-3">{productName} screenshots</h2>
      <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5">
        {items.map((item, index) => (
          <figure key={item.src} className={`${index >= 2 ? "hidden sm:block" : ""} surface-panel overflow-hidden`}>
            <div className="border-b border-cyan-border bg-card px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
              {item.title}
            </div>
            <div className="bg-main p-2">
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-full rounded-sm border border-cyan-border object-contain"
                sizes="(min-width: 1024px) 760px, 100vw"
              />
            </div>
            <figcaption className="p-3 sm:p-4">
              <p className="text-sm leading-6 text-muted">{item.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
