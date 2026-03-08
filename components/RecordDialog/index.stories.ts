import type { Meta, StoryObj } from '@storybook/vue3'
import RecordDialog from './index.vue'

const meta: Meta<typeof RecordDialog> = {
  title: 'Domain/RecordDialog',
  component: RecordDialog,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {},
}
