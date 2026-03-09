import type { Meta, StoryObj } from '@storybook/vue3'
import MainMenu from './index.vue'

const meta: Meta<typeof MainMenu> = {
  title: 'Domain/MainMenu',
  component: MainMenu,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithActivePlay: Story = {
  args: {
    activePlay: {
      id: 'play-1',
      visibility: 'private',
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      players: [],
    },
  },
}

export const WithUser: Story = {
  args: {
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  },
}
