import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, Then } = createBdd()

Given('I am on the home page', async ({ page }) => {
  await page.goto('/')
})

Then('I should see the main content', async ({ page }) => {
  await expect(page.locator('article')).toBeVisible()
})

Then('the page title should contain {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(new RegExp(title))
})
