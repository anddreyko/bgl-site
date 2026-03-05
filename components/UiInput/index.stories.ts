import type { Meta, StoryObj } from '@storybook/vue3'
import UiInput from './index.vue'

const meta: Meta<typeof UiInput> = {
  title: 'UI/UiInput',
  component: UiInput,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { modelValue: '', placeholder: 'Enter text...' } }
export const WithValue: Story = { args: { modelValue: 'Hello world' } }
export const Error: Story = { args: { modelValue: '', error: true, placeholder: 'Error state' } }
export const Disabled: Story = { args: { modelValue: 'Disabled', disabled: true } }
