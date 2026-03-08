import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'

const projectRoot = resolve(import.meta.dirname, '..')

export default {
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  viteFinal(config) {
    config.plugins = config.plugins || []
    config.plugins.push(vue())
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': projectRoot,
      '@': projectRoot,
    }
    return config
  },
}
