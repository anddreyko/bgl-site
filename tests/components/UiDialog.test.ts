import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiDialog from '~/components/UiDialog/index.vue'

describe('UiDialog', () => {
  it('renders title when open', async () => {
    await mountSuspended(UiDialog, {
      props: { open: true, title: 'Test Dialog' },
      slots: { default: 'Dialog content' },
    })
    // Radix portals content to document body
    expect(document.body.textContent).toContain('Test Dialog')
  })

  it('renders description when provided', async () => {
    await mountSuspended(UiDialog, {
      props: { open: true, title: 'Test', description: 'A description' },
    })
    expect(document.body.textContent).toContain('A description')
  })
})
