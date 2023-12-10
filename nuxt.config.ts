export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@nuxt/ui-pro"],
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "@nuxtjs/algolia", "@nuxt/image"],

  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: [],
    }
  },

  algolia: {
    instantSearch: {
      theme: 'reset'
    }
  },

  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dwfcofnrd/image/fetch/'
    }
  },

  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    public: {
      supaseImgBase: process.env.SUPABASE_IMG_BASE,
      algoliaId: process.env.ALGOLIA_APPLICATION_ID,
      algoliaApiKey: process.env.ALGOLIA_API_KEY,
      algoliaIndex: process.env.ALGOLIA_INDEX,
      algoliaAdminApiKey: process.env.ALGOLIA_ADMIN_API_KEY
    }
  }
})
