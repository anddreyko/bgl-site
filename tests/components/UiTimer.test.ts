import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import UiTimer from '~/components/UiTimer/index.vue'

describe('UiTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with timer role', async () => {
    const wrapper = await mountSuspended(UiTimer, {
      props: { startedAt: new Date().toISOString(), running: false },
    })
    expect(wrapper.attributes('role')).toBe('timer')
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  it('displays formatted time MM:SS', async () => {
    const start = new Date(Date.now() - 125000).toISOString() // 2 min 5 sec ago
    const wrapper = await mountSuspended(UiTimer, {
      props: { startedAt: start, running: false },
    })
    expect(wrapper.text()).toBe('02:05')
  })

  it('displays formatted time H:MM:SS for hours', async () => {
    const start = new Date(Date.now() - 3661000).toISOString() // 1h 1min 1sec ago
    const wrapper = await mountSuspended(UiTimer, {
      props: { startedAt: start, running: false },
    })
    expect(wrapper.text()).toBe('1:01:01')
  })

  it('applies running class', async () => {
    const wrapper = await mountSuspended(UiTimer, {
      props: { startedAt: new Date().toISOString(), running: true },
    })
    expect(wrapper.find('.ui-timer--running').exists()).toBe(true)
  })
})
