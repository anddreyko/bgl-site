import type { Meta, StoryObj } from '@storybook/vue3'
import MateCard from './index.vue'

const meta: Meta<typeof MateCard> = {
  title: 'Domain/MateCard',
  component: MateCard,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    mate: {
      id: 'mate-1',
      name: 'Alice Johnson',
      notes: 'Loves cooperative games. Usually brings snacks.',
      createdAt: '2024-03-15T10:00:00Z',
    },
  },
}

export const LongNotes: Story = {
  args: {
    mate: {
      id: 'mate-2',
      name: 'Bob Smith',
      notes: 'This is a very long note that should be truncated after a certain number of characters because we only show a preview in the card view and the full text should be visible on the detail page.',
      createdAt: '2024-01-20T14:30:00Z',
    },
  },
}

export const WithoutNotes: Story = {
  args: {
    mate: {
      id: 'mate-3',
      name: 'Charlie Brown',
      createdAt: '2024-06-01T09:00:00Z',
    },
  },
}
