<template>
  <nav class="sticky top-0 z-40 bg-oat/90 backdrop-blur-md border-b border-stone-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <span class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
          <span class="text-white text-sm font-serif font-bold">G</span>
        </span>
        <span class="font-serif text-xl text-brand-700 tracking-tight">The Grain Co.</span>
      </NuxtLink>

      <!-- Desktop links -->
      <div class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors"
          active-class="text-brand-600"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Cart + Mobile menu -->
      <div class="flex items-center gap-3">
        <button
          class="relative p-2 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Open cart"
          @click="cartOpen = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.889-7.143a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <span
            v-if="count > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-semibold flex items-center justify-center"
          >
            {{ count > 9 ? '9+' : count }}
          </span>
        </button>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden p-2 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="md:hidden border-t border-stone-200 bg-oat px-4 pb-4 pt-2">
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="block py-2.5 text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors"
          active-class="text-brand-600"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { NAV_LINKS } from '~/utils/config'

const { count } = useCart()
const cartOpen = useState('cart-open', () => false)
const menuOpen = ref(false)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
