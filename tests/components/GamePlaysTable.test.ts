import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi } from 'vitest'
import GamePlaysTable from '~/components/GamePlaysTable/index.vue'
import type { Play } from '~/types'

const mockNavigateTo = vi.fn()
vi.mock('#app/composables/router', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    navigateTo: (...args: unknown[]) => mockNavigateTo(...args),
  }
})

describe('GamePlaysTable', () => {
  const basePlays: Play[] = [
    {
      id: 'play-1',
      status: 'published',
      visibility: 'public',
      startedAt: '2024-01-15T10:00:00Z',
      finishedAt: '2024-01-15T11:30:00Z',
      players: [
        { id: 'p1', mateId: 'm1', mateName: 'Alice', isWinner: true },
        { id: 'p2', mateId: 'm2', mateName: 'Bob' },
      ],
    },
    {
      id: 'play-2',
      status: 'draft',
      visibility: 'private',
      startedAt: '2024-01-10T14:00:00Z',
      players: [
        { id: 'p3', mateId: 'm1', mateName: 'Alice' },
      ],
    },
  ]

  it('renders table with plays', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: basePlays },
    })
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('.game-plays-table__row')).toHaveLength(2)
  })

  it('does not render when plays is empty', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: [] },
    })
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('shows winner name', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: basePlays },
    })
    expect(wrapper.text()).toContain('Alice')
  })

  it('shows "In progress" for unfinished plays', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: basePlays },
    })
    expect(wrapper.text()).toContain('In progress')
  })

  it('shows duration for finished plays', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: basePlays },
    })
    expect(wrapper.text()).toContain('1.5h')
  })

  it('renders title', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: basePlays },
    })
    expect(wrapper.find('.game-plays-table__title').text()).toBe('Play History')
  })
})
