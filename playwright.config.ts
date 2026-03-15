import { defineConfig } from '@playwright/test'
import { defineBddProject, cucumberReporter } from 'playwright-bdd'

/**
 * E2E_MODE controls which server and URL to test against:
 *   dev-local      — dev on localhost:3001 (default)
 *   dev-network    — dev on external IP:3001
 *   preview-local  — production build on localhost:3000
 *   preview-network — production build on external IP:3000
 *
 * PLAYWRIGHT_BASE_URL overrides the URL for any mode.
 * E2E_NETWORK_HOST sets the external IP (default: 0.0.0.0).
 */
type Mode = 'dev-local' | 'dev-network' | 'preview-local' | 'preview-network'

const mode = (process.env.E2E_MODE || 'dev-local') as Mode
const networkHost = process.env.E2E_NETWORK_HOST || '0.0.0.0'

const modeConfig: Record<Mode, { url: string, command: string }> = {
  'dev-local': {
    url: 'http://localhost:3001',
    command: 'npx nuxi dev --host 0.0.0.0 --port 3001',
  },
  'dev-network': {
    url: `http://${networkHost}:3001`,
    command: 'npx nuxi dev --host 0.0.0.0 --port 3001',
  },
  'preview-local': {
    url: 'http://localhost:3000',
    command: 'NITRO_HOST=0.0.0.0 pnpm preview',
  },
  'preview-network': {
    url: `http://${networkHost}:3000`,
    command: 'NITRO_HOST=0.0.0.0 pnpm preview',
  },
}

const { url, command } = modeConfig[mode]
const baseURL = process.env.PLAYWRIGHT_BASE_URL || url

export default defineConfig({
  reporter: [
    cucumberReporter('html', { outputFile: 'e2e/reports/report.html' }),
  ],
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testDir: 'e2e',
      testMatch: /auth\.setup\.ts/,
      retries: 2,
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
    command,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
