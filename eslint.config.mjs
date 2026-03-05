import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': ['error', {
        html: { void: 'always', normal: 'always', component: 'always' },
      }],
    },
  },
  {
    ignores: [
      '**',
      '!components/**',
      '!composables/**',
      '!layouts/**',
      '!pages/**',
      '!server/**',
      '!utils/**',
      '!tests/**',
      '!e2e/**',
      '!.storybook/**',
      '!*.config.ts',
      '!*.config.mjs',
      'e2e/.features-gen/**',
    ],
  },
)
