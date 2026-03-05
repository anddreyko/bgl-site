import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, Then } = createBdd()

Given('I am on the game catalog page', async ({ page }) => {
  await page.goto('/game')
})

Then('I should see a list of games', async ({ page }) => {
  await expect(page.locator('h2')).toHaveText('Game catalog')
})
