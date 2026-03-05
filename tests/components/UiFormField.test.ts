import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiFormField from '~/components/UiFormField/index.vue'

describe('UiFormField', () => {
  it('renders label with for attribute', async () => {
    const wrapper = await mountSuspended(UiFormField, {
      props: { label: 'Game name', fieldId: 'game-name' },
    })
    const label = wrapper.find('.ui-form-field__label')
    expect(label.text()).toBe('Game name')
    expect(label.attributes('for')).toBe('game-name')
  })

  it('shows required indicator', async () => {
    const wrapper = await mountSuspended(UiFormField, {
      props: { label: 'Name', fieldId: 'name', required: true },
    })
    expect(wrapper.text()).toContain('*')
  })

  it('shows error message with alert role', async () => {
    const wrapper = await mountSuspended(UiFormField, {
      props: { label: 'Name', fieldId: 'name', error: 'Required field' },
    })
    expect(wrapper.find('.ui-form-field--error').exists()).toBe(true)
    const error = wrapper.find('.ui-form-field__error')
    expect(error.text()).toBe('Required field')
    expect(error.attributes('role')).toBe('alert')
  })

  it('renders slot content', async () => {
    const wrapper = await mountSuspended(UiFormField, {
      props: { label: 'Name', fieldId: 'name' },
      slots: { default: '<input id="name" />' },
    })
    expect(wrapper.find('#name').exists()).toBe(true)
  })
})
