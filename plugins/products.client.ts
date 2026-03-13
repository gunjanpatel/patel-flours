import type { Product } from '~/utils/config'
import { PRODUCTS_URL, SHEET_ID } from '~/utils/config'

function parseGvizRow(row: any): Product | null {
  try {
    const cells = row.c
    if (!cells) return null

    const get = (index: number): string => {
      const cell = cells[index]
      if (!cell || cell.v === null || cell.v === undefined) return ''
      return String(cell.v).trim()
    }

    const sku = get(0)
    const name = get(1)
    const priceRaw = cells[2]?.v
    const image = get(3)
    const short = get(4)
    const desc = get(5)
    const variantsRaw = get(6)
    const activeRaw = get(7)

    if (!sku || !name) return null

    const price = typeof priceRaw === 'number' ? priceRaw : parseFloat(priceRaw ?? '0')
    const variants = variantsRaw
      ? variantsRaw.split(',').map((v: string) => v.trim()).filter(Boolean)
      : []
    const active = activeRaw.toUpperCase() === 'TRUE'

    return { sku, name, price: isNaN(price) ? 0 : price, image, short, desc, variants, active }
  } catch {
    return null
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  let products: Product[] = []

  if (SHEET_ID && SHEET_ID !== '<SHEET_ID>') {
    try {
      const raw = await $fetch<string>(PRODUCTS_URL, { responseType: 'text' })
      const jsonText = raw.replace(/^[^(]+\(/, '').replace(/\);?\s*$/, '')
      const data = JSON.parse(jsonText)
      const rows: any[] = data?.table?.rows ?? []
      products = rows.map(parseGvizRow).filter(Boolean).filter((p) => p!.active) as Product[]
    } catch (e) {
      console.warn('[products] Failed to fetch from Google Sheet:', e)
    }
  }

  nuxtApp.provide('products', products)
})
