import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/BasePage';

/**
 * Products/Inventory Page Object for SauceDemo
 * This page appears after successful login
 */
export class ProductsPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly productItems: Locator;
  private readonly addToCartButtons: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly menuButton: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  /**
   * Check if on products page
   */
  async isOnProductsPage(): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes('inventory.html') && await this.isVisible(this.pageTitle);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Get number of products
   */
  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  /**
   * Add product to cart by name
   */
  async addProductToCart(productName: string): Promise<void> {
    const kebabName = productName.toLowerCase().replace(/\s+/g, '-');
    const addButton = this.page.locator(`[data-test="add-to-cart-${kebabName}"]`);
    await this.click(addButton);
  }

  /**
   * Add first product to cart
   */
  async addFirstProductToCart(): Promise<void> {
    await this.click(this.addToCartButtons.first());
  }

  /**
   * Get shopping cart count
   */
  async getCartCount(): Promise<number> {
    try {
      const badgeText = await this.getText(this.shoppingCartBadge);
      return parseInt(badgeText, 10);
    } catch {
      return 0; // Badge not visible means cart is empty
    }
  }

  /**
   * Click shopping cart
   */
  async clickShoppingCart(): Promise<void> {
    await this.click(this.shoppingCartLink);
  }

  /**
   * Open menu
   */
  async openMenu(): Promise<void> {
    await this.click(this.menuButton);
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.wait(500); // Wait for menu animation
    const logoutLink = this.page.locator('#logout_sidebar_link');
    await this.click(logoutLink);
  }

  /**
   * Sort products
   */
  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.selectOption(this.sortDropdown, option);
  }

  /**
   * Get all product names
   */
  async getAllProductNames(): Promise<string[]> {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names;
  }

  /**
   * Get all product prices
   */
  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace('$', '')));
  }

  /**
   * Get product details by name
   */
  async getProductDetails(productName: string): Promise<{ name: string; price: string; description: string }> {
    const productItem = this.page.locator('.inventory_item', { hasText: productName });
    const name = await productItem.locator('.inventory_item_name').textContent();
    const price = await productItem.locator('.inventory_item_price').textContent();
    const description = await productItem.locator('.inventory_item_desc').textContent();

    return {
      name: name?.trim() || '',
      price: price?.trim() || '',
      description: description?.trim() || '',
    };
  }
}
