# 🎭 Playwright Automation Framework

A comprehensive, production-ready automation framework built with **Playwright** and **TypeScript** for testing modern web applications (Angular, React, Vue.js).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Page Object Model](#page-object-model)
- [Utilities](#utilities)
- [BrowserStack Integration](#browserstack-integration)
- [CI/CD](#cicd)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Capabilities
- ✅ **TypeScript** - Type-safe test automation
- ✅ **Page Object Model (POM)** - Maintainable and scalable architecture
- ✅ **Multi-Browser Support** - Chromium, Firefox, WebKit
- ✅ **Multi-Resolution Testing** - Desktop, Tablet, Mobile
- ✅ **Cross-Framework Support** - Works with Angular, React, Vue.js applications

### Advanced Features
- 🔍 **Accessibility Testing** - WCAG 2.1 Level A/AA/AAA compliance using @axe-core/playwright
- ⚡ **Performance Testing** - Lighthouse integration for Core Web Vitals
- ☁️ **BrowserStack Integration** - Cloud-based cross-browser testing
- 🎯 **Advanced DOM Handling** - Shadow DOM, Web Components, iframes
- 🔄 **Retry Logic** - Automatic retries for flaky tests
- 📊 **Comprehensive Reporting** - HTML, JSON, JUnit reports

### CI/CD Ready
- 🚀 **GitHub Actions** - Pre-configured workflows
- 📸 **Trace & Screenshots** - Automatic capture on failure
- 🎥 **Video Recording** - Test execution recordings
- 🔀 **Parallel Execution** - Sharded test runs

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|----------|
| **Playwright** | ^1.48.0 | Browser automation |
| **TypeScript** | ^5.7.2 | Type-safe development |
| **@axe-core/playwright** | ^4.10.0 | Accessibility testing |
| **playwright-lighthouse** | ^4.0.0 | Performance testing |
| **Lighthouse** | ^12.2.1 | Performance metrics |
| **Node.js** | ≥20.x | Runtime environment |

---

## 📦 Prerequisites

- **Node.js** version 20 or higher
- **Yarn** package manager
- **Git** for version control
- (Optional) **BrowserStack account** for cloud testing

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd automation-framework
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Install Playwright browsers
```bash
yarn playwright install chromium firefox webkit
```

### 4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configurations
```

### 5. Verify installation
```bash
yarn test --help
```

---

## 📁 Project Structure

```
automation-framework/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml    # GitHub Actions CI/CD
├── fixtures/
│   ├── test-fixtures.ts            # Custom Playwright fixtures
│   └── test-data.ts                # Test data and credentials
├── pages/
│   ├── LoginPage.ts                # Login page object
│   ├── ProductsPage.ts             # Products page object
│   └── CartPage.ts                 # Cart page object
├── tests/
│   ├── login.spec.ts               # Login flow tests
│   ├── products.spec.ts            # Product management tests
│   ├── cart.spec.ts                # Cart management tests
│   ├── accessibility.spec.ts       # WCAG compliance tests
│   └── performance.spec.ts         # Performance tests
├── utils/
│   ├── BasePage.ts                 # Base page class
│   ├── accessibility.util.ts       # Accessibility testing utilities
│   ├── performance.util.ts         # Performance testing utilities
│   ├── dom.util.ts                 # DOM interaction utilities
│   └── test-data.util.ts           # Test data generators
├── reports/
│   ├── accessibility/              # Accessibility reports
│   └── performance/                # Performance reports
├── test-results/                   # Playwright test results
├── playwright-report/              # HTML test reports
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
└── .env                            # Environment variables
```

---

## ⚙️ Configuration

### playwright.config.ts

The main configuration file for Playwright:

```typescript
// Key configurations:
- testDir: './tests'                 // Test directory
- timeout: 30000                     // Test timeout (30s)
- fullyParallel: true                // Parallel execution
- retries: 2 (on CI)                 // Retry failed tests
- workers: 4 (on CI)                 // Parallel workers
```

### Environment Variables (.env)

```bash
# BrowserStack
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key

# Test Configuration
BASE_URL=https://www.saucedemo.com
HEADLESS=true
TIMEOUT=30000
```

---

## 🏃 Running Tests

### All Tests
```bash
yarn test
```

### Specific Browser
```bash
yarn test:chrome      # Chromium only
yarn test:firefox     # Firefox only
yarn test:webkit      # WebKit only
yarn test:mobile      # Mobile Chrome
```

### Headed Mode (see browser)
```bash
yarn test:headed
```

### Debug Mode
```bash
yarn test:debug
```

### Specific Test Tags
```bash
yarn test --grep @smoke           # Smoke tests only
yarn test --grep @login           # Login tests
yarn test --grep @accessibility   # Accessibility tests
yarn test --grep @performance     # Performance tests
```

### BrowserStack (Cloud)
```bash
yarn test:browserstack
```

### UI Mode (Interactive)
```bash
yarn ui
```

### View Report
```bash
yarn report
```

### Code Generation
```bash
yarn codegen https://www.saucedemo.com
```

---

## 🏗 Page Object Model

### Creating a Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';

export class MyPage extends BasePage {
  private readonly button: Locator;

  constructor(page: Page) {
    super(page);
    this.button = page.locator('[data-testid="my-button"]');
  }

  async clickButton(): Promise<void> {
    await this.click(this.button);
  }
}
```

### Using in Tests

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test('should click button', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.clickButton();
  // assertions...
});
```

---

## 🔧 Utilities

### BasePage

Provides common methods for all page objects:

```typescript
- navigateTo(url)              // Navigate with network idle
- click(selector)              // Enhanced click
- fill(selector, value)        // Fill with validation
- waitForElement(selector)     // Wait for visibility
- getText(selector)            // Get text content
- isVisible(selector)          // Check visibility
- waitForResponse(pattern)     // Wait for API response
- clickShadowElement()         // Handle Shadow DOM
- getFrameLocator()            // Handle iframes
```

### Accessibility Utility

WCAG compliance testing:

```typescript
const accessibilityUtil = new AccessibilityUtil(page);

// Run WCAG AA audit
const report = await accessibilityUtil.runWCAG_AA_Audit();

// Generate HTML report
await accessibilityUtil.generateHTMLReport(report, 'my-page');

// Assert no violations
accessibilityUtil.assertNoViolations(report);
```

### Performance Utility

Lighthouse and Core Web Vitals:

```typescript
const performanceUtil = new PerformanceUtil(page);

// Run Lighthouse audit
const metrics = await performanceUtil.runLighthouseAudit();

// Check thresholds
performanceUtil.assertPerformanceThresholds(metrics, {
  performance: 70,
  lcp: 2500,
});
```

### DOM Utility

Advanced DOM interactions:

```typescript
// Get by test ID
const element = DOMUtil.getByTestId(page, 'login-button');

// Get by role (accessible)
const button = DOMUtil.getByRole(page, 'button', 'Submit');

// Wait for API response
const data = await DOMUtil.waitForAPIResponse(page, '/api/users');

// Mock API
await DOMUtil.mockAPIResponse(page, '/api/users', mockData);

// Local storage
await DOMUtil.setLocalStorageItem(page, 'token', 'abc123');
```

---

## ☁️ BrowserStack Integration

### Setup

1. **Create BrowserStack account** at [browserstack.com](https://www.browserstack.com)

2. **Get credentials** from BrowserStack dashboard

3. **Configure .env**:
```bash
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

4. **Run tests**:
```bash
BROWSERSTACK=true yarn test
# or
yarn test:browserstack
```

### Available BrowserStack Projects

Configured in `playwright.config.ts`:
- Chrome on Windows 11
- Firefox on macOS Sonoma
- Safari on macOS Sonoma
- Chrome on Android (Samsung Galaxy S23)
- Safari on iOS (iPhone 15)

### Viewing Results

View test results at: [https://automate.browserstack.com](https://automate.browserstack.com)

---

## 🔄 CI/CD

### GitHub Actions

The framework includes a comprehensive GitHub Actions workflow:

**Features:**
- ✅ Multi-browser parallel execution
- ✅ Test sharding for faster runs
- ✅ BrowserStack integration (on main branch)
- ✅ Accessibility test suite
- ✅ Automatic artifact uploads
- ✅ Trace upload on failure
- ✅ Scheduled daily runs
- ✅ Manual workflow dispatch

**Workflow File:** `.github/workflows/playwright-tests.yml`

**Triggers:**
- Push to main/develop
- Pull requests
- Daily at 6 AM UTC
- Manual trigger with options

**Required Secrets:**

Add these to your GitHub repository secrets:
```
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESS_KEY
```

**Manual Run:**

1. Go to Actions tab
2. Select "Playwright Automation Tests"
3. Click "Run workflow"
4. Choose browser and test suite

---

## 📚 Best Practices

### 1. Use Data-TestID Selectors

✅ **Good:**
```typescript
page.locator('[data-testid="login-button"]')
```

❌ **Avoid:**
```typescript
page.locator('.btn.btn-primary.login-btn')  // Fragile
```

### 2. Use Role-Based Selectors (Accessibility)

✅ **Good:**
```typescript
page.getByRole('button', { name: 'Login' })
page.getByLabel('Username')
```

### 3. Wait for Network Idle in SPAs

✅ **Good:**
```typescript
await page.goto(url, { waitUntil: 'networkidle' });
```

### 4. Handle Async Rendering

For React/Angular/Vue apps:
```typescript
await page.waitForLoadState('networkidle');
await page.waitForFunction(() => document.readyState === 'complete');
```

### 5. Use Fixtures for Reusability

✅ **Good:**
```typescript
test('test name', async ({ loginPage }) => {
  await loginPage.navigate();
});
```

### 6. Tag Your Tests

```typescript
test('should login @smoke @login', async ({ loginPage }) => {
  // test code
});
```

### 7. Handle Shadow DOM

```typescript
// Use specialized methods for Web Components
await basePage.clickShadowElement('#host', '#shadow-button');
```

### 8. Write Self-Healing Tests

Use multiple locator strategies:
```typescript
const button = page.locator(
  '[data-testid="submit"], button:has-text("Submit"), .submit-btn'
);
```

---

## 🐛 Troubleshooting

### Tests Failing Due to Timing

**Problem:** Elements not found or stale

**Solution:** Use proper waits
```typescript
await page.waitForLoadState('networkidle');
await locator.waitFor({ state: 'visible' });
```

### BrowserStack Connection Issues

**Problem:** Can't connect to BrowserStack

**Solution:** Verify credentials and check:
```bash
echo $BROWSERSTACK_USERNAME
echo $BROWSERSTACK_ACCESS_KEY
```

### Accessibility Tests Failing

**Problem:** Too many violations

**Solution:** Use selective assertions
```typescript
// Only check critical issues
accessibilityUtil.assertNoCriticalViolations(report);

// Or allow specific impacts
accessibilityUtil.assertNoViolations(report, ['moderate', 'minor']);
```

### Performance Tests Inconsistent

**Problem:** Lighthouse scores vary

**Solution:** 
- Run on consistent environment
- Use headless mode
- Run multiple times and average
- Use CI-specific thresholds

### Flaky Tests

**Problem:** Tests pass/fail randomly

**Solution:**
```typescript
// Use retry utility
import { RetryUtil } from '../utils/test-data.util';

await RetryUtil.retry(
  async () => await someFlakyOperation(),
  { maxRetries: 3, delayMs: 1000 }
);
```

### Debug Mode

Run with inspector:
```bash
yarn test:debug

# Or specific test
PWDEBUG=1 yarn test tests/login.spec.ts
```

---

## 📊 Reports

### HTML Report
Generated at: `playwright-report/index.html`
```bash
yarn report  # Opens in browser
```

### Accessibility Reports
Generated at: `reports/accessibility/*.html`

### Performance Reports
Generated at: `reports/performance/*.json`

### Trace Files
Generated on failure: `test-results/*/trace.zip`

View traces:
```bash
yarn playwright show-trace test-results/*/trace.zip
```

---

## 🤝 Contributing

1. Create a feature branch
2. Write tests following existing patterns
3. Ensure all tests pass
4. Run linter (if configured)
5. Submit pull request

---

## 📝 License

MIT License

---

## 🆘 Support

For issues and questions:
- Check [Playwright Documentation](https://playwright.dev)
- Review existing tests for patterns
- Check troubleshooting section above

---

## 🎯 Example Test Results

### Sample Test Run
```
✓ should successfully login with valid credentials (1.2s)
✓ should display error for locked out user (0.8s)
✓ should add product to cart (1.5s)
✓ should pass WCAG AA audit (3.2s)

4 passed (6.7s)
```

### Accessibility Report Sample
```
📊 Accessibility Audit Results:
   ✓ Passes: 45
   ✗ Violations: 2
   ⚠ Incomplete: 0
   
   Violation Breakdown:
   🔴 Critical: 0
   🟠 Serious: 1
   🟡 Moderate: 1
   🔵 Minor: 0
```

---

**Built with ❤️ using Playwright + TypeScript**

*Last Updated: 2025*
