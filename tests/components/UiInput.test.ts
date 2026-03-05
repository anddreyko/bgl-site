import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiInput from '~/components/UiInput/index.vue'

describe('UiInput', () => {
  it('renders with value', async () => {
    const wrapper = await mountSuspended(UiInput, {
      props: { modelValue: 'hello' },
    })
    const input = wrapper.find('.ui-input__field')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = await mountSuspended(UiInput, {
      props: { modelValue: '' },
    })
    await wrapper.find('input').setValue('test')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test'])
  })

  it('shows error state', async () => {
    const wrapper = await mountSuspended(UiInput, {
      props: { modelValue: '', error: true },
    })
    expect(wrapper.find('.ui-input--error').exists()).toBe(true)
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('shows disabled state', async () => {
    const wrapper = await mountSuspended(UiInput, {
      props: { modelValue: '', disabled: true },
    })
    expect(wrapper.find('.ui-input--disabled').exists()).toBe(true)
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
  })
})
