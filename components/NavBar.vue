<template>
  <nav
    class="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200"
    style="background-color: color-mix(in srgb, var(--bg-page) 90%, transparent); border-color: var(--border)"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <span class="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
          <span class="text-white text-xs font-serif font-bold leading-none text-center">Patel</span>
        </span>
        <span class="font-serif text-xl tracking-tight" style="color: var(--text-primary)">Flours</span>
      </NuxtLink>

      <!-- Desktop links -->
      <div class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium transition-colors hover:text-brand-500"
          style="color: var(--text-secondary)"
          active-class="!text-brand-500"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Right side: theme toggle + cart + hamburger -->
      <div class="flex items-center gap-1">

        <!-- Theme toggle -->
        <button
          class="p-2 rounded-full transition-colors"
          :style="`color: var(--text-secondary)`"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <!-- Sun (shown in dark mode to switch to light) -->
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          <!-- Moon (shown in light mode to switch to dark) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        </button>

        <!-- Cart -->
        <button
          class="relative p-2 rounded-full transition-colors"
          :style="`color: var(--text-secondary)`"
          aria-label="Open cart"
          @click="cartOpen = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
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
          class="md:hidden p-2 rounded-full transition-colors"
          :style="`color: var(--text-secondary)`"
          aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div
        v-if="menuOpen"
        class="md:hidden border-t px-4 pb-4 pt-2 transition-colors duration-200"
        style="border-color: var(--border); background-color: var(--bg-page)"
      >
        <NuxtLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="block py-2.5 text-sm font-medium transition-colors hover:text-brand-500"
          style="color: var(--text-secondary)"
          active-class="!text-brand-500"
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

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
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
