const PING_INTERVAL = 30_000

export default defineNuxtPlugin(async () => {
  const isOnline = useState<boolean>('network:online', () => true)
  const { loadFromStorage, pendingCount } = useOfflineStore()
  const { startSync } = useOfflineSync()

  await loadFromStorage()

  isOnline.value = navigator.onLine

  async function ping() {
    try {
      await $fetch('/api/ping', { timeout: 5000 })
      isOnline.value = true
    }
    catch {
      isOnline.value = false
    }
  }

  window.addEventListener('online', () => {
    isOnline.value = true
    ping()
  })

  window.addEventListener('offline', () => {
    isOnline.value = false
  })

  setInterval(ping, PING_INTERVAL)

  watch(isOnline, async (online) => {
    if (online && pendingCount.value > 0) {
      await startSync()
    }
  })
})
