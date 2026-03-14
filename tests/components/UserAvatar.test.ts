import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UserAvatar from '~/components/UserAvatar/index.vue'

describe('UserAvatar', () => {
  it('renders initials from name', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'John Doe' },
    })
    expect(wrapper.text()).toBe('JD')
  })

  it('renders single initial for single word', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'Alice' },
    })
    expect(wrapper.text()).toBe('A')
  })

  it('applies size class', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'John Doe', size: 'lg' },
    })
    expect(wrapper.find('.user-avatar--lg').exists()).toBe(true)
  })

  it('defaults to md size', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'John Doe' },
    })
    expect(wrapper.find('.user-avatar--md').exists()).toBe(true)
  })

  it('renders as span without link when no to prop', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'John Doe' },
    })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes('href')).toBeUndefined()
  })

  it('renders as link when to prop provided', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'John Doe', to: '/user/johndoe' },
    })
    expect(wrapper.attributes('href')).toBe('/user/johndoe')
  })

  it('has background color from name hash', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'John Doe' },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('background-color')
    expect(style).toContain('hsl')
  })
})
