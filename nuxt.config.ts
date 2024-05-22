// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  app: {
    head: {
      link: [{ rel: "stylesheet", href: '~/public/daterangepicker/daterangepicker.css' }],
      script: [
        { type: "text/javascript", src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js' },
        { type: "text/javascript", src: '~/public/daterangepicker/daterangepicker.js' }
      ]
    },
  },

  ssr: false,
  typescript: {
    shim: false
  },

  build: {
    transpile: ["vuetify", '~/modules/addRoutes'],
  },

  plugins: [
    { src: '~/plugins/vueApexCharts', mode: 'client' },
  ],
  devtools: { enabled: false },

  vite: {
    define: {
      "process.env.DEBUG": false,
      // BASE_URL: process.env.BASE_URL,
      // API_URL : process.env.API_URL
    },
  },

  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
  hooks: {
  },
  modules: [
    '@pinia/nuxt',
  ],

  // automatically import all stores defined within the stores folder. 
  pinia: {
    storesDirs: ['./stores/**'],
  },


  runtimeConfig: {
    // Private keys are only available on the server
    // apiSecret: '123',

    // Public keys that are exposed to the client
    public: {
      googleMapsApi: process.env.GOOGLE_MAPS_API_KEY,
      baseUrl: process.env.APP_URL || 'http://localhost:3000',
      apiUrl: process.env.API_URL || 'http://localhost:8000',
    }
  }
})


