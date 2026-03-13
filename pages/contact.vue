<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-14">
    <div class="mb-10">
      <p class="text-xs font-medium text-accent-500 uppercase tracking-widest mb-2">Say Hello</p>
      <h1 class="font-serif text-4xl sm:text-5xl text-stone-800 mb-3">Get in Touch</h1>
      <p class="text-stone-500 max-w-md">We'd love to hear from you. Whether it's a question about an order, a product, or just a chat about organic food — we're here.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-12">
      <!-- Contact info -->
      <div class="md:col-span-2 space-y-6">
        <div v-for="info in contactInfo" :key="info.label" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <span class="text-lg">{{ info.icon }}</span>
          </div>
          <div>
            <p class="text-xs text-stone-400 font-medium uppercase tracking-wide mb-1">{{ info.label }}</p>
            <p class="text-sm text-stone-700 leading-relaxed">{{ info.value }}</p>
          </div>
        </div>

        <div class="pt-4 border-t border-stone-100">
          <p class="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">Hours</p>
          <p class="text-sm text-stone-600">Mon–Fri: 9am – 6pm PT</p>
          <p class="text-sm text-stone-600">Sat: 10am – 3pm PT</p>
          <p class="text-sm text-stone-400">Sun: Closed</p>
        </div>
      </div>

      <!-- Form -->
      <div class="md:col-span-3">
        <div v-if="sent" class="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div class="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h3 class="font-serif text-2xl text-stone-800">Message sent!</h3>
          <p class="text-stone-500 text-sm">We'll get back to you within one business day.</p>
          <button class="text-sm text-brand-600 underline underline-offset-2" @click="sent = false">Send another</button>
        </div>

        <form v-else class="space-y-5" @submit.prevent="sendMessage">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-stone-700" for="c-name">Name</label>
              <input
                id="c-name"
                v-model="form.name"
                type="text"
                required
                placeholder="Jane Smith"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-400 text-sm outline-none transition-colors bg-white"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-stone-700" for="c-email">Email</label>
              <input
                id="c-email"
                v-model="form.email"
                type="email"
                required
                placeholder="jane@example.com"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-400 text-sm outline-none transition-colors bg-white"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-stone-700" for="c-subject">Subject</label>
            <select
              id="c-subject"
              v-model="form.subject"
              class="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-400 text-sm outline-none transition-colors bg-white text-stone-700"
            >
              <option value="">Select a topic…</option>
              <option>Order Question</option>
              <option>Product Enquiry</option>
              <option>Wholesale / Bulk</option>
              <option>Feedback</option>
              <option>Other</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-stone-700" for="c-message">Message</label>
            <textarea
              id="c-message"
              v-model="form.message"
              required
              rows="5"
              placeholder="How can we help?"
              class="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-400 text-sm outline-none transition-colors resize-none bg-white"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3.5 rounded-full transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact — The Grain Co.' })

const sent = ref(false)
const form = reactive({ name: '', email: '', subject: '', message: '' })

function sendMessage() {
  // In production, POST to your backend / Worker
  sent.value = true
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
}

const contactInfo = [
  { icon: '📧', label: 'Email', value: 'hello@thegrainco.com' },
  { icon: '📞', label: 'Phone', value: '+1 (555) 012-3456' },
  { icon: '📍', label: 'Address', value: '123 Harvest Lane\nFarmsville, CA 94105' },
]
</script>
