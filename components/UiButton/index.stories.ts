import type { Meta, StoryObj } from '@storybook/vue3'
import UiButton from './index.vue'

const meta: Meta<typeof UiButton> = {
  title: 'UI/UiButton',
  component: UiButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'record'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: args => ({
    components: { UiButton },
    setup() { return { args } },
    template: '<UiButton v-bind="args">Click me</UiButton>',
  }),
}
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Record: Story = { args: { variant: 'record' } }
export const Loading: Story = { args: { variant: 'primary', loading: true } }
export const Disabled: Story = { args: { variant: 'primary', disabled: true } }
export const Small: Story = { args: { variant: 'primary', size: 'sm' } }
export const Large: Story = { args: { variant: 'primary', size: 'lg' } }
