import { mountSuspended } from '@nuxt/test-utils/runtime'
import GameCard from '~/components/GameCard/index.vue'

describe('GameCard', () => {
  it('renders game info', async () => {
    const game = {
      id: 1,
      title: 'Catan',
      description: 'A strategy game',
      price: 29.99,
    }

    const wrapper = await mountSuspended(GameCard, {
      props: { game },
    })

    expect(wrapper.text()).toContain('Catan')
    expect(wrapper.text()).toContain('A strategy game')
    expect(wrapper.text()).toContain('29.99')
  })

  it('handles missing game prop', async () => {
    const wrapper = await mountSuspended(GameCard)

    expect(wrapper.find('article').exists()).toBe(true)
  })
})
