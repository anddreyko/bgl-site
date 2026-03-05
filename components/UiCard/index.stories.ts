import type { Meta, StoryObj } from '@storybook/vue3'
import UiCard from './index.vue'

const meta: Meta<typeof UiCard> = {
  title: 'UI/UiCard',
  component: UiCard,
  tags: ['autodocs'],
  argTypes: {
    clickable: { control: 'boolean' },
  },
  render: args => ({
    components: { UiCard },
    setup() { return { args } },
    template: `
      <UiCard v-bind="args">
        <template #header>Card Header</template>
        Card body content goes here.
        <template #footer>Card Footer</template>
      </UiCard>
    `,
  }),
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: {} }
export const Clickable: Story = { args: { clickable: true } }
