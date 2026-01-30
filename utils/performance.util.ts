import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Performance Testing Utility using Lighthouse
 * 
 * Features:
 * - Core Web Vitals measurement (LCP, FID, CLS)
 * - Performance score
 * - Best practices score
 * - SEO score
 * - Accessibility score
 * - Custom thresholds
 */

export interface PerformanceMetrics {
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  coreWebVitals: {
    LCP: number; // Largest Contentful Paint
    TBT: number; // Total Blocking Time
    CLS: number; // Cumulative Layout Shift
    FCP: number; // First Contentful Paint
    SI: number;  // Speed Index
    TTI: number; // Time to Interactive
  };
  timestamp: string;
  url: string;
}

export interface PerformanceThresholds {
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  lcp?: number;
  tbt?: number;
  cls?: number;
}

export class PerformanceUtil {
  private page: Page;
  private reportDir: string;

  constructor(page: Page, reportDir: string = 'reports/performance') {
    this.page = page;
    this.reportDir = reportDir;
    this.ensureReportDirectory();
  }

  private ensureReportDirectory(): void {
    const fullPath = path.resolve(this.reportDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  /**
   * Run Lighthouse audit
   */
  async runLighthouseAudit(options?: {
    thresholds?: PerformanceThresholds;
    port?: number;
  }): Promise<PerformanceMetrics> {
    const port = options?.port || 9222;
    
    try {
      // Dynamically import playAudit from 'playwright-lighthouse' (ESM)
      const { playAudit } = await import('playwright-lighthouse');
      // Run Lighthouse audit
      const lighthouseResults = await playAudit({
        page: this.page,
        port,
        thresholds: {
          performance: options?.thresholds?.performance || 50,
          accessibility: options?.thresholds?.accessibility || 50,
          'best-practices': options?.thresholds?.bestPractices || 50,
          seo: options?.thresholds?.seo || 50,
        },
        reports: {
          formats: {
            html: true,
            json: true,
          },
          directory: this.reportDir,
        },
      });

      // Extract metrics
      const audits = lighthouseResults.lhr.audits;
      const categories = lighthouseResults.lhr.categories;

      const metrics: PerformanceMetrics = {
        performanceScore: Math.round((categories.performance?.score || 0) * 100),
        accessibilityScore: Math.round((categories.accessibility?.score || 0) * 100),
        bestPracticesScore: Math.round((categories['best-practices']?.score || 0) * 100),
        seoScore: Math.round((categories.seo?.score || 0) * 100),
        coreWebVitals: {
          LCP: audits['largest-contentful-paint']?.numericValue || 0,
          TBT: audits['total-blocking-time']?.numericValue || 0,
          CLS: audits['cumulative-layout-shift']?.numericValue || 0,
          FCP: audits['first-contentful-paint']?.numericValue || 0,
          SI: audits['speed-index']?.numericValue || 0,
          TTI: audits['interactive']?.numericValue || 0,
        },
        timestamp: new Date().toISOString(),
        url: this.page.url(),
      };

      return metrics;
    } catch (error) {
      console.error('Lighthouse audit failed:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics using Performance API
   */
  async getPerformanceMetrics(): Promise<any> {
    return await this.page.evaluate(() => {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintMetrics = window.performance.getEntriesByType('paint');

      return {
        navigation: {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          domInteractive: perfData.domInteractive,
          responseTime: perfData.responseEnd - perfData.requestStart,
          dnsLookup: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcpConnection: perfData.connectEnd - perfData.connectStart,
        },
        paint: {
          firstPaint: paintMetrics.find((m) => m.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paintMetrics.find((m) => m.name === 'first-contentful-paint')?.startTime || 0,
        },
        resources: window.performance.getEntriesByType('resource').length,
      };
    });
  }

  /**
   * Assert performance thresholds
   */
  assertPerformanceThresholds(metrics: PerformanceMetrics, thresholds: PerformanceThresholds): void {
    const failures: string[] = [];

    if (thresholds.performance && metrics.performanceScore < thresholds.performance) {
      failures.push(`Performance score ${metrics.performanceScore} is below threshold ${thresholds.performance}`);
    }

    if (thresholds.accessibility && metrics.accessibilityScore < thresholds.accessibility) {
      failures.push(`Accessibility score ${metrics.accessibilityScore} is below threshold ${thresholds.accessibility}`);
    }

    if (thresholds.bestPractices && metrics.bestPracticesScore < thresholds.bestPractices) {
      failures.push(`Best Practices score ${metrics.bestPracticesScore} is below threshold ${thresholds.bestPractices}`);
    }

    if (thresholds.seo && metrics.seoScore < thresholds.seo) {
      failures.push(`SEO score ${metrics.seoScore} is below threshold ${thresholds.seo}`);
    }

    if (thresholds.lcp && metrics.coreWebVitals.LCP > thresholds.lcp) {
      failures.push(`LCP ${metrics.coreWebVitals.LCP}ms exceeds threshold ${thresholds.lcp}ms`);
    }

    if (thresholds.cls && metrics.coreWebVitals.CLS > thresholds.cls) {
      failures.push(`CLS ${metrics.coreWebVitals.CLS} exceeds threshold ${thresholds.cls}`);
    }

    if (failures.length > 0) {
      throw new Error(`Performance thresholds not met:\n${failures.join('\n')}`);
    }
  }

  /**
   * Generate performance report
   */
  async generateReport(metrics: PerformanceMetrics, fileName: string): Promise<string> {
    const reportPath = path.join(this.reportDir, `${fileName}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(metrics, null, 2));
    console.log(`\n✓ Performance report generated: ${reportPath}`);
    return reportPath;
  }
}
