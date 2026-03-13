import type { Product } from '~/utils/config'

export function useProducts() {
  const nuxtApp = useNuxtApp()
  const products = computed<Product[]>(() => nuxtApp.$products as Product[] ?? [])
  return { products }
}
