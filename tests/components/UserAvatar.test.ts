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

  it('links to /user/me by default', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'John Doe' },
    })
    expect(wrapper.attributes('href')).toBe('/user/me')
  })

  it('has aria-label with name', async () => {
    const wrapper = await mountSuspended(UserAvatar, {
      props: { name: 'John Doe' },
    })
    expect(wrapper.attributes('aria-label')).toBe('Profile: John Doe')
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
