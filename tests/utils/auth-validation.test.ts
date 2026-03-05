import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, validateRequired } from '~/utils/auth-validation'

describe('validateEmail', () => {
  it('returns undefined for valid email', () => {
    expect(validateEmail('user@example.com')).toBeUndefined()
  })

  it('returns undefined for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBeUndefined()
  })

  it('returns error for empty string', () => {
    expect(validateEmail('')).toBe('Email is required')
  })

  it('returns error for whitespace-only string', () => {
    expect(validateEmail('   ')).toBe('Email is required')
  })

  it('returns error for email without @', () => {
    expect(validateEmail('userexample.com')).toBe('Please enter a valid email address')
  })

  it('returns error for email without domain', () => {
    expect(validateEmail('user@')).toBe('Please enter a valid email address')
  })

  it('returns error for email without local part', () => {
    expect(validateEmail('@example.com')).toBe('Please enter a valid email address')
  })

  it('returns error for email without TLD', () => {
    expect(validateEmail('user@example')).toBe('Please enter a valid email address')
  })
})

describe('validatePassword', () => {
  it('returns undefined for valid password (8 chars)', () => {
    expect(validatePassword('12345678')).toBeUndefined()
  })

  it('returns undefined for long password', () => {
    expect(validatePassword('a-very-long-secure-password')).toBeUndefined()
  })

  it('returns error for empty password', () => {
    expect(validatePassword('')).toBe('Password is required')
  })

  it('returns error for short password', () => {
    expect(validatePassword('1234567')).toBe('Password must be at least 8 characters')
  })
})

describe('validateRequired', () => {
  it('returns undefined for non-empty value', () => {
    expect(validateRequired('hello', 'Name')).toBeUndefined()
  })

  it('returns error for empty string', () => {
    expect(validateRequired('', 'Name')).toBe('Name is required')
  })

  it('returns error for whitespace-only string', () => {
    expect(validateRequired('   ', 'Name')).toBe('Name is required')
  })

  it('includes field name in error message', () => {
    expect(validateRequired('', 'Email')).toBe('Email is required')
  })
})
