# Imperium Store - Project Reference Plan

**Project:** Imperium Store  
**Purpose:** Minimal, premium website/store to sell trading-related courses, apps, templates, and tools.  
**Primary Brand Direction:** Trading terminal + premium software landing page + direct checkout.  
**Recommended MVP Stack:** Next.js + TypeScript + Tailwind CSS + Supabase + Razorpay + Vercel.

---

## 1. Core Idea

Imperium Store should not look like a normal course website or generic e-commerce store.

It should feel like:

> Trading terminal + premium software landing page + direct checkout.

The site should communicate seriousness, discipline, execution, and premium trading-tool quality.

Avoid the feeling of:

- Generic e-commerce
- Udemy-style course marketplace
- Overloaded marketing page
- Flashy trading-guru website
- Too many animations or fake profit promises

The goal is simple:

> Show product -> explain outcome -> take payment -> unlock access.

---

## 2. Recommended Tech Stack

| Layer | Recommended Tool | Reason |
|---|---|---|
| Frontend | Next.js + TypeScript | Full-stack React framework suitable for landing pages, dashboard, API routes, auth, checkout, and protected pages. |
| Styling | Tailwind CSS | Fast, minimal, responsive design with clean dark UI. |
| Backend | Next.js API routes / Server Actions | Keeps backend and frontend in one project. |
| Database | Supabase Postgres | Stores products, purchases, licenses, users, and access rules. |
| Auth | Supabase Auth | Login, signup, password reset, user sessions. |
| File Storage | Supabase Storage / S3-style storage | Private app downloads, PDFs, templates, and course assets. |
| Payments | Razorpay | Best fit for India: UPI, cards, netbanking, wallets. |
| Hosting | Vercel | Smooth deployment for Next.js apps. |

### Final Stack Decision

Use:

```txt
Next.js + TypeScript + Tailwind CSS
Supabase Auth + Supabase Postgres + Supabase Storage
Razorpay Payments
Vercel Hosting
```

Avoid initially:

```txt
WordPress
Shopify
Full custom Python backend
Complex admin panel
Mobile app
Too many products
Too much animation
```

Reason:

Imperium Store is not just a simple website. It may later include:

```txt
Trading courses
Downloadable desktop apps
License keys
Private updates
User dashboard
Subscriptions
Protected resources
```

So the project should start with a scalable structure.

---

## 3. Brand and Visual Direction

### Design Personality

| Element | Direction |
|---|---|
| Overall feel | Minimal, sharp, premium, trading-terminal inspired |
| Background | Near-black / dark navy |
| Accent | Cyan / electric blue |
| Text | White and soft grey |
| Buttons | Sharp, rectangular, confident |
| Fonts | Clean sans-serif + mono font for numbers |
| Animation | Minimal, subtle, fast |
| Layout | Big headline, strong CTA, low clutter |

The site should look serious and professional.

Suggested emotional signal:

> Built for traders who want structure, discipline, replay, and better execution.

### Suggested Color Palette

```txt
Background: #05070D
Panel:      #0B1020
Border:     #1E2A3A
Text:       #F8FAFC
Muted:      #94A3B8
Accent:     #22D3EE
Danger:     #EF4444
Profit:     #22C55E
Warning:    #FACC15
```

### Font Direction

```txt
Main font: Inter / Geist Sans
Number font: JetBrains Mono / Geist Mono
```

Use mono font for:

- Prices
- P&L
- Product labels
- Version numbers
- Trading symbols
- Dashboard stats

Examples:

```txt
₹2,999
+₹4,820
BANKNIFTY OPTIONS
CVD REPLAY TOOL
v1.0.2
```

---

## 4. Website Positioning

Do not sell only "courses." Sell systems, tools, and structured workflows.

| Weak Naming | Better Naming |
|---|---|
| BankNifty Course | BankNifty Execution System |
| CVD App | CVD Practice Lab |
| Trading Journal | Imperium Trade Journal |
| Options Course | Options Buyer Discipline Framework |
| App Bundle | Imperium Trader Toolkit |

The brand should avoid unrealistic profit claims.

Do not say:

```txt
Make guaranteed profit.
Earn daily income.
Become rich from trading.
```

Better wording:

```txt
Structured tools for practice, execution, and review.
Built for traders who want discipline and repeatable workflows.
Educational tools for better trading preparation.
```

---

## 5. Homepage Structure

### Section 1 - Hero

Suggested headline:

```txt
Trade Better. Practice Smarter. Build Discipline.
```

Suggested subtext:

```txt
Imperium Store gives traders access to focused trading apps, practice tools, and structured options trading education.
```

Primary buttons:

```txt
View Products
Watch Demo
```

Hero visual idea:

- Dark terminal-style card
- App screenshot mockup
- P&L panel
- Replay chart preview
- Product dashboard preview

### Section 2 - Product Categories

Main categories:

| Category | Examples |
|---|---|
| Courses | BankNifty Option Trading, Market Profile, Intraday Discipline |
| Apps | Imperium Terminal, Replay Tool, CVD Practice Chart |
| Templates / Tools | Journals, Excel sheets, checklists, setup guides |

Each product card should show:

```txt
Product name
One-line outcome
Product type
Price
View Details button
```

Example product card:

```txt
CVD Practice Chart
Replay trading days, study price-volume behavior, and improve execution discipline.
₹999
View Details
```

### Section 3 - Why Imperium

Keep this section short.

Possible points:

```txt
Built for Indian index option traders
Focused on practice and execution
Tools designed around replay and discipline
No noisy theory
Practical trading workflows
```

### Section 4 - CTA

Example:

```txt
Start with one focused tool.
Build a better trading process.
```

Button:

```txt
Explore Products
```

---

## 6. Product Detail Page Structure

Each product needs a dedicated page.

Example URLs:

```txt
/products/cvd-practice-chart
/products/banknifty-options-execution-system
/products/imperium-terminal
```

Each product page should include:

1. Product title
2. Short promise / outcome
3. Who it is for
4. What problem it solves
5. What is included
6. Screenshots or demo video
7. Price
8. Buy button
9. FAQ
10. Disclaimer

Example product page layout:

```txt
[Product Title]
[Short benefit statement]
[Buy Now button]

Who this is for
What you get
How it helps
Screenshots / Demo
Price
FAQ
Disclaimer
```

---

## 7. MVP Feature List

Build only the important version first.

| Feature | Required for MVP? | Notes |
|---|---:|---|
| Homepage | Yes | Brand and main CTA. |
| Product listing | Yes | Show all available products. |
| Product detail page | Yes | Explain each product clearly. |
| Razorpay checkout | Yes | Payment collection. |
| Purchase confirmation | Yes | Show success/failure after payment. |
| User login | Yes | Needed for access control. |
| My Purchases page | Yes | User sees purchased products. |
| Protected downloads | Yes | Only paid users can download apps/files. |
| Admin product entry | No, later | Hardcode products first. |
| Coupon system | No, later | Add after sales flow works. |
| Subscription billing | No, later | Add after one-time products work. |
| Full LMS | No, later | Start simple. |

MVP goal:

```txt
Show product -> take payment -> unlock product access.
```

---

## 8. User Purchase Flow

Correct flow:

```txt
Visitor opens website
        ↓
Views product
        ↓
Clicks Buy Now
        ↓
Logs in / creates account
        ↓
Pays through Razorpay
        ↓
Razorpay webhook confirms payment
        ↓
Backend marks purchase as paid
        ↓
Product access unlocks
        ↓
User sees download/course in dashboard
```

Important rule:

> Never unlock product access only from frontend payment success.

Correct security flow:

```txt
Razorpay payment success
        ↓
Webhook hits backend
        ↓
Backend verifies signature
        ↓
Database marks purchase as paid
        ↓
Dashboard unlocks access
```

Reason:

Frontend payment success can be manipulated. Webhook verification is the trusted confirmation.

---

## 9. Database Design

### Table: products

```txt
id
slug
name
type              course | app | template
short_description
description
price
currency
is_active
created_at
```

### Table: purchases

```txt
id
user_id
product_id
razorpay_order_id
razorpay_payment_id
status            pending | paid | failed | refunded
amount
currency
created_at
paid_at
```

### Table: product_files

```txt
id
product_id
file_name
file_path
version
platform          linux | windows | mac | pdf | zip
is_active
created_at
```

### Table: licenses

```txt
id
user_id
product_id
license_key
machine_limit
status            active | disabled | expired
created_at
expires_at
```

### Table: course_lessons

```txt
id
product_id
title
video_url
sort_order
is_preview
created_at
```

### Table: coupons - Later

```txt
id
code
discount_type     percentage | fixed
discount_value
max_uses
used_count
expires_at
is_active
created_at
```

---

## 10. Course Video Handling

Do not upload raw course MP4 files into a public folder.

Options:

| Option | Best For | Protection Level |
|---|---|---|
| YouTube unlisted | Cheapest first version | Weak |
| Vimeo private | Simple paid course hosting | Medium |
| Mux | Professional secure video | Strong |
| Cloudflare Stream | Professional streaming | Strong |

First version recommendation:

```txt
Use protected course pages first.
Use private/unlisted video only for early validation.
Upgrade to proper secure video hosting later.
```

Course access should be controlled by dashboard permissions.

---

## 11. App Download Handling

For app products, the dashboard should display something like:

```txt
Imperium Terminal
Version: 1.0.2
Download Linux AppImage
Download Windows Installer
License Key: XXXX-XXXX-XXXX
```

Correct private download flow:

```txt
App file stored privately
        ↓
User clicks Download
        ↓
Backend checks purchase
        ↓
Backend creates temporary signed download link
        ↓
User downloads
```

Avoid:

```txt
Permanent public download URLs
Files inside /public folder
Download links visible to everyone
```

---

## 12. Languages and What They Are Used For

### TypeScript

Use TypeScript for the main website.

Used for:

```txt
Frontend logic
Backend API routes
Payment verification
Dashboard logic
Auth logic
Product access rules
```

### React / JSX

Used to build reusable UI components.

Example components:

```txt
HeroSection
ProductCard
PricingBox
DashboardLayout
TerminalPreview
DownloadButton
CourseLessonList
```

### Tailwind CSS

Used for styling the website quickly and cleanly.

Example:

```tsx
<button className="bg-cyan-400 text-black px-5 py-3 font-semibold">
  Buy Now
</button>
```

### SQL

Used for database queries.

Example:

```sql
select *
from purchases
where user_id = 'user-id'
and status = 'paid';
```

### Python

Python is not needed for the main website.

Use Python for:

```txt
Trading desktop apps
Data processing
Chart/replay tools
License validation helpers
Internal scripts
```

Website stack should remain TypeScript-first.

---

## 13. Suggested Project Folder Structure

```txt
imperium-store/
  app/
    page.tsx
    products/
      page.tsx
      [slug]/
        page.tsx
    dashboard/
      page.tsx
    checkout/
      success/
        page.tsx
      failed/
        page.tsx
    login/
      page.tsx
    api/
      razorpay/
        create-order/
          route.ts
        webhook/
          route.ts
      downloads/
        [fileId]/
          route.ts

  components/
    Hero.tsx
    ProductCard.tsx
    PricingBox.tsx
    DashboardLayout.tsx
    TerminalPreview.tsx
    DownloadButton.tsx

  lib/
    supabase.ts
    razorpay.ts
    auth.ts
    products.ts
    purchases.ts
    downloads.ts

  styles/
    globals.css

  types/
    product.ts
    purchase.ts
    license.ts

  docs/
    IMPERIUM_STORE_PLAN.md
```

Recommended location for this document inside the project:

```txt
docs/IMPERIUM_STORE_PLAN.md
```

Alternative if you want it at the project root:

```txt
IMPERIUM_STORE_PLAN.md
```

---

## 14. Pages to Build First

### Phase 1 Pages

```txt
/
```

Homepage.

```txt
/products
```

All products.

```txt
/products/[slug]
```

Individual product detail page.

```txt
/login
```

User login/signup.

```txt
/dashboard
```

Purchased products and downloads.

```txt
/checkout/success
```

Payment success page.

```txt
/checkout/failed
```

Payment failed page.

---

## 15. Product Strategy

Start with three product levels.

### 1. Free Lead Magnet

```txt
Name: Imperium Option Buyer Checklist
Price: Free
Purpose: Collect emails and build trust
```

### 2. Low-Ticket Product

```txt
Name: CVD Practice Chart / Replay Tool
Price: ₹499-₹999
Purpose: Easy first purchase
```

### 3. Main Product

```txt
Name: BankNifty Options Execution System
Price: ₹2,999-₹7,999
Purpose: Main revenue product
```

Later products:

```txt
Imperium Terminal Pro
Market Profile Course
Options Buyer Discipline Framework
Trade Replay Lab
Imperium Trader Toolkit
```

---

## 16. Admin Panel Plan

Do not build the full admin panel first.

Start by hardcoding products in code:

```ts
export const products = [
  {
    slug: "cvd-practice-chart",
    name: "CVD Practice Chart",
    price: 999,
    type: "app",
  },
  {
    slug: "banknifty-options-execution-system",
    name: "BankNifty Options Execution System",
    price: 2999,
    type: "course",
  },
];
```

Later, build admin routes:

```txt
/admin/products
/admin/orders
/admin/users
/admin/licenses
/admin/coupons
```

Admin features to add later:

```txt
Create/edit products
Upload product files
View purchases
Generate license keys
Disable access
Create coupons
View sales metrics
```

---

## 17. Legal and Trust Pages

Because the store is trading-related, include these pages:

```txt
/disclaimer
/refund-policy
/terms
/privacy-policy
/contact
/support
```

Required disclaimer idea:

```txt
This content is for educational purposes only. It is not investment advice. Trading involves risk. Past performance does not guarantee future results.
```

Important principles:

```txt
Do not guarantee profits.
Do not claim fixed income.
Do not show unrealistic results.
Use educational positioning.
Make refund rules clear.
Provide contact/support details.
```

---

## 18. Implementation Roadmap

### Week 1 - Visual and Structure

Build:

```txt
Homepage
Product listing
Product detail page
Dark terminal design
Responsive mobile layout
```

Do not add payment yet.

### Week 2 - Auth and Database

Build:

```txt
Supabase Auth
User dashboard
Products table
Purchases table
Basic access checking
```

### Week 3 - Payment

Build:

```txt
Razorpay order creation
Payment success page
Webhook verification
Paid purchase unlock
```

### Week 4 - Protected Access

Build:

```txt
My Purchases page
Private downloads
Course lesson access
License key display
```

### Week 5 - Polish

Add:

```txt
FAQ
Testimonials
Demo video
Refund policy
Email receipt
Basic analytics
SEO metadata
Better dashboard UI
```

---

## 19. Simple Architecture

```txt
Next.js Website
    |
    |-- Landing Pages
    |-- Product Pages
    |-- Dashboard
    |-- API Routes
          |
          |-- Razorpay order creation
          |-- Razorpay webhook verification
          |-- Download access check
          |-- License generation

Supabase
    |
    |-- Auth
    |-- Postgres Database
    |-- Storage

Razorpay
    |
    |-- Checkout
    |-- Payment Webhook

Vercel
    |
    |-- Hosting
    |-- Server Functions
```

---

## 20. First Build Target

Build this as version 1:

```txt
Imperium Store v1

Homepage
Products page
One product page
Login
Razorpay checkout
Dashboard
Download access
```

First paid product:

```txt
CVD Practice Chart
```

Then expand to:

```txt
BankNifty Options Execution System
Imperium Terminal
Replay Tools
Market Profile Course
```

Final direction:

> Minimal premium dark store with trading-terminal aesthetics, built in Next.js, powered by Supabase, and monetized through Razorpay.

---

## 21. Practical First Task List

Use this as the actual coding checklist.

### Step 1 - Create Project

```bash
npx create-next-app@latest imperium-store
```

Recommended options:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
App Router: Yes
src directory: Optional
Import alias: Yes
```

### Step 2 - Add Basic Brand Theme

Create:

```txt
Global dark background
Cyan accent color
Reusable Button component
Reusable Container component
Reusable ProductCard component
```

### Step 3 - Add Product Data

Start with hardcoded products in:

```txt
lib/products.ts
```

### Step 4 - Build Pages

Build:

```txt
app/page.tsx
app/products/page.tsx
app/products/[slug]/page.tsx
```

### Step 5 - Add Auth

Connect Supabase Auth.

Build:

```txt
app/login/page.tsx
app/dashboard/page.tsx
```

### Step 6 - Add Razorpay

Build API routes:

```txt
app/api/razorpay/create-order/route.ts
app/api/razorpay/webhook/route.ts
```

### Step 7 - Add Paid Access

After webhook verifies payment, insert/update purchase record:

```txt
status = paid
```

Dashboard should only show products where purchase status is paid.

### Step 8 - Add Protected Download

Build:

```txt
app/api/downloads/[fileId]/route.ts
```

This route should:

```txt
Check logged-in user
Check paid purchase
Create signed file URL
Return download link
```

---

## 22. Long-Term Expansion Ideas

Future upgrades:

```txt
Coupons
Affiliate links
Subscription products
App auto-update system
License activation server
Course progress tracking
Community access
Private Discord/Telegram integration
Order invoices
GST invoice support
Analytics dashboard
Email automation
```

Do not build these in the first version.

The priority order should be:

```txt
1. Product page
2. Payment
3. Access unlock
4. Download/course dashboard
5. Trust/legal pages
6. Admin tools
7. Advanced sales features
```

---

## 23. Key Principles for This Project

1. Minimal beats complex.
2. Trust beats hype.
3. Product outcome should be clear in 5 seconds.
4. Never unlock access from frontend-only payment success.
5. Start with hardcoded products, then move to database/admin.
6. Design should match the Imperium trading-terminal identity.
7. Use Razorpay first because the audience is likely Indian traders.
8. Keep the first version focused on one product and one clean checkout flow.
9. Avoid fake profit promises.
10. Build the system so apps, courses, and licenses can all fit later.

---

## 24. Recommended File Name

Keep this file in the project as:

```txt
docs/IMPERIUM_STORE_PLAN.md
```

Or at root:

```txt
IMPERIUM_STORE_PLAN.md
```

