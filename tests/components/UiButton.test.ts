import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiButton from '~/components/UiButton/index.vue'

describe('UiButton', () => {
  it('renders with default props', async () => {
    const wrapper = await mountSuspended(UiButton, {
      slots: { default: 'Click' },
    })
    expect(wrapper.find('.ui-button').exists()).toBe(true)
    expect(wrapper.find('.ui-button--primary').exists()).toBe(true)
    expect(wrapper.find('.ui-button--md').exists()).toBe(true)
    expect(wrapper.text()).toBe('Click')
  })

  it('emits click event', async () => {
    const wrapper = await mountSuspended(UiButton, {
      slots: { default: 'Click' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { disabled: true },
      slots: { default: 'Click' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('shows spinner when loading', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { loading: true },
      slots: { default: 'Click' },
    })
    expect(wrapper.find('.ui-button--loading').exists()).toBe(true)
    expect(wrapper.find('.ui-button__spinner').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('applies variant classes', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { variant: 'record' },
      slots: { default: 'Record' },
    })
    expect(wrapper.find('.ui-button--record').exists()).toBe(true)
  })

  it('renders with correct type attribute', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })
})
