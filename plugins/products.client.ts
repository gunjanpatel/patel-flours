import type { Product } from '~/utils/config'
import type { NuxtApp } from '#app'

// Parses "1 kg:30, 5 kg:149" → { "1 kg": 30, "5 kg": 149 }
// Uses lastIndexOf(':') so keys like "1 kg" with spaces work fine.
function parseVariantPrices(raw: string): Record<string, number> {
  if (!raw) return {}
  return Object.fromEntries(
    raw.split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((pair) => {
        const idx = pair.lastIndexOf(':')
        if (idx === -1) return null
        const key = pair.slice(0, idx).trim()
        const val = parseFloat(pair.slice(idx + 1).trim())
        return key && !isNaN(val) ? [key, val] : null
      })
      .filter((e): e is [string, number] => e !== null)
  )
}

// Returns true if a string looks like a price map: "1 kg:30, 5 kg:149"
function looksLikePriceMap(raw: string): boolean {
  return raw.includes(':')
}

export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
  const config = useRuntimeConfig()
  const sheetId: string = config.public.sheetId ?? ''

  if (!sheetId || sheetId === 'YOUR_SHEET_ID_HERE') {
    console.error('[products] NUXT_PUBLIC_SHEET_ID is not set in .env — cannot load products.')
    nuxtApp.provide('products', [])
    nuxtApp.provide('productsError', 'SHEET_ID_MISSING')
    return
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`

  try {
    const raw = await $fetch<string>(url, { responseType: 'text' })
    const jsonText = raw.replace(/^[^(]+\(/, '').replace(/\);?\s*$/, '')
    const data = JSON.parse(jsonText)
    const table = data?.table
    if (!table) throw new Error('No table in gviz response')

    // Build label→index map from header row (lowercase, trimmed)
    const colIndex: Record<string, number> = {}
    ;(table.cols as any[]).forEach((col: any, i: number) => {
      const label = (col.label ?? col.id ?? '').trim().toLowerCase()
      if (label) colIndex[label] = i
    })

    console.debug('[products] Detected columns:', colIndex)

    const required = ['sku', 'name', 'price', 'active']
    const missing = required.filter((k) => colIndex[k] === undefined)
    if (missing.length) {
      throw new Error(`Sheet is missing required columns: ${missing.join(', ')}`)
    }

    const get = (cells: any[], key: string): string => {
      const i = colIndex[key]
      if (i === undefined) return ''
      const cell = cells[i]
      if (!cell || cell.v === null || cell.v === undefined) return ''
      return String(cell.v).trim()
    }

    const getRaw = (cells: any[], key: string): any => {
      const i = colIndex[key]
      if (i === undefined) return undefined
      return cells[i]?.v ?? undefined
    }

    const products: Product[] = (table.rows as any[])
      .map((row: any) => {
        try {
          const cells = row.c
          if (!cells) return null

          const sku = get(cells, 'sku')
          const name = get(cells, 'name')
          if (!sku || !name) return null

          const priceRaw = getRaw(cells, 'price')
          const price = typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw ?? '0'))

          // --- Variant + price resolution ---
          // Support two sheet layouts:
          //
          // Layout A (separate columns — recommended):
          //   variants:       "1 kg, 5 kg"
          //   variant_prices: "1 kg:30, 5 kg:149"
          //
          // Layout B (single column, price map only):
          //   variants:       "1 kg:30, 5 kg:149"   ← user put price map in variants column
          //   variant_prices: (empty or missing)
          //
          // In both cases we end up with clean variant labels and a price map.

          const variantsRaw = get(cells, 'variants')
          const variantPricesRaw = get(cells, 'variantprices') || get(cells, 'variant_prices')

          let variants: string[]
          let variantPrices: Record<string, number>

          if (variantsRaw && looksLikePriceMap(variantsRaw) && !variantPricesRaw) {
            // Layout B: variants column has the price map, no separate price column
            variantPrices = parseVariantPrices(variantsRaw)
            variants = Object.keys(variantPrices)
          } else {
            // Layout A: variants are clean names, prices in separate column
            variants = variantsRaw
              ? variantsRaw.split(',').map((v: string) => v.trim()).filter(Boolean)
              : []
            variantPrices = parseVariantPrices(variantPricesRaw)
            // If variant_prices has keys not in variants list, add them
            const extraKeys = Object.keys(variantPrices).filter((k) => !variants.includes(k))
            variants = [...variants, ...extraKeys]
          }

          const qtyDefaultRaw = getRaw(cells, 'qtydefault')
          const qtyDefault = typeof qtyDefaultRaw === 'number'
            ? qtyDefaultRaw
            : parseInt(String(qtyDefaultRaw ?? '1'), 10)

          // gviz returns sheet booleans as real JS booleans, not strings
          const activeVal = getRaw(cells, 'active')
          const active = activeVal === true || String(activeVal).toUpperCase() === 'TRUE'

          return {
            sku,
            name,
            price: isNaN(price) ? 0 : price,
            image: get(cells, 'image'),
            short: get(cells, 'short'),
            desc: get(cells, 'desc'),
            variants,
            variantPrices,
            qtyDefault: isNaN(qtyDefault) ? 1 : qtyDefault,
            active,
          } satisfies Product
        } catch {
          return null
        }
      })
      .filter((p): p is Product => p !== null)

    const activeCount = products.filter((p) => p.active).length
    console.info(
      `[products] Loaded ${products.length} products (${activeCount} active, ${products.length - activeCount} discontinued) from Google Sheet.`
    )
    nuxtApp.provide('products', products)
    nuxtApp.provide('productsError', null)
  } catch (e: any) {
    console.error(`[products] Failed to fetch Google Sheet: ${e?.message ?? e}`)
    nuxtApp.provide('products', [])
    nuxtApp.provide('productsError', 'FETCH_FAILED')
  }
})
