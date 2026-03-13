export const SITE_NAME = 'The Grain Co.'
export const SITE_TAGLINE = 'Organic & Natural Foods'

// Replace <SHEET_ID> with your actual Google Sheet ID
export const SHEET_ID = '1ArKolommKf0yKAuXA4tEsnjqD9Cn3bTXGnJxitSrXjA'
export const PRODUCTS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`

// Replace with your deployed Cloudflare Worker URL
export const WORKER_URL = '<WORKER_URL>'

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

// Static popular products for homepage (no external fetch)
export const POPULAR_PRODUCTS: Product[] = [
  {
    sku: 'GRN-001',
    name: 'Ancient Grain Mix',
    price: 12.9,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
    short: 'Quinoa, amaranth & millet blend',
    desc: 'A wholesome blend of ancient grains — quinoa, amaranth, and millet — packed with protein and essential nutrients.',
    variants: ['500g', '1kg', '2kg'],
    active: true,
  },
  {
    sku: 'GRN-002',
    name: 'Rolled Oats Supreme',
    price: 8.5,
    image: 'https://images.unsplash.com/photo-1614961907963-de2e1da01dc7?w=400&q=80',
    short: 'Thick-cut, stone-milled oats',
    desc: 'Stone-milled thick-cut oats with a rich, nutty flavour. Perfect for porridge, granola, and baking.',
    variants: ['750g', '1.5kg'],
    active: true,
  },
  {
    sku: 'GRN-003',
    name: 'Chia Seeds Raw',
    price: 9.95,
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=400&q=80',
    short: 'Omega-3 rich superfood seeds',
    desc: 'Premium raw chia seeds loaded with omega-3 fatty acids, fibre, and antioxidants. Versatile and nutritious.',
    variants: ['300g', '600g'],
    active: true,
  },
  {
    sku: 'GRN-004',
    name: 'Buckwheat Groats',
    price: 7.8,
    image: 'https://images.unsplash.com/photo-1601999109085-01bbb6e79ef5?w=400&q=80',
    short: 'Gluten-free whole grain',
    desc: 'Whole roasted buckwheat groats — a gluten-free, high-protein grain with a delicate earthy taste.',
    variants: ['500g', '1kg'],
    active: true,
  },
  {
    sku: 'GRN-005',
    name: 'Flaxseed Golden',
    price: 6.4,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80',
    short: 'Cold-pressed golden flax',
    desc: 'Golden flaxseeds with a mild, nutty flavour. An excellent plant-based source of omega-3 and dietary fibre.',
    variants: ['400g', '800g'],
    active: true,
  },
  {
    sku: 'GRN-006',
    name: 'Sunflower Seeds',
    price: 5.9,
    image: 'https://images.unsplash.com/photo-1566393028639-6b4e4f7d44e9?w=400&q=80',
    short: 'Raw hulled sunflower kernels',
    desc: 'Raw, hulled sunflower kernels — a great source of vitamin E, healthy fats, and plant protein.',
    variants: ['500g', '1kg'],
    active: true,
  },
]
