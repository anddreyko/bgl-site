import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import RecordButton from '~/components/RecordButton/index.vue'
import type { Play } from '~/types'

const mockActivePlay: Play = {
  id: 'play-1',
  status: 'draft',
  visibility: 'private',
  startedAt: new Date().toISOString(),
  players: [],
  includeInStats: true,
}

describe('RecordButton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders "Record" text when no active play', async () => {
    const wrapper = await mountSuspended(RecordButton, {
      props: { activePlay: null },
    })
    expect(wrapper.find('.record-button__text').text()).toBe('Record')
  })

  it('renders red dot', async () => {
    const wrapper = await mountSuspended(RecordButton, {
      props: { activePlay: null },
    })
    expect(wrapper.find('.record-button__dot').exists()).toBe(true)
  })

  it('renders timer when active play exists', async () => {
    const wrapper = await mountSuspended(RecordButton, {
      props: { activePlay: mockActivePlay },
    })
    expect(wrapper.find('.ui-timer').exists()).toBe(true)
    expect(wrapper.find('.record-button__text').exists()).toBe(false)
  })

  it('applies active class when play is active', async () => {
    const wrapper = await mountSuspended(RecordButton, {
      props: { activePlay: mockActivePlay },
    })
    expect(wrapper.find('.record-button--active').exists()).toBe(true)
  })

  it('does not apply active class when no active play', async () => {
    const wrapper = await mountSuspended(RecordButton, {
      props: { activePlay: null },
    })
    expect(wrapper.find('.record-button--active').exists()).toBe(false)
  })

  it('emits click on button click', async () => {
    const wrapper = await mountSuspended(RecordButton, {
      props: { activePlay: null },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('has correct aria-label when no active play', async () => {
    const wrapper = await mountSuspended(RecordButton, {
      props: { activePlay: null },
    })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Record new play')
  })

  it('has correct aria-label when active play', async () => {
    const wrapper = await mountSuspended(RecordButton, {
      props: { activePlay: mockActivePlay },
    })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Active play in progress')
  })
})
