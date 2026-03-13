<template>
  <div class="relative">
    <!-- Scroll container -->
    <div
      ref="sliderRef"
      class="flex gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
    >
      <div
        v-for="product in products"
        :key="product.sku"
        class="flex-shrink-0 w-56 snap-start"
      >
        <ProductCard :product="product" />
      </div>
    </div>

    <!-- Nav arrows -->
    <button
      class="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center hover:bg-stone-50 transition-colors hidden md:flex"
      aria-label="Scroll left"
      @click="scroll(-1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    </button>
    <button
      class="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center hover:bg-stone-50 transition-colors hidden md:flex"
      aria-label="Scroll right"
      @click="scroll(1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/utils/config'

defineProps<{ products: Product[] }>()

const sliderRef = ref<HTMLElement | null>(null)

function scroll(direction: -1 | 1) {
  if (!sliderRef.value) return
  sliderRef.value.scrollBy({ left: direction * 260, behavior: 'smooth' })
}
</script>
