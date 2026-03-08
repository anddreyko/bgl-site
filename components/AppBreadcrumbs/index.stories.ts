import type { Meta, StoryObj } from '@storybook/vue3'
import AppBreadcrumbs from './index.vue'

const meta: Meta<typeof AppBreadcrumbs> = {
  title: 'Domain/AppBreadcrumbs',
  component: AppBreadcrumbs,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
