import { test as setup, expect } from '@playwright/test'

const authFile = 'e2e/.auth/user.json'

setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL ?? 'e2e-test@4record.app'
  const password = process.env.E2E_USER_PASSWORD ?? 'E2eTest123!'

  await page.goto('/auth/sign-in')
  await page.waitForTimeout(1000)

  const emailInput = page.locator('#sign-in-email')
  await emailInput.click()
  await emailInput.pressSequentially(email, { delay: 30 })

  const passwordInput = page.locator('#sign-in-password')
  await passwordInput.click()
  await passwordInput.pressSequentially(password, { delay: 30 })

  await page.getByRole('button', { name: 'Sign In', exact: true }).click()

  await expect(page).toHaveURL('/', { timeout: 10_000 })
  await expect(page.locator('.home-page__greeting')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
