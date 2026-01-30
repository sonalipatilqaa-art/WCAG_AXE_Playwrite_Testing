import { test, expect } from '../fixtures/test-fixtures';
import { TestCredentials } from '../fixtures/test-data';

/**
 * Accessibility Testing Suite
 * Demonstrates WCAG compliance testing
 */

test.describe('SauceDemo Accessibility Tests @accessibility', () => {
  test('should pass WCAG AA audit on login page', async ({ page, loginPage, accessibilityUtil }) => {
    // Navigate to login page
    await loginPage.navigate();

    // Run accessibility audit
    const report = await accessibilityUtil.runWCAG_AA_Audit();

    // Generate reports
    await accessibilityUtil.generateHTMLReport(report, 'login-page-accessibility');
    await accessibilityUtil.generateJSONReport(report, 'login-page-accessibility');

    // Log summary
    console.log(`\n📊 Accessibility Audit Results for Login Page:`);
    console.log(`   ✓ Passes: ${report.passes}`);
    console.log(`   ✗ Violations: ${report.violationCount}`);
    console.log(`   ⚠ Incomplete: ${report.incomplete}`);
    console.log(`   - Inapplicable: ${report.inapplicable}`);

    if (report.violationCount > 0) {
      console.log(`\n   Violation Breakdown:`);
      console.log(`   🔴 Critical: ${report.criticalViolations}`);
      console.log(`   🟠 Serious: ${report.seriousViolations}`);
      console.log(`   🟡 Moderate: ${report.moderateViolations}`);
      console.log(`   🔵 Minor: ${report.minorViolations}`);
    }

    // Assert no critical or serious violations
    expect(report.criticalViolations).toBe(0);
    expect(report.seriousViolations).toBe(0);
  });

  test('should pass WCAG AA audit on products page', async ({
    loginPage,
    accessibilityUtil,
  }) => {
    // Login first
    await loginPage.navigate();
    const { username, password } = TestCredentials.STANDARD_USER;
    await loginPage.login(username, password);

    // Run accessibility audit
    const report = await accessibilityUtil.runWCAG_AA_Audit();

    // Generate reports
    await accessibilityUtil.generateHTMLReport(report, 'products-page-accessibility');
    await accessibilityUtil.generateJSONReport(report, 'products-page-accessibility');

    // Log summary
    console.log(`\n📊 Accessibility Audit Results for Products Page:`);
    console.log(`   ✓ Passes: ${report.passes}`);
    console.log(`   ✗ Violations: ${report.violationCount}`);

    // Assert no critical violations
    expect(report.criticalViolations).toBe(0);
  });

  test('should run WCAG Level A audit', async ({ loginPage, accessibilityUtil }) => {
    await loginPage.navigate();

    const report = await accessibilityUtil.runWCAG_A_Audit();

    console.log(`\n📊 WCAG Level A Audit:`);
    console.log(`   Violations: ${report.violationCount}`);

    // Level A should have no critical violations
    expect(report.criticalViolations).toBe(0);
  });

  test('should run best practices audit', async ({ loginPage, accessibilityUtil }) => {
    await loginPage.navigate();

    const report = await accessibilityUtil.runBestPracticesAudit();

    await accessibilityUtil.generateHTMLReport(report, 'best-practices');

    console.log(`\n📊 Best Practices Audit:`);
    console.log(`   Violations: ${report.violationCount}`);
  });

  test('should check specific accessibility rules', async ({ loginPage, accessibilityUtil }) => {
    await loginPage.navigate();

    // Run audit with custom rules
    const report = await accessibilityUtil.runAccessibilityAudit({
      tags: ['wcag2aa'],
      disableRules: ['color-contrast'], // Example: disable specific rule if needed
    });

    console.log(`\n📊 Custom Rules Audit:`);
    console.log(`   Violations: ${report.violationCount}`);

    await accessibilityUtil.generateHTMLReport(report, 'custom-rules-audit');
  });
});
