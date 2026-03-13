<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-14">
    <div class="mb-10">
      <p class="text-xs font-medium text-accent-400 uppercase tracking-widest mb-2">Say Hello</p>
      <h1 class="font-serif text-4xl sm:text-5xl mb-3" style="color: var(--text-primary)">Get in Touch</h1>
      <p class="max-w-md" style="color: var(--text-secondary)">We'd love to hear from you — questions about an order, a product, or just a chat about organic food.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-12">
      <div class="md:col-span-2 space-y-6">
        <div v-for="info in contactInfo" :key="info.label" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
            <span class="text-lg">{{ info.icon }}</span>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide mb-1" style="color: var(--text-muted)">{{ info.label }}</p>
            <p class="text-sm leading-relaxed" style="color: var(--text-primary)">{{ info.value }}</p>
          </div>
        </div>

        <div class="pt-4 border-t" style="border-color: var(--border)">
          <p class="text-xs font-medium uppercase tracking-wide mb-3" style="color: var(--text-muted)">Hours</p>
          <p class="text-sm" style="color: var(--text-secondary)">Mon–Fri: 9am – 6pm CET</p>
          <p class="text-sm" style="color: var(--text-secondary)">Sat: 10am – 3pm CET</p>
          <p class="text-sm" style="color: var(--text-muted)">Sun: Closed</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact — Patel Flours' })
const contactInfo = [
  { icon: '📞', label: 'Phone', value: '+45 22 29 24 01' },
]
</script>
