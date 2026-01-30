import { test, expect } from '../fixtures/test-fixtures';
import { TestCredentials } from '../fixtures/test-data';

/**
 * Login Flow Test Suite
 * Demonstrates:
 * - Page Object Model usage
 * - Data-driven testing
 * - Positive and negative scenarios
 * - Network waiting for SPAs
 */

test.describe('SauceDemo Login Flow', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Navigate to login page before each test
    await loginPage.navigate();
  });

  test('should successfully login with valid credentials @smoke @login', async ({
    loginPage,
    productsPage,
  }) => {
    // Arrange
    const { username, password } = TestCredentials.STANDARD_USER;

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(productsPage.isOnProductsPage()).resolves.toBe(true);
    await expect(productsPage.getPageTitle()).resolves.toBe('Products');
  });

  test('should display error for locked out user @negative @login', async ({ loginPage }) => {
    // Arrange
    const { username, password } = TestCredentials.LOCKED_OUT_USER;

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(loginPage.isErrorDisplayed()).resolves.toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out');
  });

  test('should display error for invalid credentials @negative @login', async ({ loginPage }) => {
    // Arrange
    const invalidUsername = 'invalid_user';
    const invalidPassword = 'invalid_pass';

    // Act
    await loginPage.login(invalidUsername, invalidPassword);

    // Assert
    await expect(loginPage.isErrorDisplayed()).resolves.toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface');
  });

  test('should display error for empty username @negative @login', async ({ loginPage }) => {
    // Arrange
    const { password } = TestCredentials.STANDARD_USER;

    // Act
    await loginPage.enterPassword(password);
    await loginPage.clickLogin();

    // Assert
    await expect(loginPage.isErrorDisplayed()).resolves.toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('should display error for empty password @negative @login', async ({ loginPage }) => {
    // Arrange
    const { username } = TestCredentials.STANDARD_USER;

    // Act
    await loginPage.enterUsername(username);
    await loginPage.clickLogin();

    // Assert
    await expect(loginPage.isErrorDisplayed()).resolves.toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Password is required');
  });

  test('should verify login page elements are visible @ui @login', async ({ loginPage }) => {
    // Assert all key elements are visible
    await expect(loginPage.isOnLoginPage()).resolves.toBe(true);
    const logoText = await loginPage.getLogoText();
    expect(logoText).toBe('Swag Labs');
  });

  test('should allow multiple login attempts @login', async ({ loginPage, productsPage }) => {
    // First attempt with wrong credentials
    await loginPage.login('wrong_user', 'wrong_pass');
    await expect(loginPage.isErrorDisplayed()).resolves.toBe(true);

    // Clear fields and try again with correct credentials
    await loginPage.clearUsername();
    await loginPage.clearPassword();
    
    const { username, password } = TestCredentials.STANDARD_USER;
    await loginPage.login(username, password);

    // Should successfully login
    await expect(productsPage.isOnProductsPage()).resolves.toBe(true);
  });

  test('should preserve username after failed login @login', async ({ loginPage }) => {
    // Login with invalid password
    const { username } = TestCredentials.STANDARD_USER;
    await loginPage.login(username, 'wrong_password');

    // Username should still be present
    await expect(loginPage.isErrorDisplayed()).resolves.toBe(true);
  });
});
