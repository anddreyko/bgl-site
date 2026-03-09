interface PingResponse {
  status: string
  environment: string
  version: string
}

const stageLabels: Record<string, string> = {
  alpha: '\u03B1',
  beta: '\u03B2',
  rc: 'RC',
  stable: '',
}

export function useAppStatus() {
  const config = useRuntimeConfig()

  const backendOnline = ref(false)
  const backendVersion = ref('')
  const backendEnv = ref('')

  const gitHash = computed(() => config.public.gitCommitHash || 'unknown')

  const stageEnvLabel = computed(() => {
    const stage = (config.public.releaseStage as string) || 'alpha'
    const label = stageLabels[stage] ?? stage
    if (!label) return backendEnv.value || ''
    return backendEnv.value ? `${label}-${backendEnv.value}` : label
  })

  async function checkBackend() {
    try {
      const data = await $fetch<PingResponse>('/api/ping')
      backendOnline.value = data.status === 'ok'
      backendVersion.value = data.version
      backendEnv.value = data.environment
    }
    catch {
      backendOnline.value = false
    }
  }

  return {
    backendOnline: readonly(backendOnline),
    backendVersion: readonly(backendVersion),
    gitHash,
    stageEnvLabel,
    checkBackend,
  }
}
