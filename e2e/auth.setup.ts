import { test as setup, expect } from '@playwright/test'

const authFile = 'e2e/.auth/user.json'

setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL
  const password = process.env.E2E_USER_PASSWORD

  if (!email || !password) {
    throw new Error('E2E_USER_EMAIL and E2E_USER_PASSWORD env variables are required')
  }

  await page.goto('/auth/sign-in')
  await page.locator('#sign-in-email').fill(email)
  await page.locator('#sign-in-password').fill(password)
  await page.locator('.sign-in__submit button').click()

  await expect(page).toHaveURL('/', { timeout: 10_000 })
  await expect(page.locator('.home-page__greeting')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
