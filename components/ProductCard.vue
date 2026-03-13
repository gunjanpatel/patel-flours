<template>
  <div class="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
    <!-- Image -->
    <NuxtLink :to="`/product/${product.sku}`" class="block overflow-hidden aspect-square bg-stone-50">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </NuxtLink>

    <!-- Body -->
    <div class="p-4 flex flex-col flex-1">
      <NuxtLink :to="`/product/${product.sku}`" class="hover:text-brand-600 transition-colors">
        <h3 class="font-serif text-base text-stone-800 leading-tight mb-1">{{ product.name }}</h3>
      </NuxtLink>
      <p class="text-xs text-stone-400 mb-3 leading-relaxed flex-1">{{ product.short }}</p>
      <div class="flex items-center justify-between mt-auto">
        <span class="text-brand-600 font-semibold text-base">${{ product.price.toFixed(2) }}</span>
        <button
          class="bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5"
          @click.prevent="addToCart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/utils/config'

const props = defineProps<{ product: Product }>()
const { add } = useCart()

function addToCart() {
  add({
    sku: props.product.sku,
    name: props.product.name,
    image: props.product.image,
    price: props.product.price,
    variant: props.product.variants[0] ?? '',
    qty: 1,
  })
}
</script>
