import vue from '@vitejs/plugin-vue'

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
    return config
  },
}
