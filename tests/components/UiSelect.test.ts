import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiSelect from '~/components/UiSelect/index.vue'

const options = [
  { value: 'strategy', label: 'Strategy' },
  { value: 'party', label: 'Party' },
]

describe('UiSelect', () => {
  it('renders trigger element', async () => {
    const wrapper = await mountSuspended(UiSelect, {
      props: { modelValue: '', options, placeholder: 'Choose...' },
    })
    expect(wrapper.find('.ui-select__trigger').exists()).toBe(true)
  })

  it('shows error state', async () => {
    const wrapper = await mountSuspended(UiSelect, {
      props: { modelValue: '', options, error: true },
    })
    expect(wrapper.find('.ui-select__trigger--error').exists()).toBe(true)
  })
})
