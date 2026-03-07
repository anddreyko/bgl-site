export function useRecordDialog() {
  const isOpen = useState<boolean>('record-dialog-open', () => false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
