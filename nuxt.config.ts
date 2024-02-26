export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@nuxtjs/sitemap',
    'nuxt-simple-robots'
  ],
  site: {
    url: 'https://wordabulary.fun'
  },
  ui: {
    icons: ['heroicons', 'simple-icons']
  }
})
