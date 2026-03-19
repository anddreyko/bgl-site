export function useNetworkStatus() {
  const isOnline = useState<boolean>('network:online', () => true)
  const isOffline = computed(() => !isOnline.value)

  return { isOnline: readonly(isOnline), isOffline }
}
