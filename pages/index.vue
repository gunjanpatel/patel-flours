<template>
  <div>
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Text -->
        <div class="space-y-6">
          <span
            class="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full border"
            style="color: var(--accent); background-color: var(--accent-bg); border-color: var(--accent-border)"
          >
            Homely Grinded
          </span>
          <h1 class="font-serif text-5xl sm:text-6xl leading-[1.1] tracking-tight" style="color: var(--text-primary)">
            Freshly Ground<br>For You.
          </h1>
          <p class="text-lg leading-relaxed max-w-md" style="color: var(--text-secondary)">
            Enjoy pure, custom-ground flour from small-batch grains — prepared on request and delivered with care.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <NuxtLink
              to="/products"
              class="bg-brand-500 hover:bg-brand-600 text-white font-medium px-7 py-3.5 rounded-full transition-colors text-sm"
            >
              Browse Flour Options
            </NuxtLink>
          </div>
          <!-- Trust badges -->
          <div class="flex flex-wrap gap-5 pt-4">
            <div v-for="badge in badges" :key="badge.label" class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                <span class="text-sm">{{ badge.icon }}</span>
              </span>
              <span class="text-xs font-medium" style="color: var(--text-secondary)">{{ badge.label }}</span>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div class="relative h-96 lg:h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=700&q=85"
            alt="Freshly ground flour"
            class="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
          <!-- Floating card -->
          <div
            class="absolute bottom-6 left-6 backdrop-blur-sm rounded-2xl p-4 shadow-lg flex items-center gap-3"
            style="background-color: color-mix(in srgb, var(--bg-surface) 95%, transparent)"
          >
            <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
              <span class="text-lg">🌾</span>
            </div>
            <div>
              <p class="text-xs font-semibold" style="color: var(--text-primary)">Happy Friends</p>
              <div class="flex gap-0.5 mt-0.5">
                <span v-for="i in 5" :key="i" class="text-accent-400 text-xs">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular products -->
    <section class="py-16 transition-colors duration-200" style="background-color: var(--bg-muted)">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-xs font-medium text-accent-400 uppercase tracking-widest mb-2">Staff Picks</p>
            <h2 class="font-serif text-3xl sm:text-4xl" style="color: var(--text-primary)">Popular Products</h2>
          </div>
          <NuxtLink to="/products" class="text-sm font-medium text-brand-500 hover:text-brand-400 underline underline-offset-2 hidden sm:block">
            View all
          </NuxtLink>
        </div>
        <ProductSlider :products="popularProducts" />
      </div>
    </section>

    <!-- Features strip -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="feature in features" :key="feature.title" class="text-center space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto">
            <span class="text-2xl">{{ feature.icon }}</span>
          </div>
          <h3 class="font-serif text-base" style="color: var(--text-primary)">{{ feature.title }}</h3>
          <p class="text-xs leading-relaxed" style="color: var(--text-muted)">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <div class="bg-brand-500 rounded-3xl px-8 py-12 text-center space-y-5 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%);" />
        <h2 class="font-serif text-3xl sm:text-4xl text-white relative">Ready to eat better?</h2>
        <p class="text-brand-100 text-sm max-w-md mx-auto relative">Fresh flour, milled at home — just for you.</p>
        <NuxtLink
          to="/products"
          class="inline-block bg-white text-brand-700 font-medium px-8 py-3.5 rounded-full hover:bg-stone-50 transition-colors text-sm relative"
        >
          Check Flour Options
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Patel Flours — Organic & Natural Foods' })

const { popularProducts } = useProducts()

const badges = [
  { icon: '🌱', label: 'Organic' },
  { icon: '🚚', label: 'Free Shipping' },
]

const features = []
</script>
