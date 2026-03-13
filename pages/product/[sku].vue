<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <!-- Back -->
    <button
      class="flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-600 transition-colors mb-8"
      @click="$router.back()"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
      Back
    </button>

    <!-- Not found -->
    <div v-if="!product" class="text-center py-24 space-y-4">
      <p class="font-serif text-2xl text-stone-400">Product not found</p>
      <NuxtLink to="/products" class="text-sm text-brand-600 underline underline-offset-2">Browse all products</NuxtLink>
    </div>

    <!-- Product detail -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <!-- Image -->
      <div class="rounded-3xl overflow-hidden bg-stone-50 aspect-square">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Info -->
      <div class="space-y-6 lg:pt-4">
        <div>
          <p class="text-xs font-medium text-accent-500 uppercase tracking-widest mb-2">{{ product.sku }}</p>
          <h1 class="font-serif text-4xl text-stone-800 leading-tight mb-3">{{ product.name }}</h1>
          <p class="text-stone-500 leading-relaxed">{{ product.desc || product.short }}</p>
        </div>

        <p class="text-3xl font-semibold text-brand-600">${{ product.price.toFixed(2) }}</p>

        <!-- Variants -->
        <div v-if="product.variants && product.variants.length > 0" class="space-y-2">
          <label class="text-sm font-medium text-stone-700">Size</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="v in product.variants"
              :key="v"
              class="px-4 py-2 rounded-full text-sm border transition-colors"
              :class="selectedVariant === v
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-stone-600 border-stone-200 hover:border-brand-400'"
              @click="selectedVariant = v"
            >
              {{ v }}
            </button>
          </div>
        </div>

        <!-- Quantity -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-stone-700">Quantity</label>
          <div class="flex items-center gap-3">
            <button
              class="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors text-xl leading-none"
              @click="qty = Math.max(1, qty - 1)"
            >−</button>
            <span class="w-8 text-center font-medium text-stone-800">{{ qty }}</span>
            <button
              class="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors text-xl leading-none"
              @click="qty++"
            >+</button>
          </div>
        </div>

        <!-- Add to cart -->
        <div class="flex gap-3 pt-2">
          <button
            class="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-medium py-4 rounded-full transition-colors flex items-center justify-center gap-2"
            @click="addToCart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.889-7.143a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Add to Cart
          </button>
          <NuxtLink
            to="/checkout"
            class="px-6 py-4 rounded-full border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors text-sm flex items-center"
          >
            Buy Now
          </NuxtLink>
        </div>

        <!-- Added confirmation -->
        <Transition name="fade">
          <div v-if="addedFeedback" class="flex items-center gap-2 text-sm text-brand-600 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Added to cart!
          </div>
        </Transition>

        <!-- Features -->
        <div class="border-t border-stone-100 pt-6 grid grid-cols-2 gap-4">
          <div v-for="f in productFeatures" :key="f.label" class="flex items-center gap-2.5">
            <span class="text-base">{{ f.icon }}</span>
            <span class="text-xs text-stone-500">{{ f.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { POPULAR_PRODUCTS } from '~/utils/config'
import type { Product } from '~/utils/config'

const route = useRoute()
const sku = computed(() => route.params.sku as string)

const { products } = useProducts()
const { add } = useCart()
const cartOpen = useState('cart-open', () => false)

const allProducts = computed<Product[]>(() =>
  products.value.length > 0 ? products.value : POPULAR_PRODUCTS
)

const product = computed(() => allProducts.value.find((p) => p.sku === sku.value) ?? null)

useHead(() => ({
  title: product.value ? `${product.value.name} — The Grain Co.` : 'Product — The Grain Co.',
}))

const selectedVariant = ref('')
const qty = ref(1)
const addedFeedback = ref(false)

watch(product, (p) => {
  if (p?.variants?.length) selectedVariant.value = p.variants[0]
}, { immediate: true })

function addToCart() {
  if (!product.value) return
  add({
    sku: product.value.sku,
    name: product.value.name,
    image: product.value.image,
    price: product.value.price,
    variant: selectedVariant.value,
    qty: qty.value,
  })
  addedFeedback.value = true
  setTimeout(() => {
    addedFeedback.value = false
    cartOpen.value = true
  }, 800)
}

const productFeatures = [
  { icon: '🌱', label: 'Certified Organic' },
  { icon: '🧪', label: 'Lab Tested' },
  { icon: '🚚', label: 'Fast Dispatch' },
  { icon: '♻️', label: 'Eco Packaging' },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
