import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import PlayCard from '~/components/PlayCard/index.vue'
import type { Play } from '~/types'

const basPlay: Play = {
  id: 'play-1',
  visibility: 'private',
  startedAt: '2024-01-15T10:00:00Z',
  finishedAt: '2024-01-15T11:30:00Z',
  players: [
    { id: 'p1', mateId: 'mate-1', score: 42, isWinner: true },
    { id: 'p2', mateId: 'mate-2', score: 30, isWinner: false },
  ],
}

describe('PlayCard', () => {
  it('renders session name as title when present', async () => {
    const play = { ...basPlay, name: 'Friday night', game: { id: 'g1', name: 'Catan' } }
    const wrapper = await mountSuspended(PlayCard, { props: { play } })
    expect(wrapper.find('.play-card__name').text()).toBe('Friday night')
    expect(wrapper.find('.play-card__game-name').text()).toBe('Catan')
  })

  it('renders game name as title when no session name', async () => {
    const play = { ...basPlay, game: { id: 'g1', name: 'Catan' } }
    const wrapper = await mountSuspended(PlayCard, { props: { play } })
    expect(wrapper.find('.play-card__name').text()).toBe('Catan')
    expect(wrapper.find('.play-card__game-name').exists()).toBe(false)
  })

  it('renders Play #id when neither name nor game provided', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    expect(wrapper.find('.play-card__name').text()).toBe(`Play #${basPlay.id.slice(0, 8)}`)
  })

  it('renders status badge for finished play', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    const badges = wrapper.findAll('.ui-badge')
    const statusBadge = badges.find(b => b.text() === 'Finished')
    expect(statusBadge).toBeDefined()
  })

  it('renders status badge for in-progress play', async () => {
    const activePlay = { ...basPlay, finishedAt: undefined }
    const wrapper = await mountSuspended(PlayCard, { props: { play: activePlay } })
    const badges = wrapper.findAll('.ui-badge')
    const statusBadge = badges.find(b => b.text() === 'In progress')
    expect(statusBadge).toBeDefined()
  })

  it('renders visibility badge', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    const badges = wrapper.findAll('.ui-badge')
    const visBadge = badges.find(b => b.text() === 'private')
    expect(visBadge).toBeDefined()
  })

  it('renders players list', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    const players = wrapper.findAll('.play-card__player')
    expect(players).toHaveLength(2)
  })

  it('renders player score', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    const scores = wrapper.findAll('.player-badge__score')
    expect(scores[0].text()).toBe('42')
  })

  it('renders winner crown', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    const crown = wrapper.find('.mate-avatar-wrap--winner')
    expect(crown.exists()).toBe(true)
  })

  it('renders duration for finished play', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    expect(wrapper.find('.play-card__duration').text()).toBe('1h 30m')
  })

  it('renders timer for active play', async () => {
    const activePlay = { ...basPlay, finishedAt: undefined }
    const wrapper = await mountSuspended(PlayCard, { props: { play: activePlay } })
    expect(wrapper.find('.ui-timer').exists()).toBe(true)
    expect(wrapper.find('.play-card__duration').exists()).toBe(false)
  })

  it('renders "No players" when players array is empty', async () => {
    const play = { ...basPlay, players: [] }
    const wrapper = await mountSuspended(PlayCard, { props: { play } })
    expect(wrapper.find('.play-card__no-players').text()).toBe('No players')
  })

  it('emits click event', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeDefined()
  })

  it('renders player color dot', async () => {
    const play = {
      ...basPlay,
      players: [{ id: 'p1', mateId: 'mate-1', color: '#ff0000' }],
    }
    const wrapper = await mountSuspended(PlayCard, { props: { play } })
    const colorDot = wrapper.find('.player-badge__color')
    expect(colorDot.exists()).toBe(true)
  })
})
