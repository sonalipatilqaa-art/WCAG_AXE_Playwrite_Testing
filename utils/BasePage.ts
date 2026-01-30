import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Foundation class for all Page Objects
 * 
 * Features:
 * - Handles complex browser rendering mechanics
 * - Waits for network idle (crucial for SPAs)
 * - Advanced element interaction methods
 * - Support for Shadow DOM and Web Components
 * - Handles async rendering in React, Angular, Vue
 * - Screenshot and trace utilities
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL with network idle wait
   * Critical for SPAs that use client-side hydration
   */
  async navigateTo(url: string, waitForNetworkIdle: boolean = true): Promise<void> {
    if (waitForNetworkIdle) {
      await this.page.goto(url, { waitUntil: 'networkidle' });
    } else {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }
    await this.waitForPageReady();
  }

  /**
   * Wait for page to be fully ready
   * Handles async rendering in modern frameworks
   */
  async waitForPageReady(): Promise<void> {
    // Wait for DOM to be ready
    await this.page.waitForLoadState('domcontentloaded');
    
    // Wait for network to be idle (important for SPAs)
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      console.log('Network idle timeout - page may still be loading resources');
    });

    // Wait for document ready state
    await this.page.waitForFunction(() => document.readyState === 'complete');

    // Additional wait for frameworks that hydrate content
    await this.page.waitForTimeout(500);
  }

  /**
   * Enhanced click with visibility and actionability checks
   */
  async click(selector: string | Locator, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    
    // Wait for element to be visible and enabled
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    await expect(locator).toBeEnabled();
    
    // Scroll into view if needed
    await locator.scrollIntoViewIfNeeded();
    
    // Click with retry logic
    await locator.click({
      force: options?.force || false,
      timeout: options?.timeout || 10000,
    });
  }

  /**
   * Enhanced fill with clearing and validation
   */
  async fill(selector: string | Locator, value: string, options?: { clear?: boolean }): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    
    await locator.waitFor({ state: 'visible' });
    
    if (options?.clear !== false) {
      await locator.clear();
    }
    
    await locator.fill(value);
    
    // Validate the value was set
    await expect(locator).toHaveValue(value);
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string | Locator, timeout: number = 10000): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(selector: string | Locator, timeout: number = 10000): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get text content from element
   */
  async getText(selector: string | Locator): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: 'visible' });
    const text = await locator.textContent();
    return text?.trim() || '';
  }

  /**
   * Get attribute value from element
   */
  async getAttribute(selector: string | Locator, attribute: string): Promise<string | null> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: 'visible' });
    return await locator.getAttribute(attribute);
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string | Locator): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handle Shadow DOM elements
   * Critical for Web Components
   */
  async clickShadowElement(hostSelector: string, shadowSelector: string): Promise<void> {
    await this.page.evaluate(
      ({ host, shadow }) => {
        const hostElement = document.querySelector(host) as HTMLElement;
        if (hostElement?.shadowRoot) {
          const shadowElement = hostElement.shadowRoot.querySelector(shadow) as HTMLElement;
          shadowElement?.click();
        }
      },
      { host: hostSelector, shadow: shadowSelector }
    );
  }

  /**
   * Handle iframes
   */
  async getFrameLocator(frameSelector: string): Promise<any> {
    return this.page.frameLocator(frameSelector);
  }

  /**
   * Wait for specific network response
   * Useful for API-driven SPAs
   */
  async waitForResponse(urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout }
    );
  }

  /**
   * Wait for specific network request
   */
  async waitForRequest(urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    await this.page.waitForRequest(
      (request) => {
        const url = request.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout }
    );
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(fileName: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${fileName}.png`,
      fullPage: true,
    });
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Select dropdown option by value
   */
  async selectOption(selector: string | Locator, value: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  /**
   * Hover over element
   */
  async hover(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Go back
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  /**
   * Go forward
   */
  async goForward(): Promise<void> {
    await this.page.goForward({ waitUntil: 'networkidle' });
  }

  /**
   * Wait for specific amount of time
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Execute JavaScript in browser context
   */
  async executeScript(script: string): Promise<any> {
    return await this.page.evaluate(script);
  }

  /**
   * Handle browser dialogs (alerts, confirms, prompts)
   */
  async acceptDialog(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  }

  async dismissDialog(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });
  }
}
