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
    public: {
      supaseImgBase: process.env.SUPABASE_IMG_BASE
    }
  }
})
