import { useAuth } from '~/composables/useAuth'

export function useRecordDialog() {
  const { isAuthenticated } = useAuth()
  const isOpen = useState<boolean>('record-dialog-open', () => false)

  function open() {
    if (!isAuthenticated.value) {
      navigateTo('/auth/sign-in')
      return
    }
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
