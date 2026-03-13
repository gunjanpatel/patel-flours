# The Grain Co. — Organic Shop

A full-stack Nuxt 3 e-commerce site for an organic food brand.

## Stack
- **Nuxt 3** — SPA mode, static output
- **Nuxt UI + TailwindCSS** — component library & styling
- **Cloudflare Worker + D1** — serverless order API
- **Google Sheets (gviz)** — product catalogue CMS
- **GitHub Pages** — static hosting

---

## Quick Start

```bash
npm install
npm run dev
```

---

## Configuration

### 1. Google Sheet (product catalogue)

1. Create a Google Sheet with columns in this order:
   `sku | name | price | image | short | desc | variants | active`
   - `variants` = comma-separated sizes e.g. `500g,1kg`
   - `active` = `TRUE` or `FALSE`
2. Share the sheet as **Anyone with the link → Viewer**
3. Copy the sheet ID from the URL and paste into `utils/config.ts`:
   ```ts
   export const SHEET_ID = 'YOUR_SHEET_ID_HERE'
   ```

### 2. Cloudflare Worker

```bash
cd cloudflare

# Install wrangler globally if needed
npm install -g wrangler
wrangler login

# Create D1 database
wrangler d1 create organic-shop-db
# ↑ Copy the database_id into wrangler.toml

# Apply schema
wrangler d1 execute organic-shop-db --file=schema.sql

# Update ALLOWED_ORIGIN in wrangler.toml to your GitHub Pages domain

# Deploy
wrangler deploy
# ↑ Copy the Worker URL into utils/config.ts → WORKER_URL
```

### 3. GitHub Pages

1. Push to GitHub
2. Go to **Settings → Pages → Source → GitHub Actions**
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically on every push to `main`

---

## Project Structure

```
organic-shop/
├── assets/css/main.css          # Global styles + Tailwind
├── cloudflare/
│   ├── worker.ts                # Cloudflare Worker (order API)
│   ├── schema.sql               # D1 table schema
│   └── wrangler.toml            # Wrangler config
├── components/
│   ├── NavBar.vue
│   ├── CartDrawer.vue
│   ├── FooterBar.vue
│   ├── ProductCard.vue
│   └── ProductSlider.vue
├── composables/
│   ├── useCart.ts               # Reactive cart with sanitizer
│   └── useProducts.ts
├── layouts/
│   └── default.vue              # Shell: NavBar + CartDrawer + Footer
├── pages/
│   ├── index.vue                # Home (hero, slider, features, CTA)
│   ├── products.vue             # Product grid (Sheet + static fallback)
│   ├── product/[sku].vue        # Product detail
│   ├── checkout.vue             # Checkout form → Worker
│   ├── about.vue
│   └── contact.vue
├── plugins/
│   └── products.client.ts       # Fetches + parses Google Sheet gviz
├── utils/
│   └── config.ts                # Constants, types, POPULAR_PRODUCTS
├── app.vue
├── app.config.ts
├── nuxt.config.ts
└── tailwind.config.ts
```

---

## Colour Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-500` | `#4B7C38` | Primary green |
| `accent-400` | `#D4A15C` | Grain gold |
| `oat` | `#FAF7F2` | Background |

---

## Checkout Flow (dev mode)

If `WORKER_URL` is not configured, checkout simulates a successful order locally (generates a fake `GC-XXXXXXXX` ID). No real data is sent.
