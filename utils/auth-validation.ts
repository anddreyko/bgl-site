const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate email format.
 * Returns error message or undefined if valid.
 */
export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return 'Email is required'
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address'
  }
  return undefined
}

/**
 * Validate password meets minimum requirements.
 * Returns error message or undefined if valid.
 */
export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  return undefined
}

/**
 * Validate that a required field is not empty.
 * Returns error message or undefined if valid.
 */
export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value.trim()) {
    return `${fieldName} is required`
  }
  return undefined
}
