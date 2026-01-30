import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Accessibility Testing Utility
 * 
 * Features:
 * - WCAG 2.1 Level A, AA, AAA compliance testing
 * - Detailed violation reports
 * - HTML report generation
 * - Custom rule configuration
 * - Impact-based filtering
 * - Best Practices checking
 */

export interface AccessibilityViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

export interface AccessibilityReport {
  url: string;
  timestamp: string;
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  violationCount: number;
  criticalViolations: number;
  seriousViolations: number;
  moderateViolations: number;
  minorViolations: number;
}

export class AccessibilityUtil {
  private page: Page;
  private reportDir: string;

  constructor(page: Page, reportDir: string = 'reports/accessibility') {
    this.page = page;
    this.reportDir = reportDir;
    this.ensureReportDirectory();
  }

  /**
   * Ensure report directory exists
   */
  private ensureReportDirectory(): void {
    const fullPath = path.resolve(this.reportDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  /**
   * Run accessibility audit with WCAG 2.1 Level AA standards
   */
  async runAccessibilityAudit(options?: {
    tags?: string[];
    rules?: Record<string, { enabled: boolean }>;
    disableRules?: string[];
  }): Promise<AccessibilityReport> {
    // Default to WCAG 2.1 Level AA
    const tags = options?.tags || ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

    let axeBuilder = new AxeBuilder({ page: this.page })
      .withTags(tags)
      .options({
        resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable'],
      });

    // Apply custom rules if provided
    if (options?.rules) {
      axeBuilder = axeBuilder.configure({ rules: options.rules });
    }

    // Disable specific rules if requested
    if (options?.disableRules) {
      options.disableRules.forEach((rule) => {
        axeBuilder = axeBuilder.disableRules([rule]);
      });
    }

    // Run the audit
    const results = await axeBuilder.analyze();

    // Process violations
    const violations: AccessibilityViolation[] = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact || 'unknown',
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary || '',
      })),
    }));

    // Count violations by impact
    const criticalViolations = violations.filter((v) => v.impact === 'critical').length;
    const seriousViolations = violations.filter((v) => v.impact === 'serious').length;
    const moderateViolations = violations.filter((v) => v.impact === 'moderate').length;
    const minorViolations = violations.filter((v) => v.impact === 'minor').length;

    const report: AccessibilityReport = {
      url: this.page.url(),
      timestamp: new Date().toISOString(),
      violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
      violationCount: violations.length,
      criticalViolations,
      seriousViolations,
      moderateViolations,
      minorViolations,
    };

    return report;
  }

  /**
   * Run WCAG 2.1 Level A audit
   */
  async runWCAG_A_Audit(): Promise<AccessibilityReport> {
    return await this.runAccessibilityAudit({
      tags: ['wcag2a', 'wcag21a'],
    });
  }

  /**
   * Run WCAG 2.1 Level AA audit (recommended)
   */
  async runWCAG_AA_Audit(): Promise<AccessibilityReport> {
    return await this.runAccessibilityAudit({
      tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    });
  }

  /**
   * Run WCAG 2.1 Level AAA audit (most strict)
   */
  async runWCAG_AAA_Audit(): Promise<AccessibilityReport> {
    return await this.runAccessibilityAudit({
      tags: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa'],
    });
  }

  /**
   * Run best practices audit
   */
  async runBestPracticesAudit(): Promise<AccessibilityReport> {
    return await this.runAccessibilityAudit({
      tags: ['best-practice'],
    });
  }

  /**
   * Generate HTML report from accessibility results
   */
  async generateHTMLReport(report: AccessibilityReport, fileName: string): Promise<string> {
    const reportPath = path.join(this.reportDir, `${fileName}.html`);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report - ${report.url}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 2rem; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 1rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .metric { padding: 1.5rem; border-radius: 8px; text-align: center; }
        .metric-label { font-size: 0.875rem; color: #666; margin-bottom: 0.5rem; }
        .metric-value { font-size: 2rem; font-weight: bold; }
        .passes { background: #d4edda; color: #155724; }
        .violations { background: #f8d7da; color: #721c24; }
        .incomplete { background: #fff3cd; color: #856404; }
        .inapplicable { background: #e2e3e5; color: #383d41; }
        .violation { margin: 1.5rem 0; padding: 1.5rem; border-left: 4px solid #dc3545; background: #fff; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .violation.critical { border-left-color: #dc3545; }
        .violation.serious { border-left-color: #fd7e14; }
        .violation.moderate { border-left-color: #ffc107; }
        .violation.minor { border-left-color: #17a2b8; }
        .violation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .violation-id { font-weight: bold; color: #333; font-size: 1.125rem; }
        .impact-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
        .impact-critical { background: #dc3545; color: white; }
        .impact-serious { background: #fd7e14; color: white; }
        .impact-moderate { background: #ffc107; color: #333; }
        .impact-minor { background: #17a2b8; color: white; }
        .violation-description { color: #666; margin-bottom: 0.5rem; }
        .violation-help { color: #007bff; text-decoration: none; }
        .violation-help:hover { text-decoration: underline; }
        .node { margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; }
        .node-target { font-family: monospace; font-size: 0.875rem; color: #e83e8c; margin-bottom: 0.5rem; }
        .node-html { font-family: monospace; font-size: 0.875rem; color: #666; background: #fff; padding: 0.5rem; border-radius: 4px; overflow-x: auto; }
        .timestamp { color: #999; font-size: 0.875rem; margin-top: 1rem; }
        .no-violations { padding: 2rem; text-align: center; color: #155724; background: #d4edda; border-radius: 8px; margin: 2rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Accessibility Audit Report</h1>
        <p><strong>URL:</strong> ${report.url}</p>
        <p class="timestamp"><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="metric passes">
                <div class="metric-label">Passes</div>
                <div class="metric-value">${report.passes}</div>
            </div>
            <div class="metric violations">
                <div class="metric-label">Violations</div>
                <div class="metric-value">${report.violationCount}</div>
            </div>
            <div class="metric incomplete">
                <div class="metric-label">Incomplete</div>
                <div class="metric-value">${report.incomplete}</div>
            </div>
            <div class="metric inapplicable">
                <div class="metric-label">Inapplicable</div>
                <div class="metric-value">${report.inapplicable}</div>
            </div>
        </div>

        <h2>Violation Breakdown</h2>
        <div class="summary">
            <div class="metric violations">
                <div class="metric-label">Critical</div>
                <div class="metric-value">${report.criticalViolations}</div>
            </div>
            <div class="metric violations">
                <div class="metric-label">Serious</div>
                <div class="metric-value">${report.seriousViolations}</div>
            </div>
            <div class="metric violations">
                <div class="metric-label">Moderate</div>
                <div class="metric-value">${report.moderateViolations}</div>
            </div>
            <div class="metric violations">
                <div class="metric-label">Minor</div>
                <div class="metric-value">${report.minorViolations}</div>
            </div>
        </div>

        <h2>Violations</h2>
        ${report.violations.length === 0 
          ? '<div class="no-violations">✓ No accessibility violations found!</div>' 
          : report.violations.map((violation) => `
            <div class="violation ${violation.impact}">
                <div class="violation-header">
                    <span class="violation-id">${violation.id}</span>
                    <span class="impact-badge impact-${violation.impact}">${violation.impact}</span>
                </div>
                <p class="violation-description">${violation.description}</p>
                <p><strong>How to fix:</strong> ${violation.help}</p>
                <p><a href="${violation.helpUrl}" target="_blank" class="violation-help">Learn more →</a></p>
                
                <h4>Affected Elements (${violation.nodes.length}):</h4>
                ${violation.nodes.map((node) => `
                    <div class="node">
                        <div class="node-target"><strong>Selector:</strong> ${node.target.join(', ')}</div>
                        <div class="node-html"><strong>HTML:</strong> ${node.html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                        ${node.failureSummary ? `<p><strong>Issue:</strong> ${node.failureSummary}</p>` : ''}
                    </div>
                `).join('')}
            </div>
          `).join('')}
        }
    </div>
</body>
</html>
    `;

    fs.writeFileSync(reportPath, html);
    console.log(`\n✓ Accessibility report generated: ${reportPath}`);
    return reportPath;
  }

  /**
   * Generate JSON report
   */
  async generateJSONReport(report: AccessibilityReport, fileName: string): Promise<string> {
    const reportPath = path.join(this.reportDir, `${fileName}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n✓ JSON report generated: ${reportPath}`);
    return reportPath;
  }

  /**
   * Assert no violations (fails test if violations found)
   */
  assertNoViolations(report: AccessibilityReport, allowedImpacts: string[] = []): void {
    const filteredViolations = report.violations.filter(
      (v) => !allowedImpacts.includes(v.impact)
    );

    if (filteredViolations.length > 0) {
      const message = `Found ${filteredViolations.length} accessibility violations:\n${filteredViolations
        .map((v) => `  - [${v.impact.toUpperCase()}] ${v.id}: ${v.description}`)
        .join('\n')}`;
      throw new Error(message);
    }
  }

  /**
   * Assert no critical or serious violations
   */
  assertNoCriticalViolations(report: AccessibilityReport): void {
    this.assertNoViolations(report, ['moderate', 'minor']);
  }
}
