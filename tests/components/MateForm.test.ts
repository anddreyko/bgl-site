import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import MateForm from '~/components/MateForm/index.vue'

describe('MateForm', () => {
  it('renders empty form for creating', async () => {
    const wrapper = await mountSuspended(MateForm)
    const nameInput = wrapper.find('#mate-name')
    expect(nameInput.exists()).toBe(true)
    expect((nameInput.element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Add Mate')
  })

  it('renders pre-filled form for editing', async () => {
    const mate = { id: '1', name: 'Alice', notes: 'Some notes', createdAt: '2024-01-01' }
    const wrapper = await mountSuspended(MateForm, {
      props: { mate },
    })
    const nameInput = wrapper.find('#mate-name')
    expect((nameInput.element as HTMLInputElement).value).toBe('Alice')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Save Changes')
  })

  it('shows validation error when name is empty', async () => {
    const wrapper = await mountSuspended(MateForm)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Name is required')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('shows validation error when name exceeds 100 chars', async () => {
    const wrapper = await mountSuspended(MateForm)
    const nameInput = wrapper.find('#mate-name')
    await nameInput.setValue('A'.repeat(101))
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Name must be 100 characters or less')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('shows validation error when notes exceed 500 chars', async () => {
    const wrapper = await mountSuspended(MateForm)
    const nameInput = wrapper.find('#mate-name')
    await nameInput.setValue('Valid Name')
    const notesTextarea = wrapper.find('#mate-notes')
    await notesTextarea.setValue('A'.repeat(501))
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Notes must be 500 characters or less')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('emits submit with correct payload', async () => {
    const wrapper = await mountSuspended(MateForm)
    const nameInput = wrapper.find('#mate-name')
    await nameInput.setValue('Bob')
    const notesTextarea = wrapper.find('#mate-notes')
    await notesTextarea.setValue('Great player')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('submit')![0]).toEqual([{ name: 'Bob', notes: 'Great player' }])
  })

  it('emits submit without notes when empty', async () => {
    const wrapper = await mountSuspended(MateForm)
    const nameInput = wrapper.find('#mate-name')
    await nameInput.setValue('Bob')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('submit')![0]).toEqual([{ name: 'Bob', notes: undefined }])
  })

  it('emits cancel when cancel button clicked', async () => {
    const wrapper = await mountSuspended(MateForm)
    const cancelBtn = wrapper.findAll('button').find(b => b.text() === 'Cancel')
    await cancelBtn!.trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
