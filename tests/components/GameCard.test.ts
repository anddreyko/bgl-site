import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import GameCard from '~/components/GameCard/index.vue'

describe('GameCard', () => {
  const baseGame = {
    id: '1',
    name: 'Descent',
    yearPublished: 2012,
    type: 'Strategy',
    minPlayers: 1,
    maxPlayers: 5,
  }

  it('renders game name', async () => {
    const wrapper = await mountSuspended(GameCard, {
      props: { game: baseGame },
    })
    expect(wrapper.find('.game-card__name').text()).toBe('Descent')
  })

  it('renders year and player range', async () => {
    const wrapper = await mountSuspended(GameCard, {
      props: { game: baseGame },
    })
    const meta = wrapper.find('.game-card__meta').text()
    expect(meta).toContain('2012')
    expect(meta).toContain('1')
    expect(meta).toContain('5')
  })

  it('renders type badge', async () => {
    const wrapper = await mountSuspended(GameCard, {
      props: { game: baseGame },
    })
    expect(wrapper.find('.ui-badge').text()).toBe('Strategy')
  })

  it('renders placeholder when no image', async () => {
    const wrapper = await mountSuspended(GameCard, {
      props: { game: baseGame },
    })
    expect(wrapper.find('.game-card__placeholder').exists()).toBe(true)
  })

  it('renders image when provided', async () => {
    const wrapper = await mountSuspended(GameCard, {
      props: { game: { ...baseGame, image: 'https://example.com/img.jpg' } },
    })
    expect(wrapper.find('.game-card__image img').exists()).toBe(true)
  })

  it('renders minimal game without optional fields', async () => {
    const wrapper = await mountSuspended(GameCard, {
      props: { game: { id: '2', name: 'Chess' } },
    })
    expect(wrapper.find('.game-card__name').text()).toBe('Chess')
    expect(wrapper.find('.game-card__badge').exists()).toBe(false)
  })
})
