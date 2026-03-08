import type { Meta, StoryObj } from '@storybook/vue3'
import UserAvatar from './index.vue'

const meta: Meta<typeof UserAvatar> = {
  title: 'Domain/UserAvatar',
  component: UserAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: { name: 'Alice Johnson', size: 'sm' },
}

export const Medium: Story = {
  args: { name: 'Bob Smith', size: 'md' },
}

export const Large: Story = {
  args: { name: 'Charlie Brown', size: 'lg' },
}

export const SingleName: Story = {
  args: { name: 'Diana', size: 'md' },
}
