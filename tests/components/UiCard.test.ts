import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiCard from '~/components/UiCard/index.vue'

describe('UiCard', () => {
  it('renders body slot', async () => {
    const wrapper = await mountSuspended(UiCard, {
      slots: { default: 'Card content' },
    })
    expect(wrapper.find('.ui-card__body').text()).toBe('Card content')
  })

  it('renders header and footer slots', async () => {
    const wrapper = await mountSuspended(UiCard, {
      slots: {
        header: 'Header',
        default: 'Body',
        footer: 'Footer',
      },
    })
    expect(wrapper.find('.ui-card__header').text()).toBe('Header')
    expect(wrapper.find('.ui-card__footer').text()).toBe('Footer')
  })

  it('is clickable when prop set', async () => {
    const wrapper = await mountSuspended(UiCard, {
      props: { clickable: true },
      slots: { default: 'Click me' },
    })
    expect(wrapper.find('.ui-card--clickable').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when not clickable', async () => {
    const wrapper = await mountSuspended(UiCard, {
      slots: { default: 'Content' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
