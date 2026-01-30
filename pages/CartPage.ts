import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';

/**
 * Shopping Cart Page Object for SauceDemo
 */
export class CartPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly removeButtons: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButtons = page.locator('[data-test^="remove"]');
  }

  /**
   * Check if on cart page
   */
  async isOnCartPage(): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes('cart.html') && await this.isVisible(this.pageTitle);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Click checkout button
   */
  async clickCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  /**
   * Click continue shopping
   */
  async clickContinueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  /**
   * Remove item from cart by index
   */
  async removeItemByIndex(index: number): Promise<void> {
    await this.click(this.removeButtons.nth(index));
  }

  /**
   * Remove all items from cart
   */
  async removeAllItems(): Promise<void> {
    const count = await this.removeButtons.count();
    for (let i = count - 1; i >= 0; i--) {
      await this.click(this.removeButtons.nth(i));
      await this.wait(200);
    }
  }

  /**
   * Get cart item names
   */
  async getCartItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }
}
