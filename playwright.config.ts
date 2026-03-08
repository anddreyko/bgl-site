import { defineConfig } from '@playwright/test'
import { defineBddProject, cucumberReporter } from 'playwright-bdd'

export default defineConfig({
  reporter: [
    cucumberReporter('html', { outputFile: 'e2e/reports/report.html' }),
  ],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testDir: 'e2e',
      testMatch: /auth\.setup\.ts/,
    },
    {
      ...defineBddProject({
        name: 'guest',
        features: 'e2e/features/**/*.feature',
        steps: 'e2e/steps/**/*.ts',
        tags: '@guest',
      }),
      use: { browserName: 'chromium' },
    },
    {
      ...defineBddProject({
        name: 'authenticated',
        features: 'e2e/features/**/*.feature',
        steps: 'e2e/steps/**/*.ts',
        tags: '@authenticated',
      }),
      use: {
        browserName: 'chromium',
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
