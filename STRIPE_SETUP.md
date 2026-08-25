# Stripe setup (VSO Clinic)

Payments use **Stripe Checkout** (hosted page) in **EUR**. WhatsApp stays available next to **Buy now**.

## 1. Create a Stripe account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Complete business details (you can start in **Test mode**)
3. Stay in **Test mode** (toggle in the Dashboard) until you are ready for real charges

## 2. Add API keys to `.env.local`

From [API keys](https://dashboard.stripe.com/test/apikeys):

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

For production (Vercel), set the same vars plus:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Use **live** keys (`sk_live_…` / `pk_live_…`) only after testing.

## 3. Create the `orders` table in Supabase

In the Supabase SQL editor, run:

`scripts/orders_setup.sql`

## 4. Product prices

Checkout parses the product `price` string into EUR cents.

**Works:** `997`, `997.00`, `997€`, `€997`, `1,250.00`  
**Fails:** empty, `N/A`, non-numeric text

Prefer plain numbers in admin (e.g. `997` or `149.50`).

## 5. Local webhook (required for “paid” status)

Stripe must notify your app after payment.

```bash
# Install once: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_…` value into `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.

## 6. Test a purchase

1. `npm run dev`
2. Open a product → **Buy now**
3. Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC
4. You should land on `/checkout/success`
5. In Supabase, the row in `orders` should become `paid` after the webhook fires

## 7. Production webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:

- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `checkout.session.expired`
- Put the endpoint signing secret in `STRIPE_WEBHOOK_SECRET` on Vercel

## Flow (what we built)

1. Product page → **Buy now** → `POST /api/checkout`
2. Server creates a pending `orders` row + Stripe Checkout Session
3. Customer pays on Stripe
4. Webhook marks the order `paid`
5. Customer returns to `/checkout/success` (or `/checkout/cancel`)
