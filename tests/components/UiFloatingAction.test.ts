import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiFloatingAction from '~/components/UiFloatingAction/index.vue'

describe('UiFloatingAction', () => {
  it('renders with default label', async () => {
    const wrapper = await mountSuspended(UiFloatingAction)
    expect(wrapper.find('.ui-fab').exists()).toBe(true)
    expect(wrapper.find('.ui-fab__label').text()).toBe('Record')
  })

  it('renders with custom label', async () => {
    const wrapper = await mountSuspended(UiFloatingAction, {
      props: { label: 'Start' },
    })
    expect(wrapper.find('.ui-fab__label').text()).toBe('Start')
  })

  it('applies active class when active', async () => {
    const wrapper = await mountSuspended(UiFloatingAction, {
      props: { active: true },
    })
    expect(wrapper.find('.ui-fab--active').exists()).toBe(true)
  })

  it('emits click event', async () => {
    const wrapper = await mountSuspended(UiFloatingAction)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
