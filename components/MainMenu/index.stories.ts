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
      startedAt: new Date(Date.now() - 1800000).toISOString(),
    },
  },
}
