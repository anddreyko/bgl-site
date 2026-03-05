import type { Meta, StoryObj } from '@storybook/vue3'
import UiPagination from './index.vue'

const meta: Meta<typeof UiPagination> = {
  title: 'UI/UiPagination',
  component: UiPagination,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const FirstPage: Story = {
  args: { page: 1, total: 100, size: 10 },
}

export const MiddlePage: Story = {
  args: { page: 5, total: 100, size: 10 },
}

export const LastPage: Story = {
  args: { page: 10, total: 100, size: 10 },
}

export const FewPages: Story = {
  args: { page: 2, total: 30, size: 10 },
}
