import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi } from 'vitest'
import AppBreadcrumbs from '~/components/AppBreadcrumbs/index.vue'

vi.mock('#app/composables/router', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useRoute: () => ({ path: '/game/abc-123' }),
  }
})

describe('AppBreadcrumbs', () => {
  it('renders breadcrumb nav with correct segments', async () => {
    const wrapper = await mountSuspended(AppBreadcrumbs)
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('renders Home, Games, and id crumbs', async () => {
    const wrapper = await mountSuspended(AppBreadcrumbs)
    const items = wrapper.findAll('.app-breadcrumbs__item')
    expect(items).toHaveLength(3)
  })

  it('renders links for non-last items', async () => {
    const wrapper = await mountSuspended(AppBreadcrumbs)
    const links = wrapper.findAll('.app-breadcrumbs__link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('renders current page as span', async () => {
    const wrapper = await mountSuspended(AppBreadcrumbs)
    const current = wrapper.find('.app-breadcrumbs__current')
    expect(current.exists()).toBe(true)
    expect(current.attributes('aria-current')).toBe('page')
  })

  it('maps game segment to Games label', async () => {
    const wrapper = await mountSuspended(AppBreadcrumbs)
    expect(wrapper.text()).toContain('Games')
  })
})
