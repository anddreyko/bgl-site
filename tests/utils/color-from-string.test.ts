import { describe, it, expect } from 'vitest'
import { colorFromString, getInitials } from '~/utils/color-from-string'

describe('colorFromString', () => {
  it('returns bg and text properties', () => {
    const result = colorFromString('Catan')
    expect(result).toHaveProperty('bg')
    expect(result).toHaveProperty('text')
  })

  it('returns HSL strings', () => {
    const result = colorFromString('Catan')
    expect(result.bg).toMatch(/^hsl\(\d+, 35%, 25%\)$/)
    expect(result.text).toMatch(/^hsl\(\d+, 30%, 85%\)$/)
  })

  it('is deterministic', () => {
    const a = colorFromString('Catan')
    const b = colorFromString('Catan')
    expect(a).toEqual(b)
  })

  it('produces different colors for different strings', () => {
    const a = colorFromString('Catan')
    const b = colorFromString('Chess')
    expect(a.bg).not.toBe(b.bg)
  })

  it('handles empty string', () => {
    const result = colorFromString('')
    expect(result.bg).toMatch(/^hsl\(\d+, 35%, 25%\)$/)
  })
})

describe('getInitials', () => {
  it('returns first letters of words', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('limits to 2 characters', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
  })

  it('handles single word', () => {
    expect(getInitials('Alice')).toBe('A')
  })

  it('handles empty string', () => {
    expect(getInitials('')).toBe('')
  })

  it('uppercases initials', () => {
    expect(getInitials('alice bob')).toBe('AB')
  })
})
