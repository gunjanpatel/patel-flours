export const SITE_NAME = 'Patel Flours'
export const SITE_TAGLINE = 'Organic & Natural Foods'

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export interface Product {
  sku: string
  name: string
  price: number
  image: string
  short: string
  desc: string
  variants: string[]
  variantPrices: Record<string, number>
  qtyDefault: number
  active: boolean
}

export interface CartItem {
  sku: string
  name: string
  image: string
  price: number
  variant: string
  qty: number
}

// ─── Popular product SKUs (homepage staff picks) ─────────────────────────────
// Full product data is loaded from Google Sheets at runtime — only SKUs live here.
export const POPULAR_SKUS: string[] = [
  'organic-wheat-flour',
  'gram-flour',
  'multigrain',
  'idli-dosa',
]
