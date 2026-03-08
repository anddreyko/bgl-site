import { createBdd } from 'playwright-bdd'

const { When } = createBdd()

When('I click on the user avatar', async ({ page }) => {
  await page.locator('.user-avatar').click()
})
