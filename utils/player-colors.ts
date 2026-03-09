const PLAYER_COLOR_NAMES = new Set([
  'red', 'orange', 'yellow', 'green', 'cyan',
  'blue', 'pink', 'brown', 'black', 'white',
])

/**
 * Resolve player color to a CSS value.
 * Named colors (e.g. 'red') map to CSS variables (var(--player-red)).
 * Other values (hex, rgb) are passed through as-is.
 */
export function resolveColor(color: string): string {
  if (PLAYER_COLOR_NAMES.has(color)) {
    return `var(--player-${color})`
  }
  return color
}
