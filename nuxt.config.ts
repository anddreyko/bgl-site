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
  app: {
    head: {
      title: '4Record -- record your records!',
      htmlAttrs: { lang: 'en' },
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      script: [],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      // please note that this is an area that is likely to change
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
  compatibilityDate: '2026-03-05',
})
