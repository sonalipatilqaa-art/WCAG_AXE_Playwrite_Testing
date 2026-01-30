# BrowserStack Integration Guide

## Overview

This framework includes full BrowserStack integration for testing on real devices and browsers in the cloud.

## What is BrowserStack?

BrowserStack is a cloud-based cross-browser testing platform that provides:
- ☁️ Access to 3000+ real devices and browsers
- 🌍 Global infrastructure for faster test execution
- 📹 Video recordings and screenshots
- 📑 Network logs and debugging tools
- 🔗 Selenium/Playwright integration

## Setup Instructions

### Step 1: Create BrowserStack Account

1. **Sign Up**
   - Go to [https://www.browserstack.com](https://www.browserstack.com)
   - Click "Sign Up" or "Start Free Trial"
   - Complete registration

2. **Choose Plan**
   - Free Trial: Limited minutes
   - Paid Plans: Based on parallel tests and features
   - See: https://www.browserstack.com/pricing

### Step 2: Get Credentials

1. **Login to Dashboard**
   - Navigate to [https://automate.browserstack.com](https://automate.browserstack.com)

2. **Find Credentials**
   - Click on "Access Key" in the sidebar
   - Or go to: Account > Settings > Automate
   - Copy your Username and Access Key

3. **Keep Secure**
   - Never commit credentials to version control
   - Use environment variables
   - Use secrets in CI/CD

### Step 3: Configure Framework

#### Option A: Environment Variables (Recommended)

1. **Create/Edit .env File**
   ```bash
   # BrowserStack Credentials
   BROWSERSTACK_USERNAME=your_username_here
   BROWSERSTACK_ACCESS_KEY=your_access_key_here
   
   # Optional: Customize build info
   BROWSERSTACK_BUILD_NAME=My Test Build
   BROWSERSTACK_PROJECT_NAME=My Project
   ```

2. **Verify .gitignore**
   ```bash
   # .env should be in .gitignore
   cat .gitignore | grep .env
   ```

#### Option B: System Environment Variables

**macOS/Linux:**
```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

**Windows (PowerShell):**
```powershell
$env:BROWSERSTACK_USERNAME="your_username"
$env:BROWSERSTACK_ACCESS_KEY="your_access_key"
```

**Windows (CMD):**
```cmd
set BROWSERSTACK_USERNAME=your_username
set BROWSERSTACK_ACCESS_KEY=your_access_key
```

### Step 4: Run Tests on BrowserStack

#### Quick Start
```bash
# Set environment variable and run
BROWSERSTACK=true yarn test

# Or use the npm script
yarn test:browserstack
```

#### Run Specific Tests
```bash
# Smoke tests only
BROWSERSTACK=true yarn test --grep @smoke

# Login tests only
BROWSERSTACK=true yarn test --grep @login

# Specific test file
BROWSERSTACK=true yarn test tests/login.spec.ts
```

## Configured BrowserStack Environments

The framework includes the following pre-configured environments:

### Desktop Browsers

1. **Chrome on Windows 11**
   ```typescript
   browser: 'chrome'
   os: 'Windows'
   os_version: '11'
   ```

2. **Firefox on macOS Sonoma**
   ```typescript
   browser: 'firefox'
   os: 'OS X'
   os_version: 'Sonoma'
   ```

3. **Safari on macOS Sonoma**
   ```typescript
   browser: 'playwright-webkit'
   os: 'OS X'
   os_version: 'Sonoma'
   ```

### Mobile Browsers (Real Devices)

4. **Chrome on Samsung Galaxy S23**
   ```typescript
   device: 'Samsung Galaxy S23'
   os_version: '13.0'
   realMobile: true
   ```

5. **Safari on iPhone 15**
   ```typescript
   device: 'iPhone 15'
   os_version: '17'
   realMobile: true
   ```

## Running Specific BrowserStack Projects

### Run Only Desktop Tests
```bash
BROWSERSTACK=true yarn test \
  --project=browserstack-chrome-win \
  --project=browserstack-firefox-mac \
  --project=browserstack-safari-mac
```

### Run Only Mobile Tests
```bash
BROWSERSTACK=true yarn test \
  --project=browserstack-mobile-android \
  --project=browserstack-mobile-ios
```

### Run Single Project
```bash
BROWSERSTACK=true yarn test --project=browserstack-chrome-win
```

## Viewing Test Results

### BrowserStack Dashboard

1. **Navigate to Dashboard**
   - Go to [https://automate.browserstack.com](https://automate.browserstack.com)

2. **View Builds**
   - See all your test builds
   - Filter by date, status, or project

3. **View Sessions**
   - Click on a build to see all test sessions
   - Each test creates a session

4. **Session Details**
   - Video recording of test execution
   - Screenshots at each step
   - Network logs
   - Console logs
   - Test commands
   - Performance metrics

### Understanding Build Names

By default, builds are named:
```
Playwright Automation Build
```

Customize in `.env`:
```bash
BROWSERSTACK_BUILD_NAME=Sprint 23 Tests
BROWSERSTACK_PROJECT_NAME=E-Commerce App
```

In CI/CD, builds are automatically named:
```
GitHub Actions Build #42
```

## Advanced Configuration

### Custom Capabilities

Edit `playwright.config.ts` to add more capabilities:

```typescript
{
  name: 'browserstack-custom',
  use: {
    browserName: 'chromium',
    connectOptions: {
      wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
        JSON.stringify({
          browser: 'chrome',
          browser_version: '120',  // Specific version
          os: 'Windows',
          os_version: '11',
          resolution: '1920x1080',  // Screen resolution
          'browserstack.selenium_version': '4.0.0',
          'browserstack.local': true,  // Local testing
          'browserstack.debug': true,  // Debug mode
          'browserstack.networkLogs': true,  // Network logs
          'browserstack.console': 'verbose',  // Console logs
          'browserstack.video': true,  // Video recording
          // Add your credentials
          'browserstack.username': process.env.BROWSERSTACK_USERNAME,
          'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
        })
      )}`,
    },
  },
}
```

### Local Testing

Test applications running on your local machine:

1. **Install BrowserStack Local**
   ```bash
   npm install -g browserstack-local
   ```

2. **Start Local Connection**
   ```bash
   browserstack-local --key YOUR_ACCESS_KEY
   ```

3. **Enable in Config**
   ```typescript
   'browserstack.local': true
   ```

4. **Run Tests**
   ```bash
   BROWSERSTACK=true yarn test
   ```

### Geolocation Testing

Test from different geographic locations:

```typescript
{
  // ... other capabilities
  'browserstack.geoLocation': 'US',  // US, GB, FR, etc.
}
```

## CI/CD Integration

### GitHub Actions

The framework includes BrowserStack support in GitHub Actions.

#### Setup

1. **Add Secrets**
   - Go to: Repository > Settings > Secrets > Actions
   - Add `BROWSERSTACK_USERNAME`
   - Add `BROWSERSTACK_ACCESS_KEY`

2. **Workflow Runs Automatically**
   - On push to main branch
   - BrowserStack tests run in the `browserstack` job

#### Manual Trigger

1. Go to Actions tab
2. Select "Playwright Automation Tests"
3. Click "Run workflow"
4. Tests will run on BrowserStack

### Other CI Platforms

#### Jenkins
```groovy
environment {
  BROWSERSTACK_USERNAME = credentials('browserstack-username')
  BROWSERSTACK_ACCESS_KEY = credentials('browserstack-access-key')
}
stages {
  stage('Test') {
    steps {
      sh 'BROWSERSTACK=true yarn test'
    }
  }
}
```

#### GitLab CI
```yaml
test:browserstack:
  script:
    - BROWSERSTACK=true yarn test
  variables:
    BROWSERSTACK_USERNAME: $BROWSERSTACK_USERNAME
    BROWSERSTACK_ACCESS_KEY: $BROWSERSTACK_ACCESS_KEY
```

#### CircleCI
```yaml
- run:
    name: Run BrowserStack Tests
    command: BROWSERSTACK=true yarn test
    environment:
      BROWSERSTACK_USERNAME: ${BROWSERSTACK_USERNAME}
      BROWSERSTACK_ACCESS_KEY: ${BROWSERSTACK_ACCESS_KEY}
```

## Best Practices

### ✅ Do's

1. **Use Environment Variables**
   - Never hardcode credentials
   - Use .env for local development
   - Use secrets for CI/CD

2. **Meaningful Build Names**
   - Include sprint/version number
   - Add date or build number
   - Group related tests

3. **Selective Testing**
   - Run smoke tests frequently
   - Run full suite nightly
   - Use tags to filter tests

4. **Monitor Usage**
   - Check BrowserStack dashboard for usage
   - Optimize parallel execution
   - Clean up old builds

5. **Debug Efficiently**
   - Use video recordings
   - Check network logs
   - Review console errors

### ❌ Don'ts

1. **Don't Commit Credentials**
   - Always use .gitignore
   - Never put in code
   - Don't share access keys

2. **Don't Run All Tests Always**
   - Use smoke tests for quick feedback
   - Save full suite for nightly runs
   - Filter by tags

3. **Don't Ignore Failures**
   - Check BrowserStack logs
   - Review video recordings
   - Fix flaky tests

## Troubleshooting

### Issue: Connection Timeout

**Error:** `Could not connect to BrowserStack`

**Solutions:**
1. Check credentials are correct
2. Verify account is active
3. Check internet connection
4. Try different network

### Issue: Authentication Failed

**Error:** `Authentication failed`

**Solutions:**
1. Verify username and access key
2. Check for typos in .env
3. Regenerate access key if needed
4. Check account status

### Issue: Build Not Showing

**Problem:** Test runs but no build in dashboard

**Solutions:**
1. Wait a few seconds (delay in UI)
2. Refresh dashboard
3. Check project name filter
4. Verify credentials were used

### Issue: Test Timeout

**Error:** `Test exceeded timeout`

**Solutions:**
1. Increase timeout in config
2. Check network connectivity
3. Review test complexity
4. Check BrowserStack queue time

### Issue: Parallel Limit Reached

**Error:** `Parallel limit reached`

**Solutions:**
1. Wait for current tests to finish
2. Upgrade BrowserStack plan
3. Reduce workers in config
4. Run tests in batches

## Cost Optimization

### Tips to Save Minutes

1. **Use Local Browsers for Development**
   ```bash
   # Local development
   yarn test
   
   # Only use BrowserStack for CI/CD or final validation
   yarn test:browserstack
   ```

2. **Run Smoke Tests First**
   ```bash
   # Quick smoke test on BrowserStack
   BROWSERSTACK=true yarn test --grep @smoke
   ```

3. **Optimize Test Execution**
   - Remove unnecessary waits
   - Use parallel execution wisely
   - Skip flaky tests

4. **Schedule Strategically**
   - Run full suite nightly
   - Use smoke tests for PRs
   - Batch similar tests

## Resources

- 📚 [BrowserStack Documentation](https://www.browserstack.com/docs)
- 🎭 [Playwright on BrowserStack](https://www.browserstack.com/docs/automate/playwright)
- 📊 [Dashboard](https://automate.browserstack.com)
- 👥 [Support](https://www.browserstack.com/support)
- 💰 [Pricing](https://www.browserstack.com/pricing)

## Support

For BrowserStack-specific issues:
1. Check [BrowserStack Status](https://status.browserstack.com)
2. Contact BrowserStack Support
3. Review [Documentation](https://www.browserstack.com/docs)

For framework-specific issues:
1. Check troubleshooting section above
2. Review `playwright.config.ts`
3. Check GitHub Actions logs

---

**Happy Cloud Testing! ☁️**
