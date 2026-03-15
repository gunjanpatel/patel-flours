# Zero to E-Commerce for (Almost) Free

> A production-ready online shop built entirely on free tiers — static hosting, serverless API, managed database, bot protection, and real-time notifications. Total infrastructure cost: **$0/month**.

This repo is the reference implementation behind a blog post on building lean e-commerce for startups and hobby projects. The idea is simple: stop paying $30-100/month for popular third party hosting who take cut from your profit, when the same outcome is achievable with free-tier cloud services stitched together thoughtfully.

Read about story, cost breakdown and architecture on blog post https://gunjanpatel.info/blog/honey-i-shrunk-the-cloud-bill/

---

## 🛠️ Stack

- **[Nuxt 3](https://nuxt.com)** — SPA mode, generates fully static output
- **[Nuxt UI](https://ui.nuxt.com) + TailwindCSS** — UI components and styling
- **[Cloudflare Workers](https://workers.cloudflare.com)** — Serverless order API, edge-deployed globally
- **[Cloudflare D1](https://developers.cloudflare.com/d1/)** — SQLite-compatible database at the edge
- **[Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)** — CAPTCHA alternative, invisible to real users
- **Google Sheets (gviz API)** — Product CMS, update products without touching code
- **GitHub Pages + Actions** — Hosting and CI/CD pipeline
- **Telegram Bot API** — Order notifications to your phone instantly

---

## ✨ Features

- 🛍️ Product catalogue driven by Google Sheets — add/edit products without deploying
- 🌑 Dark / light mode toggle
- 🇩🇰 Geo-restriction — silently hides purchase flow for non-Danish visitors
- 🤖 Bot protection via Cloudflare Turnstile
- 🚦 Rate limiting — 3 orders per IP per 10 minutes
- 📱 Instant Telegram notification on every order
- 🛒 Persistent cart via localStorage
- 💳 Variant pricing — different prices per size/weight
- 📦 Cash on delivery payment flow
- 🔒 Zero secrets in the repository

---

## 🚀 Setup Guide

### Prerequisites
- [Node.js 20+](https://nodejs.org)
- [Cloudflare account](https://cloudflare.com) (free)
- [GitHub account](https://github.com) (free)
- [Telegram account](https://telegram.org) (free)

---

### 1. Google Sheet — Product Catalogue

1. Create a new Google Sheet with these exact column names in row 1:

   | sku | name | price | image | short | desc | variants | variant_prices | qtyDefault | active |
   |-----|------|-------|-------|-------|------|----------|----------------|------------|--------|
   | wheat-flour | Organic Wheat Flour | 30 | https://... | Fresh stone-milled | Full description | 1 kg, 5 kg | 1 kg:30, 5 kg:149 | 1 | TRUE |

2. **Share** → Anyone with the link → **Viewer**
3. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
4. Add to `.env`:
   ```
   NUXT_PUBLIC_SHEET_ID=your_sheet_id_here
   ```

---

### 2. Cloudflare Worker + D1

```bash
cd cloudflare

# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create your-shop-db
# Copy the database_id into wrangler.toml

# Apply schema
npx wrangler d1 execute your-shop-db --file=schema.sql

# Update wrangler.toml
# - Set ALLOWED_ORIGIN to your domain e.g. https://shop.yourdomain.com
# - Set your custom domain route if applicable

# Deploy worker
npx wrangler deploy
```

Add worker secrets (never stored in code):
```bash
npx wrangler secret put TELEGRAM_TOKEN       # from @BotFather
npx wrangler secret put TELEGRAM_CHAT_ID     # your group/personal chat ID
npx wrangler secret put TURNSTILE_SECRET_KEY # from Cloudflare Turnstile dashboard
```

Add to `.env`:
```
NUXT_PUBLIC_WORKER_URL=https://api.yourdomain.com
```

---

### 3. Cloudflare Turnstile

1. Cloudflare Dashboard → **Turnstile** → Add Site
2. Domain: `yourdomain.com`, Widget type: **Managed**
3. Copy **Site Key** → add to `.env`:
   ```
   NUXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
   ```
4. Copy **Secret Key** → add as worker secret:
   ```bash
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```

---

### 4. Telegram Notifications

1. Message `@BotFather` on Telegram → `/newbot` → follow prompts → copy token
2. Create a group, add your bot, send a message
3. Get your chat ID:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
   Group IDs are negative numbers like `-1001234567890`
4. Add as worker secrets:
   ```bash
   npx wrangler secret put TELEGRAM_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   ```

---

### 5. GitHub Pages + Auto Deploy

1. Push repo to GitHub
2. **Settings → Pages → Source → GitHub Actions**
3. Add GitHub repository secrets:
   - `NUXT_PUBLIC_SHEET_ID`
   - `NUXT_PUBLIC_WORKER_URL`
   - `NUXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `CLOUDFLARE_API_TOKEN` — from Cloudflare → My Profile → API Tokens → Edit Cloudflare Workers template

Every `git push` to `main` automatically:
- Builds and deploys the Nuxt static site to GitHub Pages
- Deploys the Cloudflare Worker

---

## 📁 Project Structure

```
├── .github/workflows/
│   ├── deploy.yml              # Nuxt → GitHub Pages
│   └── deploy-worker.yml       # Worker → Cloudflare
├── assets/css/main.css         # Global styles, CSS vars for dark/light mode
├── cloudflare/
│   ├── worker.ts               # Order API (Turnstile + rate limit + D1 + Telegram)
│   ├── schema.sql              # D1 database schema
│   └── wrangler.toml           # Cloudflare Worker config
├── components/
│   ├── NavBar.vue              # Theme toggle, cart icon (hidden for non-DK)
│   ├── CartDrawer.vue          # Slide-out cart
│   ├── ProductCard.vue         # Card with inline variant selector
│   ├── ProductSlider.vue       # Smart scroll arrows
│   └── TurnstileWidget.vue     # Cloudflare Turnstile integration
├── composables/
│   ├── useCart.ts              # Persistent cart, variant price resolution
│   ├── useProducts.ts          # Sheet data access
│   └── useDenmarkOnly.ts       # Geo-restriction via ip-api.com
├── pages/
│   ├── index.vue               # Home
│   ├── products.vue            # Product grid
│   ├── product/[sku].vue       # Product detail
│   ├── checkout.vue            # Checkout with Turnstile
│   ├── about.vue
│   └── contact.vue
├── plugins/
│   └── products.client.ts      # Google Sheets gviz parser
└── utils/
    ├── config.ts               # Types, constants, SKU list
    └── orderHandler.ts         # Shared order validation (Worker + local dev)
```

---

## 🔒 Security

- **No secrets in the repository** — all sensitive values in Cloudflare Worker secrets or GitHub Actions secrets
- **Cloudflare Turnstile** — bot protection on every order submission
- **Rate limiting** — 3 attempts per IP per 10 minutes in the Worker
- **Geo-restriction** — purchase flow silently hidden for non-Danish visitors
- **CORS** — Worker only accepts requests from your domain
- **Input validation** — server-side validation of all order fields in the Worker

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `brand-500` | `#4B7C38` | Primary green |
| `accent-400` | `#D4A15C` | Grain gold |
| `--bg-page` | `#FAF7F2` / `#141210` | Page background (light/dark) |
| `--bg-surface` | `#FFFFFF` / `#1e1b18` | Card background (light/dark) |

---

## 📝 Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Fill in NUXT_PUBLIC_SHEET_ID at minimum

# Start dev server
npm run dev
# → http://localhost:3000

# Checkout works in dev mode without a Worker
# Orders are saved to .data/orders.db (SQLite)
```

---

*Built as a reference architecture for the blog post: "Production E-Commerce for $0/month — A Startup Stack Nobody Talks About"*
