import { test as setup, expect } from '@playwright/test'

const authFile = 'e2e/.auth/user.json'

setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL ?? 'e2e-test@4record.app'
  const password = process.env.E2E_USER_PASSWORD ?? 'E2eTest123!'

  await page.goto('/auth/sign-in', { waitUntil: 'networkidle' })

  const emailInput = page.locator('#sign-in-email')
  await emailInput.fill(email)
  await expect(emailInput).toHaveValue(email)

  const passwordInput = page.locator('#sign-in-password')
  await passwordInput.fill(password)

  await page.getByRole('button', { name: 'Sign In', exact: true }).click()

  await expect(page).toHaveURL('/', { timeout: 15_000 })

  await page.context().storageState({ path: authFile })
})
