## Requirements

- Node.js 20.9.0 or newer is required by Next.js 16. Use `nvm use` from the project root to select the version from `.nvmrc` before running npm scripts.
- Project design, palette, product, checkout, and implementation guidance lives in `docs/PROJECT_REFERENCE.md`.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Payment Checkout

The options terminal supports three access purchases:

- First month: ₹199 once per account.
- Later one-month renewals: ₹499. Renewals are customer-initiated and do not auto-debit.
- Lifetime access: ₹6,999. A monthly customer can upgrade at any time.

Before deploying the matching app code, run
`docs/supabase_purchase_access_plans.sql` in the Supabase SQL Editor. The
migration preserves every existing paid purchase as lifetime access, adds
monthly entitlement windows, prevents a second introductory offer, and installs
the atomic payment-activation function used by checkout verification and the
Razorpay webhook.

The terminal itself must authorize the signed-in customer with:

```ts
await supabase.rpc("has_product_access", {
  p_product_id: "imperium-option-trading-terminal",
});
```

Do not authorize the desktop terminal by checking for any historical `paid`
purchase, because a paid monthly row can be expired.

Set these values in `.env.local` before accepting real payments:

```bash
RAZORPAY_KEY_ID=rzp_live_or_test_key
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

For local download testing without Razorpay, temporarily enable:

```bash
TEST_CHECKOUT_ENABLED=true
```

Turn this off or remove it before production deployment. When enabled, paid products unlock immediately after clicking buy.

Razorpay checkout now verifies the browser payment signature on the server and unlocks the matching purchase immediately after payment. The webhook remains the backup confirmation path. In Razorpay Dashboard, point the webhook to:

```text
https://your-domain.com/api/razorpay/webhook
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
