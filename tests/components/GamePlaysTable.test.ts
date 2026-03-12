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
      status: 'finished',
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
      status: 'current',
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

  it('shows W for plays with winner', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: basePlays },
    })
    const outcomes = wrapper.findAll('.game-plays-table__outcome--win')
    expect(outcomes.length).toBeGreaterThan(0)
    expect(outcomes[0].text()).toBe('W:')
  })

  it('shows ... for unfinished plays', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: basePlays },
    })
    const progress = wrapper.findAll('.game-plays-table__outcome--progress')
    expect(progress.length).toBeGreaterThan(0)
    expect(progress[0].text()).toBe('...')
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

  it('shows Place column', async () => {
    const wrapper = await mountSuspended(GamePlaysTable, {
      props: { plays: basePlays },
    })
    const headers = wrapper.findAll('th')
    expect(headers.map(h => h.text())).toContain('Place')
  })
})
