<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
    <!-- Header -->
    <div class="mb-10">
      <p class="text-xs font-medium text-accent-500 uppercase tracking-widest mb-2">Our Range</p>
      <h1 class="font-serif text-4xl sm:text-5xl text-stone-800 mb-3">All Products</h1>
      <p class="text-stone-500 max-w-lg">Carefully curated organic grains, seeds, and superfoods for your daily nourishment.</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <div v-for="i in 8" :key="i" class="bg-white rounded-2xl h-72 animate-pulse border border-stone-100" />
    </div>

    <!-- Empty from sheet (fall back to static) -->
    <div v-else-if="displayProducts.length === 0" class="text-center py-24">
      <p class="text-stone-400 text-sm">No products found. Configure your Google Sheet ID in <code class="bg-stone-100 px-1.5 py-0.5 rounded text-xs">utils/config.ts</code>.</p>
    </div>

    <!-- Product grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <ProductCard v-for="product in displayProducts" :key="product.sku" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { POPULAR_PRODUCTS } from '~/utils/config'

useHead({ title: 'Products — The Grain Co.' })

const { products } = useProducts()
const pending = ref(true)

onMounted(() => {
  pending.value = false
})

// Show fetched products; fall back to static if sheet isn't configured
const displayProducts = computed(() =>
  products.value.length > 0 ? products.value : POPULAR_PRODUCTS
)
</script>
