export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'trlm',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }     
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    { src: '~assets/css/main.css' },
    { src: '~assets/css/responsive.css' }
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~plugins/resize.client.js',
    '~plugins/filters.js',
    '~plugins/vue-js-modal.js',
    '~plugins/vue-the-mask.js',
    '~plugins/vuelidate.js',
    '~plugins/vue-debounce.js',
    '~plugins/v-click-outside.js',
    '~plugins/properties.js',
    {src: '~plugins/sticky-sidebar.js', ssr: false}
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/router',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
