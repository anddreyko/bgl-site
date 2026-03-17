import { execFileSync } from 'node:child_process'

function getGitCommitHash(): string {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD']).toString().trim()
  }
  catch {
    return 'unknown'
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vite-pwa/nuxt',
  ],
  app: {
    head: {
      title: '4Record -- record your records!',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1a1a2e' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
      ],
      script: [],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicons/icon-adaptive.svg' },
        { rel: 'apple-touch-icon', href: '/favicons/icon-180x180.png' },
      ],
      style: [],
      noscript: [],
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    apiHost: '',
    public: {
      gitCommitHash: process.env.NUXT_PUBLIC_GIT_COMMIT_HASH || getGitCommitHash(),
      releaseStage: process.env.NUXT_PUBLIC_RELEASE_STAGE || 'alpha',
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '4Record',
      short_name: '4Record',
      description: 'Track your board game plays, stats, and victories',
      theme_color: '#1a1a2e',
      background_color: '#1a1a2e',
      display: 'standalone',
      icons: [
        { src: '/favicons/icon-adaptive.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: '/favicons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/favicons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    devOptions: {
      enabled: true,
    },
    workbox: {
      navigateFallback: undefined,
      runtimeCaching: [
        {
          urlPattern: /^\/api\/mates\?/,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'mates-cache', expiration: { maxAgeSeconds: 86400 } },
        },
        {
          urlPattern: /^\/api\/places\?/,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'places-cache', expiration: { maxAgeSeconds: 86400 } },
        },
        {
          urlPattern: /^\/api\/games\?/,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'games-cache', expiration: { maxEntries: 200, maxAgeSeconds: 86400 } },
        },
      ],
    },
  },
  compatibilityDate: '2026-03-05',
})
