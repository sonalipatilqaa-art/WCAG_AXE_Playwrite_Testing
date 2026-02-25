import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Load environment variables from .env file
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * BrowserStack configuration
 */
const isBrowserStack = process.env.BROWSERSTACK === 'true';
const browserStackUsername = process.env.BROWSERSTACK_USERNAME;
const browserStackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;
const buildName = process.env.BROWSERSTACK_BUILD_NAME || 'Playwright Automation Build';
const projectName = process.env.BROWSERSTACK_PROJECT_NAME || 'Automation Framework';

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Maximum time one test can run
  timeout: parseInt(process.env.TIMEOUT || '30000'),

  // Test execution settings
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Fail if test.only is committed
  retries: process.env.CI ? 2 : 0, // Retry on CI failures
  
  /**
   * Optimization: Standard GitHub Actions runners have 2 CPU cores. 
   * Setting workers to 2 prevents resource contention and crashes.
   */
  workers: process.env.CI ? 2 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['list'],
  ],

  // Global test settings
  use: {
    // Base URL for navigation
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    /**
     * FIX: 'headless' must be true for CI environments without an XServer.
     * This logic forces headless mode in GitHub Actions while allowing 
     * local headed execution if HEADLESS=false in your .env.
     */
    headless: process.env.CI ? true : (process.env.HEADLESS === 'true'),

    // Browser context options
    trace: 'on-first-retry', // Capture trace only on the first retry to save time/space
    screenshot: 'only-on-failure', 
    video: 'retain-on-failure', 

    // Network settings for SPAs (React/Angular)
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // Viewport settings
    viewport: { width: 1920, height: 1080 },

    // Permissions
    permissions: [],

    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Project configurations for different browsers and devices
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    // Mobile Browsers
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
    },

    // BrowserStack Cloud Projects (Conditional execution)
    ...(isBrowserStack && browserStackUsername && browserStackAccessKey
      ? [
          {
            name: 'browserstack-chrome-win',
            use: {
              browserName: 'chromium',
              connectOptions: {
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                  JSON.stringify({
                    browser: 'chrome',
                    browser_version: 'latest',
                    os: 'Windows',
                    os_version: '11',
                    name: 'Chrome Windows Test',
                    build: buildName,
                    project: projectName,
                    'browserstack.username': browserStackUsername,
                    'browserstack.accessKey': browserStackAccessKey,
                    'browserstack.networkLogs': true,
                  })
                )}`,
              },
            },
          },
        ]
      : []),
  ],
});