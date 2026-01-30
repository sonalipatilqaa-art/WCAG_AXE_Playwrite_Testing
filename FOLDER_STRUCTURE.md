# Folder Structure

## Overview
This document provides a detailed explanation of the automation framework's folder structure.

## Directory Structure

```
automation-framework/
│
├── .github/
│   └── workflows/
│       └── playwright-tests.yml
│
├── fixtures/
│   ├── test-fixtures.ts
│   └── test-data.ts
│
├── pages/
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   └── CartPage.ts
│
├── tests/
│   ├── login.spec.ts
│   ├── products.spec.ts
│   ├── cart.spec.ts
│   ├── accessibility.spec.ts
│   └── performance.spec.ts
│
├── utils/
│   ├── BasePage.ts
│   ├── accessibility.util.ts
│   ├── performance.util.ts
│   ├── dom.util.ts
│   └── test-data.util.ts
│
├── reports/
│   ├── accessibility/
│   └── performance/
│
├── test-results/
├── playwright-report/
├── node_modules/
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## Detailed Breakdown

### `.github/workflows/`
**Purpose:** CI/CD configuration
- `playwright-tests.yml` - GitHub Actions workflow for automated testing

### `fixtures/`
**Purpose:** Test fixtures and shared test data
- `test-fixtures.ts` - Custom Playwright fixtures (page objects, utilities)
- `test-data.ts` - Test credentials, URLs, and test data constants

### `pages/`
**Purpose:** Page Object Model (POM) implementation
- `LoginPage.ts` - Login page interactions
- `ProductsPage.ts` - Products/inventory page interactions
- `CartPage.ts` - Shopping cart page interactions

**Pattern:**
- Each page class extends `BasePage`
- Contains locators and page-specific methods
- Encapsulates page behavior

### `tests/`
**Purpose:** Test specifications
- `login.spec.ts` - Login functionality tests
- `products.spec.ts` - Product management tests
- `cart.spec.ts` - Shopping cart tests
- `accessibility.spec.ts` - WCAG compliance tests
- `performance.spec.ts` - Performance and Core Web Vitals tests

**Naming Convention:** `*.spec.ts`

### `utils/`
**Purpose:** Reusable utility classes and helper functions

- **`BasePage.ts`**
  - Foundation class for all page objects
  - Common browser interactions
  - Network waiting mechanisms
  - Shadow DOM handling
  - Frame/iframe support

- **`accessibility.util.ts`**
  - Axe-core integration
  - WCAG 2.1 compliance testing
  - Accessibility report generation
  - Violation assertions

- **`performance.util.ts`**
  - Lighthouse integration
  - Core Web Vitals measurement
  - Performance API utilities
  - Performance report generation

- **`dom.util.ts`**
  - Advanced DOM operations
  - API mocking
  - Local storage/cookies management
  - Network request handling

- **`test-data.util.ts`**
  - Test data generators
  - Retry mechanisms
  - Random data utilities

### `reports/`
**Purpose:** Generated test reports

- **`accessibility/`**
  - HTML accessibility reports
  - JSON accessibility reports
  - WCAG violation details

- **`performance/`**
  - Lighthouse reports
  - Performance metrics JSON
  - Core Web Vitals data

### `test-results/`
**Purpose:** Playwright test execution artifacts
- Test traces (`.zip` files)
- Screenshots on failure
- Videos on failure
- Test execution logs

### `playwright-report/`
**Purpose:** HTML test reports
- Interactive HTML report
- Test execution summary
- Failed test details
- Test timeline

### Configuration Files

- **`playwright.config.ts`**
  - Playwright configuration
  - Browser projects
  - Timeout settings
  - Reporter configuration
  - BrowserStack setup

- **`tsconfig.json`**
  - TypeScript compiler configuration
  - Type checking settings
  - Module resolution

- **`package.json`**
  - Dependencies
  - NPM scripts
  - Project metadata

- **`.env`**
  - Environment variables (not committed)
  - BrowserStack credentials
  - Test configuration

- **`.env.example`**
  - Example environment variables
  - Template for `.env` file

- **`.gitignore`**
  - Files to exclude from version control

## File Naming Conventions

### Page Objects
- **Format:** `[PageName]Page.ts`
- **Example:** `LoginPage.ts`, `ProductsPage.ts`
- **Convention:** PascalCase

### Test Specs
- **Format:** `[feature].spec.ts`
- **Example:** `login.spec.ts`, `products.spec.ts`
- **Convention:** kebab-case

### Utilities
- **Format:** `[utility-name].util.ts`
- **Example:** `accessibility.util.ts`, `dom.util.ts`
- **Convention:** kebab-case

### Fixtures
- **Format:** `[fixture-type].ts`
- **Example:** `test-fixtures.ts`, `test-data.ts`
- **Convention:** kebab-case

## Import Paths

### Relative Imports
```typescript
// From test file to page object
import { LoginPage } from '../pages/LoginPage';

// From test file to fixture
import { test, expect } from '../fixtures/test-fixtures';

// From page object to utility
import { BasePage } from '../utils/BasePage';
```

### Best Practice
- Use relative paths for project files
- Keep import paths consistent
- Group imports (external, then internal)

## Adding New Files

### New Page Object
1. Create file in `pages/` directory
2. Extend `BasePage`
3. Define locators in constructor
4. Add methods for page interactions

### New Test Suite
1. Create file in `tests/` directory
2. Use `*.spec.ts` naming
3. Import fixtures
4. Add test tags

### New Utility
1. Create file in `utils/` directory
2. Export classes/functions
3. Document usage
4. Add to fixtures if needed

## Maintenance

### Regular Cleanup
- Clear `test-results/` periodically
- Archive old reports from `reports/`
- Update dependencies regularly

### Version Control
**Commit:**
- Source code (`pages/`, `tests/`, `utils/`)
- Configuration files
- Documentation

**Ignore:**
- `node_modules/`
- `test-results/`
- `playwright-report/`
- `.env`
- Generated reports

## Scalability

### Growing the Framework

**More pages:**
```
pages/
├── common/          # Shared components
├── auth/            # Authentication pages
├── product/         # Product-related pages
└── checkout/        # Checkout flow pages
```

**More tests:**
```
tests/
├── smoke/           # Smoke tests
├── regression/      # Regression tests
├── e2e/             # End-to-end tests
└── api/             # API tests
```

**More utilities:**
```
utils/
├── api/             # API utilities
├── database/        # Database utilities
├── reporting/       # Custom reporters
└── helpers/         # General helpers
```

---

**Note:** This structure is designed to be scalable and maintainable. Follow the established patterns when adding new files.
