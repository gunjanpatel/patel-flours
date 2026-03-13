<template>
  <div>
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div class="space-y-6">
          <p class="text-xs font-medium text-accent-500 uppercase tracking-widest">Our Story</p>
          <h1 class="font-serif text-5xl text-stone-800 leading-tight">Rooted in nature, grown with care.</h1>
          <p class="text-stone-500 leading-relaxed">
            The Grain Co. was founded in 2018 by two food scientists who believed that clean eating shouldn't be complicated — or expensive. We set out to build direct relationships with certified organic farms and cut out the middlemen.
          </p>
          <p class="text-stone-500 leading-relaxed">
            Today we work with over 30 farms across North America and Europe, sourcing the finest ancient grains, superseeds, and whole foods. Every product is third-party lab tested before it reaches your door.
          </p>
        </div>
        <div class="rounded-3xl overflow-hidden aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&q=85"
            alt="Organic farm landscape"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="bg-stone-50 py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 class="font-serif text-3xl text-stone-800 text-center mb-12">What we stand for</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div v-for="value in values" :key="value.title" class="text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto">
              <span class="text-3xl">{{ value.icon }}</span>
            </div>
            <h3 class="font-serif text-xl text-stone-800">{{ value.title }}</h3>
            <p class="text-sm text-stone-400 leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h2 class="font-serif text-3xl text-stone-800 mb-10">Meet the team</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div v-for="member in team" :key="member.name" class="bg-white rounded-2xl border border-stone-100 p-6 space-y-3 shadow-sm">
          <img
            :src="member.photo"
            :alt="member.name"
            class="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p class="font-serif text-lg text-stone-800">{{ member.name }}</p>
            <p class="text-xs text-accent-500 font-medium">{{ member.role }}</p>
          </div>
          <p class="text-sm text-stone-400 leading-relaxed">{{ member.bio }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'About Us — The Grain Co.' })

const values = [
  {
    icon: '🌍',
    title: 'Sustainability First',
    desc: 'We work exclusively with farms that use regenerative practices — building soil health, not depleting it.',
  },
  {
    icon: '🔬',
    title: 'Science-Backed Quality',
    desc: 'Every batch is tested by an independent ISO-certified lab for purity, nutrition, and contaminants.',
  },
  {
    icon: '🤝',
    title: 'Fair Trade Always',
    desc: 'Our farmers receive above-market prices. When they thrive, the entire supply chain benefits.',
  },
]

const team = [
  {
    name: 'Sarah Chen',
    role: 'Co-Founder & CEO',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    bio: 'Former food scientist with a passion for making organic nutrition accessible to everyone.',
  },
  {
    name: 'Marcus Okafor',
    role: 'Co-Founder & CTO',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    bio: 'Ag-tech veteran who built our farm-to-door supply chain management system from the ground up.',
  },
  {
    name: 'Leila Ahmadi',
    role: 'Head of Sourcing',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    bio: 'Travels the world building relationships with the best certified organic farms and co-operatives.',
  },
]
</script>
