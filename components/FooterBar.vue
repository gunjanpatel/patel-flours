<template>
  <footer class="bg-stone-800 text-stone-300 mt-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
      <!-- Col 1: Brand -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
            <span class="text-white text-sm font-serif font-bold">G</span>
          </span>
          <span class="font-serif text-xl text-white">The Grain Co.</span>
        </div>
        <p class="text-sm leading-relaxed text-stone-400">
          Sourcing the finest organic grains, seeds, and superfoods from sustainable farms around the world.
        </p>
        <div class="flex gap-3 pt-1">
          <a href="#" aria-label="Instagram" class="w-8 h-8 rounded-full bg-stone-700 hover:bg-brand-500 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="#" aria-label="Facebook" class="w-8 h-8 rounded-full bg-stone-700 hover:bg-brand-500 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>

      <!-- Col 2: Quick links -->
      <div>
        <h4 class="text-white font-medium mb-4">Quick Links</h4>
        <ul class="space-y-2.5">
          <li v-for="link in NAV_LINKS" :key="link.to">
            <NuxtLink :to="link.to" class="text-sm text-stone-400 hover:text-white transition-colors">
              {{ link.label }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/checkout" class="text-sm text-stone-400 hover:text-white transition-colors">
              Checkout
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Col 3: Contact -->
      <div>
        <h4 class="text-white font-medium mb-4">Get in Touch</h4>
        <ul class="space-y-2.5 text-sm text-stone-400">
          <li class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
            hello@thegrainco.com
          </li>
          <li class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6z" /></svg>
            +1 (555) 012-3456
          </li>
          <li class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
            123 Harvest Lane, Farmsville, CA
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-stone-700 py-5 text-center text-xs text-stone-500">
      © {{ new Date().getFullYear() }} The Grain Co. All rights reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
import { NAV_LINKS } from '~/utils/config'
</script>
