import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import PlayForm from '~/components/PlayForm/index.vue'
import type { Mate } from '~/types'

const mockMates: Mate[] = [
  { id: 'mate-1', name: 'Alice', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'mate-2', name: 'Bob', createdAt: '2024-01-01T00:00:00Z' },
]

describe('PlayForm', () => {
  it('renders the form', async () => {
    const wrapper = await mountSuspended(PlayForm, {
      props: { mates: mockMates },
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('renders game search input', async () => {
    const wrapper = await mountSuspended(PlayForm, {
      props: { mates: mockMates },
    })
    const gameInput = wrapper.find('#play-game')
    expect(gameInput.exists()).toBe(true)
  })

  it('renders visibility select', async () => {
    const wrapper = await mountSuspended(PlayForm, {
      props: { mates: mockMates },
    })
    const select = wrapper.find('#play-visibility')
    expect(select.exists()).toBe(true)
  })

  it('renders submit button', async () => {
    const wrapper = await mountSuspended(PlayForm, {
      props: { mates: mockMates },
    })
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Start Play')
  })

  it('adds a player row when clicking Add player', async () => {
    const wrapper = await mountSuspended(PlayForm, {
      props: { mates: mockMates },
    })

    const addBtn = wrapper.findAll('button').find(b => b.text() === 'Add player')
    expect(addBtn).toBeDefined()
    await addBtn!.trigger('click')

    const playerRows = wrapper.findAll('.play-form__player-row')
    expect(playerRows).toHaveLength(1)
  })

  it('removes a player row', async () => {
    const wrapper = await mountSuspended(PlayForm, {
      props: { mates: mockMates },
    })

    // Add two players
    const addBtn = wrapper.findAll('button').find(b => b.text() === 'Add player')
    await addBtn!.trigger('click')
    await addBtn!.trigger('click')
    expect(wrapper.findAll('.play-form__player-row')).toHaveLength(2)

    // Remove first
    const removeBtn = wrapper.findAll('button').find(b => b.text() === 'Remove')
    await removeBtn!.trigger('click')
    expect(wrapper.findAll('.play-form__player-row')).toHaveLength(1)
  })

  it('emits submit with payload', async () => {
    const wrapper = await mountSuspended(PlayForm, {
      props: { mates: mockMates },
    })

    await wrapper.find('form').trigger('submit')

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeDefined()
    expect(emitted![0][0]).toHaveProperty('visibility', 'private')
    expect(emitted![0][0]).toHaveProperty('players')
    expect(emitted![0][0]).toHaveProperty('startedAt')
  })

  it('renders players legend', async () => {
    const wrapper = await mountSuspended(PlayForm, {
      props: { mates: mockMates },
    })
    const legend = wrapper.find('.play-form__players-legend')
    expect(legend.text()).toBe('Players')
  })
})
