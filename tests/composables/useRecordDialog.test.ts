import { describe, it, expect } from 'vitest'
import { useRecordDialog } from '~/composables/useRecordDialog'

describe('useRecordDialog', () => {
  it('starts closed', () => {
    const { isOpen } = useRecordDialog()
    expect(isOpen.value).toBe(false)
  })

  it('opens dialog', () => {
    const { isOpen, open } = useRecordDialog()
    open()
    expect(isOpen.value).toBe(true)
  })

  it('closes dialog', () => {
    const { isOpen, open, close } = useRecordDialog()
    open()
    close()
    expect(isOpen.value).toBe(false)
  })

  it('shares state across calls', () => {
    const a = useRecordDialog()
    const b = useRecordDialog()
    a.open()
    expect(b.isOpen.value).toBe(true)
    b.close()
    expect(a.isOpen.value).toBe(false)
  })
})
