import type { Meta, StoryObj } from '@storybook/vue3'
import UiSelect from './index.vue'

const options = [
  { value: 'strategy', label: 'Strategy' },
  { value: 'party', label: 'Party' },
  { value: 'family', label: 'Family' },
  { value: 'thematic', label: 'Thematic' },
]

const meta: Meta<typeof UiSelect> = {
  title: 'UI/UiSelect',
  component: UiSelect,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { modelValue: '', options, placeholder: 'Choose game type...' },
}

export const WithValue: Story = {
  args: { modelValue: 'strategy', options },
}

export const Error: Story = {
  args: { modelValue: '', options, error: true, placeholder: 'Required' },
}

export const Disabled: Story = {
  args: { modelValue: 'party', options, disabled: true },
}
