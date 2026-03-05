import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import UiOverlay from '~/components/UiOverlay/index.vue'

describe('UiOverlay', () => {
  it('renders title when open', async () => {
    await mountSuspended(UiOverlay, {
      props: { open: true, title: 'Overlay Panel' },
      slots: { default: 'Panel content' },
    })
    // Radix portals content to document body
    expect(document.body.textContent).toContain('Overlay Panel')
  })
})
