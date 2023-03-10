// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: '4Record -- record your records!',
      htmlAttrs: {lang: 'en'},
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        {name: 'viewport', content: 'width=device-width, initial-scale=1'}
      ],
      script: [],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
      ],
      // please note that this is an area that is likely to change
      style: [],
      noscript: []
    }
  },
  runtimeConfig:{
    apiHelloWorldHost: '',
    apiGameHost: '',
  }
})
