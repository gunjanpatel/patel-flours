import type { Product } from '~/utils/config'
import { POPULAR_SKUS } from '~/utils/config'

export function useProducts() {
  const nuxtApp = useNuxtApp()
  const products = computed<Product[]>(() => nuxtApp.$products as Product[] ?? [])

  // Preserves the order defined in POPULAR_SKUS; skips any SKU not yet in the sheet.
  const popularProducts = computed<Product[]>(() => {
    const bySkу = new Map(products.value.map((p) => [p.sku, p]))
    return POPULAR_SKUS.map((sku) => bySkу.get(sku)).filter((p): p is Product => p !== undefined)
  })

  return { products, popularProducts }
}
