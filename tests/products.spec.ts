import { test, expect } from '../fixtures/test-fixtures';
import { TestCredentials, TestProducts } from '../fixtures/test-data';

/**
 * Products Page Test Suite
 * Demonstrates:
 * - E2E shopping flow
 * - Dynamic element interaction
 * - State management testing
 */

test.describe('SauceDemo Products and Shopping', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Login before each test
    await loginPage.navigate();
    const { username, password } = TestCredentials.STANDARD_USER;
    await loginPage.login(username, password);
  });

  test('should display all products after login @smoke @products', async ({ productsPage }) => {
    // Assert
    await expect(productsPage.isOnProductsPage()).resolves.toBe(true);
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(6);
  });

  test('should add product to cart @smoke @cart', async ({ productsPage }) => {
    // Act
    await productsPage.addProductToCart(TestProducts.BACKPACK);

    // Assert
    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe(1);
  });

  test('should add multiple products to cart @cart', async ({ productsPage }) => {
    // Act
    await productsPage.addProductToCart(TestProducts.BACKPACK);
    await productsPage.addProductToCart(TestProducts.BIKE_LIGHT);
    await productsPage.addProductToCart(TestProducts.BOLT_TSHIRT);

    // Assert
    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe(3);
  });

  test('should navigate to cart page @cart', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();

    // Act
    await productsPage.clickShoppingCart();

    // Assert
    await expect(cartPage.isOnCartPage()).resolves.toBe(true);
  });

  test('should display correct product details @products', async ({ productsPage }) => {
    // Act
    const productDetails = await productsPage.getProductDetails(TestProducts.BACKPACK);

    // Assert
    expect(productDetails.name).toBe(TestProducts.BACKPACK);
    expect(productDetails.price).toContain('$');
    expect(productDetails.description).toBeTruthy();
  });

  test('should sort products by name A-Z @products', async ({ productsPage }) => {
    // Act
    await productsPage.sortProducts('az');

    // Assert
    const productNames = await productsPage.getAllProductNames();
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  test('should sort products by name Z-A @products', async ({ productsPage }) => {
    // Act
    await productsPage.sortProducts('za');

    // Assert
    const productNames = await productsPage.getAllProductNames();
    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
  });

  test('should sort products by price low to high @products', async ({ productsPage }) => {
    // Act
    await productsPage.sortProducts('lohi');

    // Assert
    const prices = await productsPage.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('should sort products by price high to low @products', async ({ productsPage }) => {
    // Act
    await productsPage.sortProducts('hilo');

    // Assert
    const prices = await productsPage.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('should successfully logout @logout', async ({ productsPage, loginPage }) => {
    // Act
    await productsPage.logout();

    // Assert
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);
  });

  test('should maintain cart after navigation @cart', async ({
    productsPage,
    cartPage,
  }) => {
    // Add product and navigate to cart
    await productsPage.addProductToCart(TestProducts.BACKPACK);
    await productsPage.clickShoppingCart();

    // Verify in cart
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    // Go back to products
    await cartPage.clickContinueShopping();
    await expect(productsPage.isOnProductsPage()).resolves.toBe(true);

    // Cart should still have 1 item
    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe(1);
  });
});
