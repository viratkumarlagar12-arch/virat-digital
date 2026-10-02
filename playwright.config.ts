import { defineConfig, devices } from '@playwright/test';

// Tests run against the production build (astro build + preview), in the
// installed Chrome, so no browser download is needed.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    ...devices['Desktop Chrome'],
    channel: 'chrome',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 240_000,
    env: { SITE_URL: 'https://example.com' },
  },
});
