import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const repoRoot     = path.join(__dirname, '..');             
const backendDir   = path.join(repoRoot, 'bloglist-backend');
const frontendDir  = path.join(repoRoot, 'bloglist-frontend');

export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  fullyParallel: false,
  workers: 1,

  timeout: 30_000,
  expect: { timeout: 7_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',   
    trace:   'on-first-retry',
  },

  webServer: [
    {
      command: 'npm run start:test',
      cwd:     backendDir,
      url:     'http://localhost:3000/test',
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev',
      cwd:     frontendDir,
      url:     'http://localhost:5173',
      timeout: 120_000,
      reuseExistingServer: false,
    },
  ],

  projects: [
    { name: 'chromium', use: devices['Desktop Chrome']  },
    { name: 'firefox',  use: devices['Desktop Firefox'] },
    { name: 'webkit',   use: devices['Desktop Safari']  },
  ],
});