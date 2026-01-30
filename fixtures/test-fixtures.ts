import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { AccessibilityUtil } from '../utils/accessibility.util';
import { PerformanceUtil } from '../utils/performance.util';

/**
 * Custom test fixtures
 * Provides easy access to page objects and utilities
 */
type TestFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  accessibilityUtil: AccessibilityUtil;
  performanceUtil: PerformanceUtil;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  
  accessibilityUtil: async ({ page }, use) => {
    await use(new AccessibilityUtil(page));
  },
  
  performanceUtil: async ({ page }, use) => {
    await use(new PerformanceUtil(page));
  },
});

export { expect } from '@playwright/test';
