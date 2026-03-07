import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import MainMenu from '~/components/MainMenu/index.vue'

describe('MainMenu', () => {
  it('shows Sign In link when user is null', async () => {
    const wrapper = await mountSuspended(MainMenu, {
      props: {
        user: null,
        activePlay: null,
      },
    })

    const signInLink = wrapper.find('a[href="/auth/sign-in"]')
    const userAvatar = wrapper.find('.user-avatar')

    expect(signInLink.exists()).toBe(true)
    expect(userAvatar.exists()).toBe(false)
  })

  it('shows UserAvatar when user has name', async () => {
    const wrapper = await mountSuspended(MainMenu, {
      props: {
        user: { name: 'John Doe' },
        activePlay: null,
      },
    })

    const signInLink = wrapper.find('a[href="/auth/sign-in"]')
    const userAvatar = wrapper.find('.user-avatar')

    expect(signInLink.exists()).toBe(false)
    expect(userAvatar.exists()).toBe(true)
    expect(userAvatar.text()).toBe('JD')
  })

  it('never shows both Sign In and UserAvatar simultaneously', async () => {
    // Test with user
    const withUserWrapper = await mountSuspended(MainMenu, {
      props: {
        user: { name: 'Alice Smith' },
        activePlay: null,
      },
    })
    const userWrapper = {
      signIn: withUserWrapper.find('a[href="/auth/sign-in"]').exists(),
      avatar: withUserWrapper.find('.user-avatar').exists(),
    }
    expect(userWrapper.signIn && userWrapper.avatar).toBe(false)

    // Test without user
    const withoutUserWrapper = await mountSuspended(MainMenu, {
      props: {
        user: null,
        activePlay: null,
      },
    })
    const noUserWrapper = {
      signIn: withoutUserWrapper.find('a[href="/auth/sign-in"]').exists(),
      avatar: withoutUserWrapper.find('.user-avatar').exists(),
    }
    expect(noUserWrapper.signIn && noUserWrapper.avatar).toBe(false)
  })

  it('passes user name to UserAvatar', async () => {
    const wrapper = await mountSuspended(MainMenu, {
      props: {
        user: { name: 'Test User' },
        activePlay: null,
      },
    })

    const userAvatar = wrapper.find('.user-avatar')
    expect(userAvatar.exists()).toBe(true)
    expect(userAvatar.text()).toBe('TU')
  })

  it('renders navigation links', async () => {
    const wrapper = await mountSuspended(MainMenu, {
      props: {
        user: null,
        activePlay: null,
      },
    })

    const links = wrapper.findAll('a.main-menu__link')
    expect(links.length).toBeGreaterThanOrEqual(3)

    const linkHrefs = links.map(link => link.attributes('href'))
    expect(linkHrefs).toContain('/game')
    expect(linkHrefs).toContain('/mates')
    expect(linkHrefs).toContain('/plays')
  })
})
