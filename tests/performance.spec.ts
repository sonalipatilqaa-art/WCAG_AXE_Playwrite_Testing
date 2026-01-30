import { test, expect } from '../fixtures/test-fixtures';
import { TestCredentials } from '../fixtures/test-data';

/**
 * Performance Testing Suite
 * Demonstrates Core Web Vitals and Lighthouse integration
 * 
 * Note: Performance tests may be skipped in CI due to resource constraints
 * or run on specific projects only
 */

test.describe.skip('SauceDemo Performance Tests @performance', () => {
  // Note: Lighthouse tests are skipped by default as they require special setup
  // Remove .skip to enable these tests

  test('should meet performance thresholds on login page', async ({
    loginPage,
    performanceUtil,
  }) => {
    // Navigate
    await loginPage.navigate();

    // Run Lighthouse audit
    const metrics = await performanceUtil.runLighthouseAudit({
      thresholds: {
        performance: 70,
        accessibility: 80,
        bestPractices: 70,
        seo: 70,
      },
    });

    // Generate report
    await performanceUtil.generateReport(metrics, 'login-page-performance');

    // Log results
    console.log(`\n⚡ Performance Metrics for Login Page:`);
    console.log(`   Performance Score: ${metrics.performanceScore}/100`);
    console.log(`   Accessibility Score: ${metrics.accessibilityScore}/100`);
    console.log(`   Best Practices Score: ${metrics.bestPracticesScore}/100`);
    console.log(`   SEO Score: ${metrics.seoScore}/100`);
    console.log(`\n   Core Web Vitals:`);
    console.log(`   LCP: ${metrics.coreWebVitals.LCP}ms`);
    console.log(`   TBT: ${metrics.coreWebVitals.TBT}ms`);
    console.log(`   CLS: ${metrics.coreWebVitals.CLS}`);
    console.log(`   FCP: ${metrics.coreWebVitals.FCP}ms`);

    // Assert thresholds
    expect(metrics.performanceScore).toBeGreaterThanOrEqual(70);
    expect(metrics.accessibilityScore).toBeGreaterThanOrEqual(80);
  });

  test('should measure performance metrics using Performance API', async ({
    loginPage,
    performanceUtil,
  }) => {
    await loginPage.navigate();

    // Get performance metrics
    const metrics = await performanceUtil.getPerformanceMetrics();

    console.log(`\n⚡ Performance API Metrics:`);
    console.log(`   DOM Content Loaded: ${metrics.navigation.domContentLoaded}ms`);
    console.log(`   Load Complete: ${metrics.navigation.loadComplete}ms`);
    console.log(`   First Paint: ${metrics.paint.firstPaint}ms`);
    console.log(`   First Contentful Paint: ${metrics.paint.firstContentfulPaint}ms`);
    console.log(`   Resources Loaded: ${metrics.resources}`);

    // Basic assertions
    expect(metrics.navigation.domContentLoaded).toBeLessThan(3000);
    expect(metrics.paint.firstContentfulPaint).toBeLessThan(3000);
  });

  test('should compare performance across different users', async ({
    page,
    loginPage,
    performanceUtil,
  }) => {
    // Test standard user
    await loginPage.navigate();
    await loginPage.login(
      TestCredentials.STANDARD_USER.username,
      TestCredentials.STANDARD_USER.password
    );

    const standardMetrics = await performanceUtil.getPerformanceMetrics();

    // Logout and test performance glitch user
    await page.goto('https://www.saucedemo.com');
    await loginPage.login(
      TestCredentials.PERFORMANCE_GLITCH_USER.username,
      TestCredentials.PERFORMANCE_GLITCH_USER.password
    );

    const glitchMetrics = await performanceUtil.getPerformanceMetrics();

    console.log(`\n⚡ Performance Comparison:`);
    console.log(`   Standard User - DOM Content Loaded: ${standardMetrics.navigation.domContentLoaded}ms`);
    console.log(`   Glitch User - DOM Content Loaded: ${glitchMetrics.navigation.domContentLoaded}ms`);

    // Performance glitch user should be slower
    // This test demonstrates comparative performance testing
  });
});

/**
 * Basic performance checks that can run in all environments
 */
test.describe('Basic Performance Checks @performance', () => {
  test('should load login page within acceptable time', async ({ loginPage, page }) => {
    const startTime = Date.now();
    await loginPage.navigate();
    const loadTime = Date.now() - startTime;

    console.log(`\n⚡ Login page load time: ${loadTime}ms`);

    // Assert page loads within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should complete login within acceptable time', async ({ loginPage, page }) => {
    await loginPage.navigate();

    const startTime = Date.now();
    await loginPage.login(
      TestCredentials.STANDARD_USER.username,
      TestCredentials.STANDARD_USER.password
    );
    const loginTime = Date.now() - startTime;

    console.log(`\n⚡ Login completion time: ${loginTime}ms`);

    // Assert login completes within 3 seconds
    expect(loginTime).toBeLessThan(3000);
  });
});
