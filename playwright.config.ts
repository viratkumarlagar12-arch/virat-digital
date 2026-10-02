import { defineConfig, devices } from '@playwright/test';

// Tests run against the production build (astro build + preview), in the
// installed Chrome, so no browser download is needed.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4400' },
  // Chrome always; CROSS=1 adds Firefox and WebKit (Safari's engine), which
  // need `npx playwright install firefox webkit` once.
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    ...(process.env.CROSS
      ? [
          { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
          { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        ]
      : []),
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4400',
    url: 'http://localhost:4400',
    reuseExistingServer: false,
    timeout: 240_000,
    env: { SITE_URL: 'https://example.com' },
  },
});
