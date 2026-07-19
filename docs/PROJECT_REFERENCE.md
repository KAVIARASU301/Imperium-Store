# Imperium Store Project Reference

Last updated: 2026-06-28

This is the canonical reference for future work on Imperium Store. It replaces the old root project plan, the duplicate docs plan, and the standalone color palette notes.

## 1. Product Purpose

Imperium Store is a premium direct-purchase website for Imperium trading software. The job of the site is simple:

```txt
show the product -> explain the workflow value -> take payment -> unlock access
```

The store should feel like an official fintech software storefront, not a generic ecommerce site, a course marketplace, or a trading-guru landing page.

Current live products are defined in `lib/products.ts`:

| Product | Positioning | Primary cue |
| --- | --- | --- |
| Imperium Option Trading Terminal | High-speed Indian options desktop terminal for execution, paper trading, live positions, risk controls, and review. | Federal blue with small technical cyan data accents. |
| Imperium Investor | Professional investment terminal for Indian and American stock portfolios with Zerodha and IBKR workflows. | Federal blue base with restrained premium gold accents. |

The product screenshots are part of the brand. The store UI should frame them cleanly instead of competing with them.

## 2. Required Project Guardrails

- Before changing Next.js behavior, read the relevant local docs in `node_modules/next/dist/docs/`. This repo uses Next.js 16.2.9, which can differ from older assumptions.
- Keep the App Router structure under `app/`.
- Use TypeScript and the existing path alias `@/`.
- Tailwind is version 4 and is configured through CSS in `app/globals.css` with `@import "tailwindcss"` and `@theme inline`; do not assume a Tailwind v3 config file.
- Keep products hardcoded in `lib/products.ts` until there is a deliberate admin/database migration.
- Do not unlock paid access from frontend-only success state. Paid access must be recorded after server-side payment verification or test/free checkout logic.
- Trading copy must remain educational and risk-aware. Never promise profit, daily income, fixed returns, or guaranteed outcomes.

## 3. Tech Stack

| Layer | Current choice |
| --- | --- |
| Framework | Next.js 16.2.9 |
| React | React 19.2.4 |
| Language | TypeScript |
| Styling | Tailwind CSS 4.3.1 via `app/globals.css` |
| Auth/session | Supabase when env exists; demo browser session fallback when env is missing |
| Purchase storage | Supabase `purchases` table when env exists; local fallback for development |
| Payments | Razorpay |
| Downloads | Latest GitHub release assets, protected by paid access checks |
| Hosting target | Vercel-style Next deployment |

Useful commands:

```bash
npm run dev
npm run build
npm run lint
```

Node.js must be `>=20.9.0`.

## 4. Important Routes And Files

| Area | Files |
| --- | --- |
| Global shell | `app/layout.tsx`, `app/globals.css`, `components/HeaderNav.tsx` |
| Homepage | `app/page.tsx`, `components/Hero.tsx`, `components/TickerBoard.tsx`, `components/ProductCard.tsx` |
| Products | `app/products/page.tsx`, `app/products/[slug]/page.tsx`, `components/ProductCatalog.tsx`, `components/PricingBox.tsx` |
| Cart/checkout | `app/cart/page.tsx`, `components/CartPageClient.tsx`, `app/checkout/page.tsx`, checkout success/failed routes |
| Purchases/downloads | `app/dashboard/page.tsx`, `components/DashboardProducts.tsx`, `components/DownloadButton.tsx`, `app/api/downloads/[fileId]/route.ts` |
| Payments API | `app/api/razorpay/create-order/route.ts`, `app/api/razorpay/verify-payment/route.ts`, `app/api/razorpay/webhook/route.ts` |
| Product data | `lib/products.ts`, `types/product.ts` |
| Product assets | `public/product-resources/` |
| Legal/support | `app/disclaimer`, `app/refund-policy`, `app/terms`, `app/privacy-policy`, `app/contact`, `app/support` |

The product detail route currently uses the Next 16 App Router params pattern:

```ts
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

Check local Next docs before changing route handler or page signatures.

## 5. Desired Design Direction

The desired look is the recent direction already present in the app:

```txt
official federal fintech base
+ black navy depth
+ real trading terminal screenshots
+ clear white typography
+ restrained federal blue actions
+ small premium gold signals
+ tiny cyan technical/data details
```

Personality:

- Official, quiet, precise, premium.
- Desktop software storefront, not SaaS marketing fluff.
- Trading-terminal inspired but not covered in fake grids or neon effects.
- Dense enough for serious traders, but still readable and polished.
- Confident rectangular controls with small radius, not pill-heavy or playful.

Avoid:

- Generic ecommerce cards and bright sale banners.
- Udemy/course-marketplace styling.
- Purple gradients, beige themes, orange/brown palettes, and one-note blue screens.
- Big cyan glows everywhere.
- Fake profit screenshots, unrealistic P&L claims, or hype copy.
- Stock-photo heroes when product screenshots exist.

## 6. Color Palette

The active tokens live in `app/globals.css`. Keep this palette as the source of truth.

| Role | Token | Hex | Use |
| --- | --- | --- | --- |
| Page black navy | `--bg-main` | `#05080F` | Body base and deepest surfaces |
| Federal surface navy | `--bg-section` | `#0B1626` | Header, footer, major sections |
| Panel navy | `--bg-card` | `#101D2F` | Product cards, rows, controls |
| Raised panel navy | `--bg-card-hover` | `#132844` | Hovered cards, active tabs |
| Input navy | `--bg-input` | `#0E1A2B` | Forms, selects, search |
| Federal blue | `--federal-blue` | `#162E51` | Structural brand base |
| Action blue | `--brand-blue` | `#2F6FA6` | Primary buttons and key actions |
| Light federal blue | `--brand-blue-bright` | `#8BBCE8` | Small labels, active highlights |
| Deep action blue | `--brand-blue-deep` | `#1B4E7A` | Button gradients and pressed states |
| Investor gold | `--imperium-gold` | `#D9B45F` | Premium value and investor cues |
| Soft gold | `--imperium-gold-bright` | `#F1D58A` | Small gold text and selected emphasis |
| Deep gold | `--imperium-gold-dark` | `#8E6F2E` | Subtle gold borders |
| Technical cyan | `--data-cyan` | `#49C7E8` | Data readouts and terminal details only |
| Main text | `--text-main` | `#FFFFFF` | Headings and key values |
| Body text | `--text-body` | `#E8EEF6` | Paragraphs and normal copy |
| Muted text | `--text-muted` | `#A7B2C2` | Captions and secondary labels |
| Disabled text | `--text-disabled` | `#68778A` | Disabled actions |

Status colors:

| State | Token | Hex |
| --- | --- | --- |
| Success / paid | `--success` | `#47D18C` |
| Warning / pending | `--warning` | `#F4B740` |
| Error / failed | `--error` | `#FF6B6B` |
| Info / data | `--info` | `#49C7E8` |

Target visual ratio:

| Family | Target use |
| --- | ---: |
| Black navy and federal navy | 72% |
| White and cool gray text | 18% |
| Federal/action blue | 7% |
| Gold premium accents | 2% |
| Cyan and status colors | 1% |

Color rules:

- Federal blue owns the store identity.
- Gold is a premium signal, not a page theme.
- Cyan is not the main brand color anymore. Use it only for data, terminal labels, and the option-terminal cue.
- Status colors are only for status.
- Page backgrounds stay quiet and non-repeating.

## 7. Layout And Surface Rules

- Use constrained content widths: `max-w-[1200px]` for normal pages and `max-w-[1400px]` for the homepage hero frame.
- Keep the header sticky with a dark translucent federal surface and a soft blue border.
- Use real product screenshots in the hero and product cards.
- Hero should show the product as a first-viewport signal, not just a tiny logo.
- Product pages should feel like software product pages with screenshots, benefits, inclusions, outcomes, FAQ, and a sticky pricing box.
- Keep cards at `rounded-md` or smaller. Avoid large playful radii.
- Do not nest visual cards inside visual cards.
- Use borders and shadows for depth, but keep contrast restrained.
- Hover movement should be tiny, such as `-translate-y-0.5` or `-2px`.
- Use full-width page bands or unframed sections. Reserve cards for repeated items, product panels, modal-like tools, and framed screenshots.

Background direction:

```css
body {
  background:
    radial-gradient(900px 360px at 50% -180px, rgba(47, 111, 166, 0.26), transparent 68%),
    linear-gradient(180deg, rgba(11, 22, 38, 0.98) 0%, rgba(5, 8, 15, 0.98) 34rem, rgba(5, 8, 15, 1) 100%),
    var(--bg-main);
}
```

Avoid full-page grid textures, repeated dot patterns, decorative blobs, and oversized atmospheric backgrounds.

## 8. Typography

- Use the current sans stack for normal UI: `Inter, ui-sans-serif, system-ui, sans-serif`.
- Use the current mono stack for labels and numbers: `"JetBrains Mono", "SFMono-Regular", Consolas, monospace`.
- Use mono text for badges, product type labels, prices, versions, platform names, and technical labels.
- Use uppercase labels sparingly with wider tracking for terminal/fintech cues.
- Keep headings strong and compact. Do not use hero-scale text inside cards, sidebars, dashboards, or small panels.
- Letter spacing must never be negative.
- Do not scale font size with viewport width.
- Ensure button text, labels, prices, and cards fit on mobile and desktop.

## 9. Component Patterns

Primary button:

```css
border: 1px solid rgba(139, 188, 232, 0.48);
background: linear-gradient(180deg, var(--brand-blue) 0%, var(--brand-blue-deep) 100%);
color: var(--text-main);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.18),
  inset 0 -1px 0 rgba(217, 180, 95, 0.34),
  var(--shadow-action);
```

Secondary button:

```css
border: 1px solid rgba(139, 188, 232, 0.26);
background: rgba(16, 29, 47, 0.72);
color: var(--text-body);
```

Product panel:

```css
background: linear-gradient(180deg, rgba(16, 29, 47, 0.96), rgba(11, 22, 38, 0.98));
border: 1px solid var(--border-cyan-soft);
box-shadow: var(--shadow-panel);
```

Navigation:

- Active state uses a bottom border and a subtle `bg-card/60` surface.
- Desktop nav stays compact.
- Mobile nav is a dark bordered dropdown with the same active treatment.

Product cards:

- Horizontal cards work best on the homepage and product listing when comparison matters.
- Vertical cards are acceptable for grid/list catalog views.
- Always include a real screenshot, product icon, product type, main badge, short description, price, and clear CTAs.
- Use `object-top` on screenshots because the top toolbar/window structure helps users understand the software.

## 10. Product-Specific Visual Cues

Imperium Option Trading Terminal:

- Cue: active Indian options, execution, practice, session review.
- Use federal/action blue as the UI base.
- Use `--data-cyan` only for technical badges, terminal data, chart/readout accents, and option-terminal-specific details.
- Avoid turning the whole page cyan.

Imperium Investor:

- Cue: portfolio, India + U.S. markets, premium long-term workstation.
- Use gold for small premium highlights, separators, value markers, and investor-specific badges.
- Avoid gold-filled cards or large gold text blocks.

## 11. Copy And Brand Voice

Voice:

- Serious, direct, disciplined, practical.
- Talk about workflows, structure, practice, monitoring, execution, and review.
- Use trader language, but do not overdo jargon where a clear phrase works better.

Good language:

```txt
Trade faster. Practice safer.
One focused desktop terminal.
Built for disciplined trading workflows.
Manage Indian and American stock portfolios from one focused investment terminal.
Educational tools for preparation, execution, and review.
```

Avoid:

```txt
Guaranteed profit.
Earn daily income.
Become rich from trading.
Secret strategy.
Win every day.
```

Required risk positioning:

```txt
This content is for educational purposes only. It is not investment advice. Trading involves risk. Past performance does not guarantee future results.
```

## 12. Purchase And Access Rules

Current payment flow:

1. The browser requests `app/api/razorpay/create-order/route.ts`.
2. The API authenticates the user, validates products and access plans, resolves introductory eligibility and server-authoritative prices, blocks duplicate lifetime purchases, creates pending purchases, and returns a Razorpay order.
3. The browser completes Razorpay checkout.
4. The browser calls `app/api/razorpay/verify-payment/route.ts`.
5. The server verifies the Razorpay checkout signature and atomically activates either a one-month access window or lifetime access.
6. `app/api/razorpay/webhook/route.ts` remains the backup confirmation path for captured/failed payments.
7. Dashboard downloads call `app/api/downloads/[fileId]/route.ts`, which checks auth and paid access before returning the latest GitHub release zip URL.

Rules:

- Do not trust product IDs or prices from the browser.
- Do not allow mixed currencies in one cart unless the backend is deliberately changed.
- Preserve duplicate purchase protection.
- Preserve paid access checks before downloads.
- The options terminal first month is ₹199 once per account, later one-month renewals are ₹499, and lifetime access is ₹6,999.
- Monthly access is customer-renewed and does not automatically charge.
- Active monthly customers may upgrade to lifetime at any time. Remaining monthly time is not applied as a credit.
- Existing paid rows from before access plans are lifetime purchases.
- `TEST_CHECKOUT_ENABLED=true` is for local testing only and must not be enabled in production.

Required payment env:

```bash
RAZORPAY_KEY_ID=rzp_live_or_test_key
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

Required production site URL for SEO metadata:

```bash
NEXT_PUBLIC_SITE_URL=https://imperiumstore.in
```

This controls canonical and social preview URLs. Set this per environment when staging or preview deployments should emit their own absolute metadata URLs. Local development falls back to `http://localhost:3000` when the variable is omitted, but production builds require it.

Supabase env when using real persistence:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Expected purchase record shape is defined in `types/purchase.ts`:

| Field | Notes |
| --- | --- |
| `id` | Purchase row ID. Local fallback uses `local_<uuid>`. |
| `user_id` | Supabase user ID or demo user ID. |
| `product_id` | Product slug from `lib/products.ts`. |
| `razorpay_order_id` | Razorpay order ID, or local/free/test order ID. |
| `razorpay_payment_id` | Razorpay payment ID when available. |
| `status` | `pending`, `paid`, `failed`, or `refunded`. |
| `access_type` | `intro_month`, `monthly`, or `lifetime`. Legacy paid rows migrate to `lifetime`. |
| `access_starts_at` | Activation timestamp set only after payment confirmation. |
| `access_expires_at` | End of a monthly access window. `null` for lifetime access. |
| `amount` | Product amount stored in rupees, not paise. |
| `currency` | Current products use `INR`. |
| `created_at` | ISO timestamp. |
| `paid_at` | ISO timestamp only when paid. |

License types exist in `types/license.ts`, but there is no active license activation server yet. Treat licensing as a future feature unless explicitly requested.

Run `docs/supabase_purchase_access_plans.sql` before deploying code that writes
the access-plan fields. The migration also installs
`public.activate_purchase_order`, which serializes renewals and is callable only
through the service role.

The migration also installs authenticated RPC
`public.has_product_access(product_id)`. The desktop terminal must call this
entitlement check (or apply the identical lifetime/expiry rule) after login.
Checking only for an old `paid` purchase would incorrectly keep expired monthly
customers active.

## 13. Product Data Rules

`lib/products.ts` is the source of truth for:

- Product slugs, names, prices, currency, active status.
- Product icons and screenshots.
- Product descriptions, promises, badges, highlights, gallery, audience, problems, includes, outcomes, FAQ.
- Download file records and GitHub release repositories.

Product types are defined in `types/product.ts` as `course`, `app`, and `template`. Current active products are both `app`.

When adding a product:

- Add a stable slug.
- Add a 64x64 icon under `public/product-resources/<slug>/icons/`.
- Add real screenshots under `public/product-resources/<slug>/`.
- Add gallery images with accurate width/height.
- Add badges that help the user understand market, broker, and use case.
- Add risk-aware FAQ where needed.
- Add download file records for each platform.

## 14. Asset Rules

- Prefer real product screenshots over illustrations.
- Product screenshots should be high resolution and readable.
- Use icons from `public/icons/` or product-specific icon folders.
- Do not use stock imagery to represent the software.
- Do not blur screenshots beyond usefulness.
- Do not crop out the actual interface in hero/product contexts.
- Use Next `Image` for local images unless there is a specific reason not to.

## 15. Accessibility And UX Rules

- Buttons and links need clear text or accessible labels.
- Icons used decoratively should have empty alt text.
- Product screenshots need descriptive alt text.
- Keep focus states visible for checkout, auth, cart, and dashboard actions.
- Menus should close on outside click and Escape, as the current mobile nav does.
- Disabled/waiting states should be obvious and should not shift layout.
- Prices should use tabular numbers where possible.
- On mobile, controls should wrap cleanly rather than overflow.

## 16. Current Business Scope

Version 1 should stay focused on:

- Homepage.
- Products page.
- Product detail pages.
- Login/signup.
- Cart and Razorpay checkout.
- Purchase verification.
- My Purchases dashboard.
- Protected downloads.
- Legal and support pages.

Do not prioritize these until the core purchase/download loop is stable:

- Full admin panel.
- Coupons.
- Affiliate system.
- Subscriptions.
- License activation server.
- Course progress system.
- Community integrations.
- Complex analytics dashboard.

## 17. Future Work Checklist

Before changing UI:

- Check `app/globals.css` tokens first.
- Verify the change keeps the federal fintech direction.
- Confirm cyan remains a tiny data/technical accent.
- Confirm gold is used only as a premium cue.
- Test important viewports for text fit and screenshot framing.
- Keep screenshots visible and useful.

Before changing checkout/downloads:

- Verify auth is required.
- Verify server-side payment signature checks remain intact.
- Verify paid access is checked before downloads.
- Verify production cannot use test checkout accidentally.
- Run `npm run build` when the change touches routes, server code, or typing.

Before changing Next.js APIs:

- Read the relevant file under `node_modules/next/dist/docs/`.
- Prefer current local patterns over older external examples.
- Keep route/page signatures consistent with this Next version.

## 18. Final Direction

Imperium Store should always read as:

```txt
a serious Indian trading software storefront
with official federal-blue structure,
black-navy depth,
clear product screenshots,
premium gold restraint,
and only small cyan technical details.
```

When unsure, choose restraint, clarity, and product credibility.
