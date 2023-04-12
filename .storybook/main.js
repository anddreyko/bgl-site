module.exports = {
  'stories': [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)'],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm'],
  'framework': {
    name: '@storybook/vue3-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
}
