import type { Meta, StoryObj } from '@storybook/vue3'
import UiBadge from './index.vue'

const meta: Meta<typeof UiBadge> = {
  title: 'UI/UiBadge',
  component: UiBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'info'],
    },
  },
  render: args => ({
    components: { UiBadge },
    setup() { return { args } },
    template: '<UiBadge v-bind="args">Badge text</UiBadge>',
  }),
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { variant: 'default' } }
export const Success: Story = { args: { variant: 'success' } }
export const Warning: Story = { args: { variant: 'warning' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Info: Story = { args: { variant: 'info' } }
