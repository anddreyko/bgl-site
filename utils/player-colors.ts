const PLAYER_COLOR_NAMES = new Set([
  'red', 'orange', 'yellow', 'green', 'cyan',
  'blue', 'purple', 'pink', 'brown', 'black', 'white',
])

/**
 * Resolve player color to a CSS value.
 * Named colors (e.g. 'red', 'Red') map to CSS variables (var(--player-red)).
 * Other values (hex, rgb) are passed through as-is.
 */
export function resolveColor(color: string): string {
  const normalized = color.toLowerCase()
  if (PLAYER_COLOR_NAMES.has(normalized)) {
    return `var(--player-${normalized})`
  }
  return color
}
