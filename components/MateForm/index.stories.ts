import type { Meta, StoryObj } from '@storybook/vue3'
import MateForm from './index.vue'

const meta: Meta<typeof MateForm> = {
  title: 'Domain/MateForm',
  component: MateForm,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = {
  args: {},
}

export const Edit: Story = {
  args: {
    mate: {
      id: 'mate-1',
      name: 'Alice Johnson',
      notes: 'Loves cooperative games',
      createdAt: '2024-03-15T10:00:00Z',
    },
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}
