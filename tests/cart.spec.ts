import { test, expect } from '../fixtures/test-fixtures';
import { TestCredentials, TestProducts } from '../fixtures/test-data';

/**
 * Cart Management Test Suite
 */

test.describe('SauceDemo Cart Management', () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    // Login and add items to cart
    await loginPage.navigate();
    const { username, password } = TestCredentials.STANDARD_USER;
    await loginPage.login(username, password);
    
    // Add products to cart
    await productsPage.addProductToCart(TestProducts.BACKPACK);
    await productsPage.addProductToCart(TestProducts.BIKE_LIGHT);
    await productsPage.clickShoppingCart();
  });

  test('should display correct items in cart @smoke @cart', async ({ cartPage }) => {
    // Assert
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);

    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames).toContain(TestProducts.BACKPACK);
    expect(itemNames).toContain(TestProducts.BIKE_LIGHT);
  });

  test('should remove item from cart @cart', async ({ cartPage }) => {
    // Act
    await cartPage.removeItemByIndex(0);

    // Assert
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('should remove all items from cart @cart', async ({ cartPage }) => {
    // Act
    await cartPage.removeAllItems();

    // Assert
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);
  });

  test('should navigate back to products page @cart', async ({ cartPage, productsPage }) => {
    // Act
    await cartPage.clickContinueShopping();

    // Assert
    await expect(productsPage.isOnProductsPage()).resolves.toBe(true);
  });

  test('should display cart page title @cart', async ({ cartPage }) => {
    // Assert
    const title = await cartPage.getPageTitle();
    expect(title).toBe('Your Cart');
  });
});
