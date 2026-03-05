import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiBadge from '~/components/UiBadge/index.vue'

describe('UiBadge', () => {
  it('renders with default variant', async () => {
    const wrapper = await mountSuspended(UiBadge, {
      slots: { default: 'Test' },
    })
    expect(wrapper.find('.ui-badge').exists()).toBe(true)
    expect(wrapper.find('.ui-badge--default').exists()).toBe(true)
    expect(wrapper.text()).toBe('Test')
  })

  it('renders with success variant', async () => {
    const wrapper = await mountSuspended(UiBadge, {
      props: { variant: 'success' },
      slots: { default: 'OK' },
    })
    expect(wrapper.find('.ui-badge--success').exists()).toBe(true)
  })

  it('renders with danger variant', async () => {
    const wrapper = await mountSuspended(UiBadge, {
      props: { variant: 'danger' },
      slots: { default: 'Error' },
    })
    expect(wrapper.find('.ui-badge--danger').exists()).toBe(true)
  })
})
