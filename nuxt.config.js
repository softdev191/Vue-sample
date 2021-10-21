export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  ssr: true,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        crossorigin: "anonymous",
        src: "https://pro.fontawesome.com/releases/v5.10.0/js/all.js",
        integrity:
          "sha384-G/ZR3ntz68JZrH4pfPJyRbjW+c0+ojii5f+GYiYwldYU69A+Ejat6yIfLSxljXxD",
        defer: true,
      },
      { src: "https://polyfill.io/v3/polyfill.min.js?features=es6" },
      { src: process.env.F_REGI_TOKEN_JS },
      { src: process.env.POSTAL_JS },
      { src: process.env.AMAZON_PAY_WIDGETS_JS, async: true },
    ],
  },
  /*
   ** Global CSS
   */
  css: [{ src: "~assets/mystyles.scss", lang: "scss" }],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: "@/plugins/vue-agile.js", mode: "client" },
    { src: "@/plugins/vuejs-paginate.js", mode: "client" },
    { src: "@/plugins/date-picker.js", mode: "client" },
    "@/plugins/vee-validate",
    "@/plugins/axios",
    "@/plugins/route",
    "@/plugins/api",
    "@/plugins/admin-api",
    "@/plugins/filters",
    "@/plugins/helpers",
    "@/plugins/vue-barcode",
    "@/plugins/lru-cache",
    "@/plugins/dayjs",
    "@/plugins/amazon-pay.js",
    "@/plugins/storage-provider/cart-credential",
  ],
  router: {
    middleware: ["initial-fetch"],
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
    // middleware: ["auth"],
  },
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: false,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
    // Doc: https://github.com/nuxt-community/stylelint-module
    "@nuxtjs/stylelint-module",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/proxy",
    "@nuxtjs/auth",
    "@nuxtjs/style-resources",
    "@nuxtjs/device",
    "nuxt-fontawesome",
    "nuxt-svg-loader",
    "nuxt-lazy-load",
    // [
    //   "nuxt-lazy-load",
    //   {
    //     directiveOnly: true,
    //   },
    // ],
    ["cookie-universal-nuxt"],
    "modules/lruCache",
  ],
  styleResources: {
    scss: [
      "~assets/mystyles.scss", // 読みませたいscssファイルを指定します。
    ],
  },
  fontawesome: {
    component: "fa",
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Auth module configration
   ** See https://auth.nuxtjs.org/
   */
  auth: {
    redirect: {
      login: "/login",
      logout: "/login",
      callback: false,
      home: "/mypage",
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/api/v1/member/auth/password",
            method: "post",
            propertyName: "member_token",
          },
          user: {
            url: "/api/v1/member/auth/me",
            method: "get",
            propertyName: false,
          },
          logout: false,
        },
        tokenType: "Bearer",
      },
      amazon: {
        endpoints: {
          login: {
            url: "/api/v1/member/auth/amazon",
            method: "post",
            propertyName: false,
          },
          user: {
            url: "/api/v1/member/auth/amazon",
            method: "get",
            propertyName: false,
          },
          tokenType: "Bearer",
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    // parallel: true,
    cache: true,
    sourceMap: false,
    // followSymlinks: false,
    // extractCSS: {
    //   ignoreOrder: true
    // },
    optimization: {
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: ".",
        name: "test",
        //   cacheGroups: {},
        maxSize: 256000,
      },
    },
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true,
    },
    html: {
      minify: {
        minifyCSS: false,
        minifyJS: false,
      },
    },
    loaders: {
      scss: { sourceMap: false },
      vue: {
        prettify: false,
      },
    },
    postcss: {
      preset: {
        features: {
          customProperties: false,
        },
      },
    },
    transpile: ["vue-agile", "vee-validate", "vuejs-datepicker"],
    // hardSource: true,
  },
  env: {
    baseUrl: process.env.BASE_URL,
    apiUrl: process.env.API_URL,
    apiUrlBrowser: process.env.API_URL_BROWSER,
    transpile: ["vue-agile", "vee-validate"],
    TSC_WATCHFILE: "UseFsEventsWithFallbackDynamicPolling",
    amazonMerchantId: process.env.AMAZON_MERCHANT_ID,
    amazonStoreId: process.env.AMAZON_STORE_ID,
  },
  server: {
    port: 3000, // デフォルト: 3000
    host: "0.0.0.0", // デフォルト: localhost
  },
  storybook: {
    addons: [
      {
        name: "@storybook/addon-essentials",
        options: {
          actions: false,
        },
      },
    ],
    parameters: {
      layout: "fullscreen",
      backgrounds: {
        default: "gray",
        values: [
          { name: "white", value: "#ffffff" },
          { name: "gray", value: "#aaaaaa" },
        ],
      },
    },
  },
  watch: ["~/modules/*"],
};
