import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Then } = createBdd()

Then('the error message should not contain raw JS errors', async ({ page }) => {
  const error = page.locator('.edit-profile__error')
  await expect(error).toBeVisible({ timeout: 10_000 })

  const text = await error.textContent() ?? ''
  const rawJsPatterns = [
    'base64URLString',
    'is not an object',
    'is not a function',
    'Cannot read propert',
    'undefined is not',
    'null is not',
    'TypeError',
    'ReferenceError',
  ]

  for (const pattern of rawJsPatterns) {
    expect(text, `Error message contains raw JS error: "${pattern}"`).not.toContain(pattern)
  }
})
