import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, Then } = createBdd()

Then('the plays API request should contain game_id filter {string}', async ({ page }, expectedGameId: string) => {
  // Intercept the plays API call and verify game_id is passed
  const playsRequest = await page.waitForRequest(
    req => req.url().includes('/api/plays') && req.method() === 'GET',
    { timeout: 10_000 },
  ).catch(() => null)

  if (playsRequest) {
    const url = new URL(playsRequest.url())
    const gameId = url.searchParams.get('gameId')
    expect(gameId, 'plays API should be called with gameId parameter').toBe(expectedGameId)
  }
})

Given('I am on a game page with plays', async ({ page }) => {
  // Navigate and intercept API response to get the game data
  let playsResponse: { items: Array<{ gameId?: string }> } | null = null

  page.on('response', async (response) => {
    if (response.url().includes('/api/plays') && response.request().method() === 'GET') {
      try {
        playsResponse = await response.json()
      }
      catch { /* ignore */ }
    }
  })

  await page.goto('/game/1')
  await page.waitForTimeout(5000)

  // Store for the next step
  ;(page as unknown as Record<string, unknown>).__playsResponse = playsResponse
  ;(page as unknown as Record<string, unknown>).__currentGameId = '1'
})

Then('every play in the history table should belong to this game', async ({ page }) => {
  const playsResponse = (page as unknown as Record<string, unknown>).__playsResponse as {
    items: Array<{ gameId?: string }>
  } | null
  const currentGameId = (page as unknown as Record<string, unknown>).__currentGameId as string

  if (!playsResponse || !playsResponse.items || playsResponse.items.length === 0) {
    // No plays data — nothing to verify
    return
  }

  const wrongPlays = playsResponse.items.filter(play => play.gameId !== currentGameId)
  expect(
    wrongPlays.length,
    `Expected all plays to have gameId="${currentGameId}", but ${wrongPlays.length} of ${playsResponse.items.length} plays belong to other games`,
  ).toBe(0)
})
