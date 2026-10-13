export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  typescript: { strict: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL
  },
  app: {
    head: {
      title: 'Little Quest — Unlock the magic',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#fff9ed' },
        { name: 'description', content: 'Unlock more stories, games and little adventures.' }
      ]
    }
  }
})