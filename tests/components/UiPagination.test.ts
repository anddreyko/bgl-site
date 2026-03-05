import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiPagination from '~/components/UiPagination/index.vue'

describe('UiPagination', () => {
  it('renders navigation with aria-label', async () => {
    const wrapper = await mountSuspended(UiPagination, {
      props: { page: 1, total: 50, size: 10 },
    })
    expect(wrapper.find('nav[aria-label="Pagination"]').exists()).toBe(true)
  })

  it('marks active page with aria-current', async () => {
    const wrapper = await mountSuspended(UiPagination, {
      props: { page: 3, total: 50, size: 10 },
    })
    const active = wrapper.find('.ui-pagination__btn--active')
    expect(active.exists()).toBe(true)
    expect(active.attributes('aria-current')).toBe('page')
    expect(active.text()).toBe('3')
  })

  it('disables previous button on first page', async () => {
    const wrapper = await mountSuspended(UiPagination, {
      props: { page: 1, total: 50, size: 10 },
    })
    const buttons = wrapper.findAll('.ui-pagination__btn')
    expect((buttons[0].element as HTMLButtonElement).disabled).toBe(true)
  })

  it('emits update:page on click', async () => {
    const wrapper = await mountSuspended(UiPagination, {
      props: { page: 1, total: 50, size: 10 },
    })
    const pageButtons = wrapper.findAll('.ui-pagination__btn')
    // Click on page 2 (index 2 because first is prev button)
    await pageButtons[2].trigger('click')
    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
  })

  it('does not render when only one page', async () => {
    const wrapper = await mountSuspended(UiPagination, {
      props: { page: 1, total: 5, size: 10 },
    })
    expect(wrapper.find('nav').exists()).toBe(false)
  })
})
