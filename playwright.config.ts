import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    storageState: {
      cookies: [
        {
          domain: 'localhost',
          expires: -1,
          httpOnly: false,
          name: 'drop-user',
          path: '/',
          sameSite: 'Lax',
          secure: false,
          value: 'aurora',
        },
      ],
      origins: [],
    },
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: true,
    stdout: 'pipe',
    url: 'http://localhost:3000',
  },
  workers: process.env.CI ? 1 : undefined,
});
