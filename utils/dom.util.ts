import { Page, Locator } from '@playwright/test';

/**
 * Helper utilities for complex DOM interactions
 * Especially useful for Angular, React, Vue.js applications
 */

export class DOMUtil {
  /**
   * Wait for element to be stable (no animations)
   */
  static async waitForStableElement(locator: Locator, timeout: number = 5000): Promise<void> {
    const startTime = Date.now();
    let previousBox = await locator.boundingBox();

    while (Date.now() - startTime < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const currentBox = await locator.boundingBox();

      if (
        previousBox &&
        currentBox &&
        previousBox.x === currentBox.x &&
        previousBox.y === currentBox.y &&
        previousBox.width === currentBox.width &&
        previousBox.height === currentBox.height
      ) {
        return;
      }

      previousBox = currentBox;
    }
  }

  /**
   * Get element by data-testid (best practice for testing)
   */
  static getByTestId(page: Page, testId: string): Locator {
    return page.locator(`[data-testid="${testId}"]`);
  }

  /**
   * Get element by role and name (accessible)
   */
  static getByRole(page: Page, role: string, name?: string): Locator {
    return name ? page.getByRole(role as any, { name }) : page.getByRole(role as any);
  }

  /**
   * Get element by label text
   */
  static getByLabel(page: Page, label: string): Locator {
    return page.getByLabel(label);
  }

  /**
   * Get element by placeholder
   */
  static getByPlaceholder(page: Page, placeholder: string): Locator {
    return page.getByPlaceholder(placeholder);
  }

  /**
   * Get element by text content
   */
  static getByText(page: Page, text: string | RegExp): Locator {
    return page.getByText(text);
  }

  /**
   * Wait for all network requests to complete
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for specific API call to complete
   */
  static async waitForAPIResponse(
    page: Page,
    apiPattern: string | RegExp,
    timeout: number = 30000
  ): Promise<any> {
    const response = await page.waitForResponse(
      (resp) => {
        const url = resp.url();
        return typeof apiPattern === 'string' ? url.includes(apiPattern) : apiPattern.test(url);
      },
      { timeout }
    );
    return await response.json();
  }

  /**
   * Intercept and mock API response
   */
  static async mockAPIResponse(page: Page, apiPattern: string | RegExp, mockData: any): Promise<void> {
    await page.route(
      (url) => {
        const urlStr = url.toString();
        return typeof apiPattern === 'string' ? urlStr.includes(apiPattern) : apiPattern.test(urlStr);
      },
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockData),
        });
      }
    );
  }

  /**
   * Get all elements matching selector
   */
  static async getAllElements(page: Page, selector: string): Promise<Locator[]> {
    const locator = page.locator(selector);
    const count = await locator.count();
    const elements: Locator[] = [];

    for (let i = 0; i < count; i++) {
      elements.push(locator.nth(i));
    }

    return elements;
  }

  /**
   * Scroll to bottom of page (infinite scroll)
   */
  static async scrollToBottom(page: Page, maxScrolls: number = 10): Promise<void> {
    let previousHeight = 0;
    let scrollCount = 0;

    while (scrollCount < maxScrolls) {
      const currentHeight = await page.evaluate(() => document.body.scrollHeight);

      if (currentHeight === previousHeight) {
        break;
      }

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      previousHeight = currentHeight;
      scrollCount++;
    }
  }

  /**
   * Handle file upload
   */
  static async uploadFile(locator: Locator, filePath: string | string[]): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  /**
   * Get local storage item
   */
  static async getLocalStorageItem(page: Page, key: string): Promise<string | null> {
    return await page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * Set local storage item
   */
  static async setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
    await page.evaluate(
      ({ k, v }) => localStorage.setItem(k, v),
      { k: key, v: value }
    );
  }

  /**
   * Clear local storage
   */
  static async clearLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => localStorage.clear());
  }

  /**
   * Get cookies
   */
  static async getCookies(page: Page): Promise<any[]> {
    return await page.context().cookies();
  }

  /**
   * Set cookies
   */
  static async setCookie(page: Page, name: string, value: string, options?: any): Promise<void> {
    await page.context().addCookies([{ name, value, ...options }]);
  }

  /**
   * Clear all cookies
   */
  static async clearCookies(page: Page): Promise<void> {
    await page.context().clearCookies();
  }
}
