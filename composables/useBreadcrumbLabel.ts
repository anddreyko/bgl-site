export function useBreadcrumbLabel() {
  const label = useState<string | null>('breadcrumb-label', () => null)

  function set(value: string | null) {
    label.value = value
  }

  function clear() {
    label.value = null
  }

  return { label, set, clear }
}
