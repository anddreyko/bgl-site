import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import GameHero from '~/components/GameHero/index.vue'

describe('GameHero', () => {
  const baseGame = {
    id: '1',
    bggId: 123,
    name: 'Catan',
    type: 'base' as const,
    yearPublished: 1995,
    minPlayers: 3,
    maxPlayers: 4,
    image: 'https://example.com/catan.jpg',
  }

  it('renders game title', async () => {
    const wrapper = await mountSuspended(GameHero, {
      props: { game: baseGame },
    })
    expect(wrapper.find('.game-hero__title').text()).toBe('Catan')
  })

  it('renders year and player count', async () => {
    const wrapper = await mountSuspended(GameHero, {
      props: { game: baseGame },
    })
    const meta = wrapper.find('.game-hero__meta').text()
    expect(meta).toContain('1995')
    expect(meta).toContain('3')
    expect(meta).toContain('4')
  })

  it('renders cover image', async () => {
    const wrapper = await mountSuspended(GameHero, {
      props: { game: baseGame },
    })
    expect(wrapper.find('.game-hero__cover-img').exists()).toBe(true)
  })

  it('hides cover when no image', async () => {
    const wrapper = await mountSuspended(GameHero, {
      props: { game: { ...baseGame, image: undefined } },
    })
    expect(wrapper.find('.game-hero__cover').exists()).toBe(false)
  })

  it('renders stats when provided', async () => {
    const wrapper = await mountSuspended(GameHero, {
      props: {
        game: baseGame,
        stats: { totalPlays: 10, totalTimeMinutes: 120, winRate: 50, plays: [] },
      },
    })
    expect(wrapper.find('.game-hero__stats').exists()).toBe(true)
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('2h')
    expect(wrapper.text()).toContain('50%')
  })

  it('hides stats when not provided', async () => {
    const wrapper = await mountSuspended(GameHero, {
      props: { game: baseGame },
    })
    expect(wrapper.find('.game-hero__stats').exists()).toBe(false)
  })
})
