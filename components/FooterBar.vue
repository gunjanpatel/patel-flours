<template>
  <footer class="mt-20 border-t transition-colors duration-200" style="background-color: var(--bg-surface); border-color: var(--border)">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Brand -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center">
            <span class="text-white text-xs font-serif font-bold">Patel</span>
          </span>
          <span class="font-serif text-xl" style="color: var(--text-primary)">Flours</span>
        </div>
        <p class="text-sm leading-relaxed" style="color: var(--text-muted)">
          Small‑batch, freshly ground flour — made on demand for a close circle of friends. Each order is milled individually to ensure freshness, purity, and great taste.
        </p>
      </div>
      <div class="space-y-4">
        <h4 class="font-medium mb-4" style="color: var(--text-primary)">Freshly Ground on Order</h4>
        <p class="text-sm leading-relaxed" style="color: var(--text-muted)">
          Every batch is milled only after you request it, guaranteeing maximum freshness. Choose your flour type, quantity, and any custom mix you need.
        </p>
      </div>

      <!-- Quick links -->
      <div>
        <h4 class="font-medium mb-4" style="color: var(--text-primary)">Quick Links</h4>
        <ul class="space-y-2.5">
          <li v-for="link in NAV_LINKS" :key="link.to">
            <NuxtLink :to="link.to" class="text-sm transition-colors hover:text-brand-500" style="color: var(--text-muted)">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h4 class="font-medium mb-4" style="color: var(--text-primary)">Get in Touch</h4>
        <ul class="space-y-2.5 text-sm" style="color: var(--text-muted)">
          <li>+45 22 29 24 01</li>
        </ul>
      </div>
    </div>
    <div class="border-t py-5 text-center text-xs" style="border-color: var(--border); color: var(--text-muted)">
      © {{ new Date().getFullYear() }} Patel Flours. All rights reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
import { NAV_LINKS } from '~/utils/config'
</script>
