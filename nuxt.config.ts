export default defineNuxtConfig({
  ssr: false,
  debug: true,
  runtimeConfig: {
    public: {
      sheetId: '',
      workerUrl: '',
    },
  },

  modules: ['@nuxt/ui'],

  ui: {
    global: true,
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Patel Flours — Organic & Natural Foods',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Premium organic grains, seeds, and natural foods delivered to your door.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap',
        },
      ],
    },
  },

  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'],
      failOnError: false,
    },
  },

  generate: {
    fallback: '404.html',
  },

  tailwindcss: {
    exposeConfig: true,
  },

  compatibilityDate: '2024-09-20',
})
