import type { Meta, StoryObj } from '@storybook/vue3'
import UiFormField from './index.vue'
import UiInput from '../UiInput/index.vue'

const meta: Meta<typeof UiFormField> = {
  title: 'UI/UiFormField',
  component: UiFormField,
  tags: ['autodocs'],
  render: args => ({
    components: { UiFormField, UiInput },
    setup() { return { args } },
    template: `
      <UiFormField v-bind="args">
        <UiInput :id="args.fieldId" model-value="" placeholder="Enter value..." />
      </UiFormField>
    `,
  }),
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Game name', fieldId: 'game-name' },
}

export const Required: Story = {
  args: { label: 'Game name', fieldId: 'game-name', required: true },
}

export const WithError: Story = {
  args: { label: 'Game name', fieldId: 'game-name', error: 'This field is required' },
}
