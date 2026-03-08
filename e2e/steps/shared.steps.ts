import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

Given('I am on {string}', async ({ page }, url: string) => {
  await page.goto(url)
})

Then('I should be redirected to {string}', async ({ page }, url: string) => {
  await expect(page).toHaveURL(new RegExp(url))
})

Then('I should see heading {string}', async ({ page }, text: string) => {
  await expect(page.getByRole('heading', { name: text })).toBeVisible()
})

Then('I should see a link {string}', async ({ page }, text: string) => {
  await expect(page.getByRole('link', { name: text })).toBeVisible()
})

Then('I should see button {string}', async ({ page }, text: string) => {
  await expect(page.getByRole('button', { name: text, exact: true })).toBeVisible()
})

When('I click on {string}', async ({ page }, text: string) => {
  await page.getByRole('link', { name: text }).or(page.getByRole('button', { name: text })).first().click()
})

Then('the element {string} should be visible', async ({ page }, selector: string) => {
  await expect(page.locator(selector)).toBeVisible()
})

When('I fill in {string} with {string}', async ({ page }, label: string, value: string) => {
  const input = page.getByLabel(label, { exact: true })
  await input.click()
  await input.pressSequentially(value, { delay: 30 })
})

When('I fill in field {string} with {string}', async ({ page }, selector: string, value: string) => {
  const input = page.locator(selector)
  await input.click()
  await input.pressSequentially(value, { delay: 30 })
})

When('I type {string} into {string}', async ({ page }, value: string, selector: string) => {
  const input = page.locator(selector)
  await input.waitFor({ state: 'visible' })
  // Wait for hydration
  await page.waitForTimeout(1000)
  await input.fill(value)
})

When('I submit the form', async ({ page }) => {
  await page.locator('form button[type="submit"]').click()
})

Then('I should see text {string}', async ({ page }, text: string) => {
  await expect(page.getByText(text)).toBeVisible()
})

Then('the page title should contain {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(new RegExp(title))
})
