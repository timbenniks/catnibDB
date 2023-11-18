export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [],
    }
  }
})
