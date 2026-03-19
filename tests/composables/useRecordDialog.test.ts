import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRecordDialog } from '~/composables/useRecordDialog'

const mockIsAuthenticated = ref(true)
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: mockIsAuthenticated }),
}))

describe('useRecordDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated.value = true
    const { close } = useRecordDialog()
    close()
  })

  it('starts closed', () => {
    const { isOpen } = useRecordDialog()
    expect(isOpen.value).toBe(false)
  })

  it('opens dialog when authenticated', () => {
    const { isOpen, open } = useRecordDialog()
    open()
    expect(isOpen.value).toBe(true)
  })

  it('does not open dialog when not authenticated', () => {
    mockIsAuthenticated.value = false
    const { isOpen, open } = useRecordDialog()
    open()
    expect(isOpen.value).toBe(false)
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
