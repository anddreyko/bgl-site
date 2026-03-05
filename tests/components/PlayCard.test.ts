import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import PlayCard from '~/components/PlayCard/index.vue'
import type { Play } from '~/types'

const basPlay: Play = {
  id: 'play-1',
  status: 'draft',
  visibility: 'private',
  startedAt: '2024-01-15T10:00:00Z',
  finishedAt: '2024-01-15T11:30:00Z',
  players: [
    { id: 'p1', mateId: 'mate-1', score: 42, winner: true },
    { id: 'p2', mateId: 'mate-2', score: 30, winner: false },
  ],
  includeInStats: true,
}

describe('PlayCard', () => {
  it('renders game name from game object', async () => {
    const play = { ...basPlay, game: { id: 'g1', name: 'Catan' } }
    const wrapper = await mountSuspended(PlayCard, { props: { play } })
    expect(wrapper.find('.play-card__game-name').text()).toBe('Catan')
  })

  it('renders gameName when game object is missing', async () => {
    const play = { ...basPlay, gameName: 'Ticket to Ride' }
    const wrapper = await mountSuspended(PlayCard, { props: { play } })
    expect(wrapper.find('.play-card__game-name').text()).toBe('Ticket to Ride')
  })

  it('renders "No game" when neither game nor gameName provided', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    expect(wrapper.find('.play-card__game-name').text()).toBe('No game')
  })

  it('renders status badge', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    const badges = wrapper.findAll('.ui-badge')
    const statusBadge = badges.find(b => b.text() === 'draft')
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
    const scores = wrapper.findAll('.play-card__player-score')
    expect(scores[0].text()).toBe('42')
  })

  it('renders winner badge', async () => {
    const wrapper = await mountSuspended(PlayCard, { props: { play: basPlay } })
    const winnerBadges = wrapper.findAll('.ui-badge--success')
    expect(winnerBadges).toHaveLength(1)
    expect(winnerBadges[0].text()).toBe('Winner')
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
    const colorDot = wrapper.find('.play-card__player-color')
    expect(colorDot.exists()).toBe(true)
  })
})
