import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// BrowserStack configuration
const isBrowserStack = process.env.BROWSERSTACK === 'true';
const browserStackUsername = process.env.BROWSERSTACK_USERNAME;
const browserStackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;
const buildName = process.env.BROWSERSTACK_BUILD_NAME || 'Playwright Automation Build';
const projectName = process.env.BROWSERSTACK_PROJECT_NAME || 'Automation Framework';

/**
 * Playwright Configuration
 * 
 * Features:
 * - Multi-browser support (Chromium, Firefox, WebKit)
 * - Multi-resolution testing (Mobile, Tablet, Desktop)
 * - BrowserStack cloud execution
 * - Parallel test execution
 * - Trace, video, and screenshot capture on failure
 * - Network idle waiting for SPAs (React, Angular, Vue)
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Maximum time one test can run
  timeout: parseInt(process.env.TIMEOUT || '30000'),

  // Test execution settings
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Fail if test.only is committed
  retries: process.env.CI ? 2 : 0, // Retry on CI failures
  workers: process.env.CI ? 4 : undefined, // Limit workers on CI

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

    // Browser context options
    trace: 'on-first-retry', // Trace on first retry
    screenshot: 'only-on-failure', // Screenshot on failure
    video: 'retain-on-failure', // Video on failure

    // Network settings for SPAs
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // Viewport settings
    viewport: { width: 1920, height: 1080 },

    // Browser options
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOW_MO || '0'),

    // Permissions
    permissions: [],

    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Project configurations for different browsers and devices
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Note: 'channel: chrome' removed for ARM64 compatibility
        // Uses Chromium instead of Google Chrome
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

    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },

    // BrowserStack Cloud Projects (Conditional)
    ...(isBrowserStack && browserStackUsername && browserStackAccessKey
      ? [
          {
            name: 'browserstack-chrome-win',
            use: {
              browserName: 'chromium',
              channel: 'chrome',
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
                    'browserstack.local': false,
                    'browserstack.networkLogs': true,
                    'browserstack.console': 'verbose',
                  })
                )}`,
              },
            },
          },
          {
            name: 'browserstack-firefox-mac',
            use: {
              browserName: 'firefox',
              connectOptions: {
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                  JSON.stringify({
                    browser: 'firefox',
                    browser_version: 'latest',
                    os: 'OS X',
                    os_version: 'Sonoma',
                    name: 'Firefox macOS Test',
                    build: buildName,
                    project: projectName,
                    'browserstack.username': browserStackUsername,
                    'browserstack.accessKey': browserStackAccessKey,
                    'browserstack.local': false,
                    'browserstack.networkLogs': true,
                  })
                )}`,
              },
            },
          },
          {
            name: 'browserstack-safari-mac',
            use: {
              browserName: 'webkit',
              connectOptions: {
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                  JSON.stringify({
                    browser: 'playwright-webkit',
                    browser_version: 'latest',
                    os: 'OS X',
                    os_version: 'Sonoma',
                    name: 'Safari macOS Test',
                    build: buildName,
                    project: projectName,
                    'browserstack.username': browserStackUsername,
                    'browserstack.accessKey': browserStackAccessKey,
                    'browserstack.local': false,
                  })
                )}`,
              },
            },
          },
          {
            name: 'browserstack-mobile-android',
            use: {
              browserName: 'chromium',
              connectOptions: {
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                  JSON.stringify({
                    browser: 'chrome',
                    device: 'Samsung Galaxy S23',
                    realMobile: 'true',
                    os_version: '13.0',
                    name: 'Android Chrome Test',
                    build: buildName,
                    project: projectName,
                    'browserstack.username': browserStackUsername,
                    'browserstack.accessKey': browserStackAccessKey,
                    'browserstack.local': false,
                  })
                )}`,
              },
            },
          },
          {
            name: 'browserstack-mobile-ios',
            use: {
              browserName: 'webkit',
              connectOptions: {
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
                  JSON.stringify({
                    browser: 'playwright-webkit',
                    device: 'iPhone 15',
                    realMobile: 'true',
                    os_version: '17',
                    name: 'iOS Safari Test',
                    build: buildName,
                    project: projectName,
                    'browserstack.username': browserStackUsername,
                    'browserstack.accessKey': browserStackAccessKey,
                    'browserstack.local': false,
                  })
                )}`,
              },
            },
          },
        ]
      : []),
  ],

  // Web server (if needed for local testing)
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: !process.env.CI,
  // },
});
