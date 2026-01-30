# 🚀 Quick Start Guide

Get up and running with the Playwright Automation Framework in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] Yarn package manager installed
- [ ] Git installed

## Step 1: Installation (2 minutes)

### Clone and Setup
```bash
# Navigate to the framework directory
cd automation-framework

# Install dependencies
yarn install

# Install Playwright browsers
yarn playwright install chromium firefox webkit
```

## Step 2: Configuration (1 minute)

### Create Environment File
```bash
# Copy example environment file
cp .env.example .env

# The default values are already set for SauceDemo
# No changes needed for initial run!
```

## Step 3: Run Your First Test (2 minutes)

### Run All Tests
```bash
yarn test
```

### Run Smoke Tests Only (Faster)
```bash
yarn test --grep @smoke
```

### Run in Headed Mode (See the Browser)
```bash
yarn test:headed --grep @smoke
```

### Run Specific Test File
```bash
yarn test tests/login.spec.ts
```

## Step 4: View Results

### Open HTML Report
```bash
yarn report
```

This will open an interactive HTML report in your browser showing:
- Test results
- Execution time
- Screenshots (if any failures)
- Video recordings (if any failures)
- Detailed traces

## What's Next?

### Explore Tests
```bash
# List all available tests
yarn test --list

# Run specific test suites
yarn test --grep @login        # Login tests
yarn test --grep @products     # Product tests
yarn test --grep @cart         # Cart tests
yarn test --grep @accessibility # Accessibility tests
```

### Debug Tests
```bash
# Run in debug mode with Playwright Inspector
yarn test:debug tests/login.spec.ts
```

### Interactive Mode
```bash
# Launch Playwright UI Mode
yarn ui
```

This opens an interactive interface where you can:
- 👁️ Watch tests run
- ⏯️ Pause and resume
- 🔍 Inspect elements
- 📄 View test code

## Common Commands Reference

| Command | Description |
|---------|-------------|
| `yarn test` | Run all tests |
| `yarn test:headed` | Run with visible browser |
| `yarn test:debug` | Run in debug mode |
| `yarn test:chrome` | Run on Chrome only |
| `yarn test:firefox` | Run on Firefox only |
| `yarn test:webkit` | Run on WebKit only |
| `yarn test:mobile` | Run on mobile viewport |
| `yarn ui` | Open interactive UI |
| `yarn report` | View HTML report |
| `yarn codegen` | Generate test code |

## Test Tags Reference

| Tag | Description |
|-----|-------------|
| `@smoke` | Critical path tests |
| `@login` | Login functionality |
| `@products` | Product management |
| `@cart` | Shopping cart |
| `@accessibility` | Accessibility tests |
| `@performance` | Performance tests |
| `@negative` | Negative test scenarios |

### Run Tests by Tags
```bash
yarn test --grep @smoke
yarn test --grep "@login|@products"  # Multiple tags
yarn test --grep @smoke --grep-invert @slow  # Exclude tags
```

## Understanding Test Results

### Success Output
```
Running 8 tests using 4 workers

  ✓ should successfully login @smoke @login (1.2s)
  ✓ should add product to cart @smoke @cart (1.5s)
  ✓ should display all products @smoke @products (0.9s)
  ✓ should navigate to cart page @cart (1.1s)

  8 passed (4.7s)
```

### Failure Output
```
  ✗ should display error message @negative @login (2.1s)
  
  Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  
  Call log:
    - locator.waitFor with timeout 5000ms
    - waiting for locator('[data-test="error"]')
```

## Troubleshooting Quick Fixes

### ⚠️ Tests Failing?

**Problem:** Browser not found
```bash
# Solution: Reinstall browsers
yarn playwright install --with-deps
```

**Problem:** Timeout errors
```bash
# Solution: Increase timeout in playwright.config.ts
timeout: 60000  # Change from 30000 to 60000
```

**Problem:** Network issues
```bash
# Solution: Check your internet connection
# SauceDemo requires internet access
ping www.saucedemo.com
```

### 📝 Need Help?

1. Check `README.md` for detailed documentation
2. Check `FOLDER_STRUCTURE.md` for file organization
3. Check existing tests for examples
4. Review Playwright docs: https://playwright.dev

## Next Steps

### 1. Explore Existing Tests
```bash
# Look at the test files
cat tests/login.spec.ts
cat tests/products.spec.ts
```

### 2. Try Code Generation
```bash
# Generate test code by interacting with the app
yarn codegen https://www.saucedemo.com
```

### 3. Create Your First Test

Create `tests/my-first-test.spec.ts`:
```typescript
import { test, expect } from '../fixtures/test-fixtures';

test('my first test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle(/Swag Labs/);
});
```

Run it:
```bash
yarn test tests/my-first-test.spec.ts
```

### 4. Learn Page Object Model

Study existing page objects:
```bash
cat pages/LoginPage.ts
```

### 5. Run Accessibility Tests
```bash
yarn test:accessibility

# View the generated report
open reports/accessibility/login-page-accessibility.html
```

## BrowserStack Setup (Optional)

For cloud testing across real devices:

1. **Sign up** at [browserstack.com](https://www.browserstack.com)
2. **Get credentials** from dashboard
3. **Add to .env**:
   ```bash
   BROWSERSTACK_USERNAME=your_username
   BROWSERSTACK_ACCESS_KEY=your_key
   ```
4. **Run tests**:
   ```bash
   yarn test:browserstack
   ```

## CI/CD Setup (Optional)

For GitHub Actions:

1. **Push to GitHub**
2. **Add secrets** in repository settings:
   - `BROWSERSTACK_USERNAME`
   - `BROWSERSTACK_ACCESS_KEY`
3. **Tests run automatically** on push/PR

## Tips for Success

✅ **Start small** - Run smoke tests first  
✅ **Use UI mode** - Visual debugging is powerful  
✅ **Check reports** - HTML reports show everything  
✅ **Use tags** - Filter tests by functionality  
✅ **Debug mode** - Step through tests when stuck  
✅ **Read existing tests** - Learn by example  

## Getting Productive

### Day 1: Learn the Basics
- Run existing tests
- View reports
- Try headed mode
- Use UI mode

### Day 2: Understand Structure
- Read page objects
- Study test files
- Review utilities
- Check configurations

### Day 3: Write Tests
- Create simple test
- Use page objects
- Add assertions
- Run and debug

### Week 1: Master Framework
- Write complex tests
- Use all utilities
- Run accessibility tests
- Set up CI/CD

## Resources

- 📖 **Framework Docs**: `README.md`
- 📁 **Structure Guide**: `FOLDER_STRUCTURE.md`
- 🎭 **Playwright Docs**: https://playwright.dev
- 🐛 **Report Issues**: GitHub Issues
- 💬 **Get Help**: Team chat/Slack

---

## Congratulations! 🎉

You're now ready to start testing with Playwright!

**Remember:**
- Tests should be fast, reliable, and maintainable
- Use page objects for reusability
- Tag tests appropriately
- Write clear assertions
- Debug when stuck

**Happy Testing!** 🚀
