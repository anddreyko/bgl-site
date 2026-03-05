import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import MateCard from '~/components/MateCard/index.vue'

describe('MateCard', () => {
  const baseMate = {
    id: '1',
    name: 'Alice',
    notes: 'Best gaming partner',
    createdAt: '2024-03-15T10:00:00Z',
  }

  it('renders mate name', async () => {
    const wrapper = await mountSuspended(MateCard, {
      props: { mate: baseMate },
    })
    expect(wrapper.find('.mate-card__name').text()).toBe('Alice')
  })

  it('renders notes', async () => {
    const wrapper = await mountSuspended(MateCard, {
      props: { mate: baseMate },
    })
    expect(wrapper.find('.mate-card__notes').text()).toBe('Best gaming partner')
  })

  it('truncates long notes', async () => {
    const longNotes = 'A'.repeat(150)
    const wrapper = await mountSuspended(MateCard, {
      props: { mate: { ...baseMate, notes: longNotes } },
    })
    const text = wrapper.find('.mate-card__notes').text()
    expect(text.length).toBeLessThan(150)
    expect(text).toContain('...')
  })

  it('hides notes when not provided', async () => {
    const wrapper = await mountSuspended(MateCard, {
      props: { mate: { id: '2', name: 'Bob', createdAt: '2024-01-01' } },
    })
    expect(wrapper.find('.mate-card__notes').exists()).toBe(false)
  })

  it('renders formatted date', async () => {
    const wrapper = await mountSuspended(MateCard, {
      props: { mate: baseMate },
    })
    const dateText = wrapper.find('.mate-card__date').text()
    expect(dateText).toContain('Added')
    expect(dateText).toContain('2024')
  })

  it('emits edit event when edit button clicked', async () => {
    const wrapper = await mountSuspended(MateCard, {
      props: { mate: baseMate },
    })
    const editBtn = wrapper.findAll('button').find(b => b.text() === 'Edit')
    await editBtn!.trigger('click')
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.emitted('edit')![0]).toEqual([baseMate])
  })

  it('emits delete event when delete button clicked', async () => {
    const wrapper = await mountSuspended(MateCard, {
      props: { mate: baseMate },
    })
    const deleteBtn = wrapper.findAll('button').find(b => b.text() === 'Delete')
    await deleteBtn!.trigger('click')
    expect(wrapper.emitted('delete')).toHaveLength(1)
    expect(wrapper.emitted('delete')![0]).toEqual([baseMate])
  })
})
