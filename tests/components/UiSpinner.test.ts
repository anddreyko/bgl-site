import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiSpinner from '~/components/UiSpinner/index.vue'

describe('UiSpinner', () => {
  it('renders with default size', async () => {
    const wrapper = await mountSuspended(UiSpinner)
    expect(wrapper.find('.ui-spinner').exists()).toBe(true)
    expect(wrapper.find('.ui-spinner--md').exists()).toBe(true)
  })

  it('renders with specified size', async () => {
    const wrapper = await mountSuspended(UiSpinner, { props: { size: 'lg' } })
    expect(wrapper.find('.ui-spinner--lg').exists()).toBe(true)
  })

  it('has accessible role and label', async () => {
    const wrapper = await mountSuspended(UiSpinner)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('contains svg element', async () => {
    const wrapper = await mountSuspended(UiSpinner)
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
