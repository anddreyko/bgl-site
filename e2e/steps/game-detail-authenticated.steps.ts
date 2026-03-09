import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

When('I click the first game link', async ({ page }) => {
  const gameLink = page.locator('.game-catalog__grid-item').first()
  await gameLink.waitFor({ state: 'visible', timeout: 10_000 })
  await gameLink.click()
  await page.waitForLoadState('networkidle')
})

Then('Play History section visibility matches play count', async ({ page }) => {
  const statValues = page.locator('.game-hero__stat-value')
  await statValues.first().waitFor({ state: 'visible', timeout: 10_000 })

  const playCountText = await statValues.first().textContent()
  const playCount = Number(playCountText?.trim() ?? '0')

  const playsTable = page.locator('.game-plays-table')

  if (playCount > 0) {
    await expect(playsTable).toBeVisible()
    await expect(page.locator('.game-plays-table__title')).toHaveText('Play History')
  }
  else {
    await expect(playsTable).not.toBeVisible()
  }
})
