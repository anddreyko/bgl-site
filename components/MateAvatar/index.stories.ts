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
  args: { mateId: 'mate-1', mateName: 'Alice', size: 'sm' },
}

export const RegularMd: Story = {
  args: { mateId: 'mate-2', mateName: 'Bob', size: 'md' },
}

export const Automa: Story = {
  args: { mateId: 'mate-sys-automa', mateName: 'Automa', size: 'sm' },
}

export const Anonymous: Story = {
  args: { mateId: 'mate-sys-anonymous', mateName: 'Anonymous', size: 'sm' },
}

export const AutomaMd: Story = {
  args: { mateId: 'mate-sys-automa', mateName: 'Automa', size: 'md' },
}

export const AnonymousMd: Story = {
  args: { mateId: 'mate-sys-anonymous', mateName: 'Anonymous', size: 'md' },
}
