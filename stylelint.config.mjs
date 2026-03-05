export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html/vue',
  ],
  rules: {
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['deep', 'global', 'slotted'],
    }],
    'selector-class-pattern': null,
    'no-empty-source': null,
    'no-descending-specificity': null,
  },
}
