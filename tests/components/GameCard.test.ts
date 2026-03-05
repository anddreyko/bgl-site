import { mountSuspended } from '@nuxt/test-utils/runtime'
import GameCard from '~/components/GameCard/index.vue'

describe('GameCard', () => {
  it('renders game info', async () => {
    const game = {
      id: 'abc-123',
      bggId: 13,
      name: 'Catan',
      year: 1995,
      type: 'base' as const,
    }

    const wrapper = await mountSuspended(GameCard, {
      props: { game },
    })

    expect(wrapper.text()).toContain('Catan')
    expect(wrapper.text()).toContain('1995')
  })

  it('handles missing game prop', async () => {
    const wrapper = await mountSuspended(GameCard)

    expect(wrapper.find('article').exists()).toBe(true)
  })
})
