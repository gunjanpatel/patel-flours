import type { CartItem } from '~/utils/config'

const cart = ref<CartItem[]>([])

function sanitize(items: CartItem[]): CartItem[] {
  return items.filter(
    (item) =>
      item &&
      typeof item.sku === 'string' &&
      item.sku.trim() !== '' &&
      typeof item.name === 'string' &&
      item.name.trim() !== '' &&
      typeof item.price === 'number' &&
      !isNaN(item.price) &&
      item.price >= 0 &&
      typeof item.qty === 'number' &&
      item.qty > 0
  )
}

export function useCart() {
  const count = computed(() => sanitize(cart.value).reduce((sum, i) => sum + i.qty, 0))
  const total = computed(() =>
    sanitize(cart.value).reduce((sum, i) => sum + i.price * i.qty, 0)
  )

  function add(item: CartItem) {
    if (!item || !item.sku || !item.name) return
    const existing = cart.value.find(
      (c) => c.sku === item.sku && c.variant === item.variant
    )
    if (existing) {
      existing.qty += item.qty > 0 ? item.qty : 1
    } else {
      cart.value.push({
        ...item,
        qty: item.qty > 0 ? item.qty : 1,
        variant: item.variant || '',
      })
    }
    cart.value = sanitize(cart.value)
  }

  function updateQty(sku: string, variant: string, qty: number) {
    const item = cart.value.find((c) => c.sku === sku && c.variant === variant)
    if (!item) return
    if (qty <= 0) {
      remove(sku, variant)
    } else {
      item.qty = qty
    }
    cart.value = sanitize(cart.value)
  }

  function remove(sku: string, variant: string) {
    cart.value = sanitize(
      cart.value.filter((c) => !(c.sku === sku && c.variant === variant))
    )
  }

  function clear() {
    cart.value = []
  }

  return { cart: readonly(cart), count, total, add, updateQty, remove, clear }
}
