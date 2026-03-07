/**
 * Generate a deterministic HSL color pair from any string.
 * Used for game accent colors, user avatars, etc.
 */
export function colorFromString(str: string): { bg: string, text: string } {
  if (!str) str = ''
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  const hue = ((hash % 360) + 360) % 360
  return {
    bg: `hsl(${hue}, 35%, 25%)`,
    text: `hsl(${hue}, 30%, 85%)`,
  }
}

/**
 * Get initials from a name (max 2 characters).
 */
export function getInitials(name: string): string {
  if (!name) return ''
  return name
    .split(/\s+/)
    .filter(w => w.length > 0)
    .slice(0, 2)
    .map(w => ([...w][0] ?? '').toUpperCase())
    .join('')
}
