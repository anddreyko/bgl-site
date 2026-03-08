import type { Meta, StoryObj } from '@storybook/vue3'
import RecordButton from './index.vue'

const meta: Meta<typeof RecordButton> = {
  title: 'Domain/RecordButton',
  component: RecordButton,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {
  args: {},
}

export const Active: Story = {
  args: {
    activePlay: {
      id: 'play-1',
      status: 'draft' as const,
      visibility: 'private' as const,
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      players: [],
    },
  },
}
