<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-12">
    <!-- Header -->
    <div class="mb-10">
      <p class="text-xs font-medium text-accent-500 uppercase tracking-widest mb-2">Almost There</p>
      <h1 class="font-serif text-4xl text-stone-800">Checkout</h1>
    </div>

    <!-- Empty cart -->
    <div v-if="safeCart.length === 0 && !orderSuccess" class="text-center py-20 space-y-4">
      <div class="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.889-7.143a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      </div>
      <p class="text-stone-500">Your cart is empty.</p>
      <NuxtLink to="/products" class="inline-block bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-7 py-3 rounded-full transition-colors">
        Shop Now
      </NuxtLink>
    </div>

    <!-- Success -->
    <Transition name="fade">
      <div v-if="orderSuccess" class="text-center py-16 space-y-5">
        <div class="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 class="font-serif text-3xl text-stone-800">Order Placed!</h2>
        <p class="text-stone-500 text-sm">Thank you for your order. We'll be in touch shortly.</p>
        <div class="bg-stone-50 rounded-2xl px-6 py-4 inline-block">
          <p class="text-xs text-stone-400 mb-1">Order ID</p>
          <p class="font-mono text-brand-600 font-semibold text-lg">{{ orderId }}</p>
        </div>
        <div class="pt-2">
          <NuxtLink to="/products" class="inline-block bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-7 py-3 rounded-full transition-colors">
            Continue Shopping
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Checkout form -->
    <div v-if="safeCart.length > 0 && !orderSuccess" class="space-y-8">
      <!-- Order summary -->
      <div class="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
        <h2 class="font-serif text-xl text-stone-800">Order Summary</h2>
        <div class="divide-y divide-stone-50">
          <div
            v-for="item in safeCart"
            :key="`${item.sku}-${item.variant}`"
            class="flex items-center gap-4 py-3"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              loading="lazy"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-stone-800 truncate">{{ item.name }}</p>
              <p v-if="item.variant" class="text-xs text-stone-400">{{ item.variant }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-semibold text-stone-800">${{ (item.price * item.qty).toFixed(2) }}</p>
              <p class="text-xs text-stone-400">× {{ item.qty }}</p>
            </div>
          </div>
        </div>
        <div class="border-t border-stone-100 pt-3 flex justify-between items-center">
          <span class="text-stone-600 font-medium">Total</span>
          <span class="text-xl font-semibold text-brand-600">${{ total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Contact details -->
      <div class="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
        <h2 class="font-serif text-xl text-stone-800">Your Details</h2>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-stone-700" for="name">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Jane Smith"
            class="w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none"
            :class="errors.name ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-brand-400'"
            @input="errors.name = ''"
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-stone-700" for="phone">Phone Number</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="+1 555 012 3456"
            class="w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none"
            :class="errors.phone ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-brand-400'"
            @input="errors.phone = ''"
          />
          <p v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</p>
        </div>
      </div>

      <!-- API error -->
      <div v-if="apiError" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
        {{ apiError }}
      </div>

      <!-- Submit -->
      <button
        class="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-4 rounded-full transition-colors flex items-center justify-center gap-2"
        :disabled="submitting"
        @click="submitOrder"
      >
        <svg v-if="submitting" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        {{ submitting ? 'Placing Order…' : 'Place Order' }}
      </button>

      <p class="text-center text-xs text-stone-400">
        By placing an order you agree to our terms of service.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WORKER_URL } from '~/utils/config'

useHead({ title: 'Checkout — The Grain Co.' })

const { cart, total, clear } = useCart()

const safeCart = computed(() =>
  cart.value.filter((item) => item && item.sku && item.name && item.price >= 0)
)

const form = reactive({ name: '', phone: '' })
const errors = reactive({ name: '', phone: '' })
const submitting = ref(false)
const apiError = ref('')
const orderSuccess = ref(false)
const orderId = ref('')

const PHONE_RE = /^\+?[0-9\s\-().]{8,15}$/

function validate(): boolean {
  let valid = true
  if (!form.name.trim()) {
    errors.name = 'Name is required.'
    valid = false
  }
  const digits = form.phone.replace(/\D/g, '')
  if (!PHONE_RE.test(form.phone.trim()) || digits.length < 8 || digits.length > 15) {
    errors.phone = 'Enter a valid phone number (8–15 digits).'
    valid = false
  }
  return valid
}

async function submitOrder() {
  if (!validate()) return
  submitting.value = true
  apiError.value = ''

  try {
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      items: safeCart.value.map((i) => ({
        sku: i.sku,
        name: i.name,
        variant: i.variant,
        qty: i.qty,
        price: i.price,
      })),
      total: total.value,
    }

    const workerBase = WORKER_URL && WORKER_URL !== '<WORKER_URL>' ? WORKER_URL : null

    if (!workerBase) {
      // Dev mode: simulate success
      await new Promise((r) => setTimeout(r, 800))
      orderId.value = `GC-${Date.now().toString(36).toUpperCase()}`
      orderSuccess.value = true
      clear()
      return
    }

    const res = await $fetch<{ success: boolean; orderId: string }>(`${workerBase}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })

    if (res.success) {
      orderId.value = res.orderId
      orderSuccess.value = true
      clear()
    } else {
      apiError.value = 'Something went wrong. Please try again.'
    }
  } catch (e: any) {
    apiError.value = e?.data?.error ?? 'Failed to place order. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
