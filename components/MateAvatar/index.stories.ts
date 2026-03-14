import type { Meta, StoryObj } from '@storybook/vue3'
import MateAvatar from './index.vue'

const meta: Meta<typeof MateAvatar> = {
  title: 'Domain/MateAvatar',
  component: MateAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Regular: Story = {
  args: { mate: { id: 'mate-1', name: 'Alice' }, size: 'sm' },
}

export const RegularMd: Story = {
  args: { mate: { id: 'mate-2', name: 'Bob' }, size: 'md' },
}

export const Automa: Story = {
  args: { mate: { id: '00000000-0000-4000-a000-000000000002', name: 'Automa' }, size: 'sm' },
}

export const Anonymous: Story = {
  args: { mate: { id: '00000000-0000-4000-a000-000000000001', name: 'Anonymous' }, size: 'sm' },
}

export const AutomaMd: Story = {
  args: { mate: { id: '00000000-0000-4000-a000-000000000002', name: 'Automa' }, size: 'md' },
}

export const AnonymousMd: Story = {
  args: { mate: { id: '00000000-0000-4000-a000-000000000001', name: 'Anonymous' }, size: 'md' },
}
