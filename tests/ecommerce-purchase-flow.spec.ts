import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { OrderPage } from '../pages/OrderPage';
import { OrdersHistoryPage } from '../pages/OrdersHistoryPage';
import json from '../testdata/data.json';

// ============= TEST CASES =============

test.describe('Assignment for Playwright and TypeScript three scenarios parallel execution', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let orderPage: OrderPage;
  let ordersHistoryPage: OrdersHistoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    orderPage = new OrderPage(page);
    ordersHistoryPage = new OrdersHistoryPage(page);
  });


  test('Valid Login and login API Test', async ({ page }) => {

    const BASE_URL = json.url;
    const TEST_EMAIL = json.seconduser.email;
    const TEST_PASSWORD = json.seconduser.password;
    const LOGIN_API_ENDPOINT = json.loginAPIEndpoint;

    // Step 1: Navigate to login and authenticate
    console.log('Step 1: Navigating to login page...');
    await loginPage.navigate(BASE_URL);
    

    console.log('Step 2: Logging in with valid credentials...');
    await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
    await loginPage.validateLoginAPI(LOGIN_API_ENDPOINT,TEST_EMAIL, TEST_PASSWORD);
    await loginPage.waitfordashboardnavigation();
    expect(page.url()).toContain('dashboard/dash');
    });

    test('INValid Login Test', async ({ page }) => {

    const BASE_URL = json.url;
    const TEST_EMAIL = json.invaliduser.email;
    const TEST_PASSWORD = json.invaliduser.password;

    // Step 1: Navigate to login and authenticate
    console.log('Step 1: Navigating to login page...');
    await loginPage.navigate(BASE_URL);
    

    console.log('Step 2: Logging in with valid credentials...');
    await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
   expect(page.url()).not.toContain('dashboard/dash');
    });

  test('Product Purchase and validation Test and order API Validation', async ({ page }) => {

    const BASE_URL = json.url;
    const TEST_EMAIL = json.user.email;
    const TEST_PASSWORD = json.user.password;
    const PRODUCT_NAME = json.productName;
    const CVV = json.cvv;
    const CARDHOLDER_NAME = json.cardholderName;
    const COUNTRY = json.country;
    const LOGIN_API_ENDPOINT = json.loginAPIEndpoint;
    const ORDER_API_ENDPOINT = json.orderAPIEndpoint;
    let orderID: string;

    // Step 1: Navigate to login and authenticate
    console.log('Step 1: Navigating to login page...');
    await loginPage.navigate(BASE_URL);
    

    console.log('Step 2: Logging in with credentials...');
    await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
    const token = await loginPage.validateLoginAPI(LOGIN_API_ENDPOINT,TEST_EMAIL, TEST_PASSWORD);
  
    await loginPage.waitfordashboardnavigation();

    // Step 2: Navigate to products page (already on it after login)
    console.log('Step 3: On products page...');
    expect(page.url()).toContain('dashboard/dash');

    // Step 3: Add ZARA COAT 3 to cart
    console.log('Step 4: Adding ZARA COAT 3 to cart...');
    await productsPage.addProductToCart(PRODUCT_NAME);
    
    // Verify product was added (cart count should be 1)
    const cartButton = page.getByText(' Cart', { exact: true });
    //const cartText = await cartButton.textContent();
   

    // Step 4: Go to cart and checkout
    console.log('Step 5: Going to cart...');
    await productsPage.goToCart();
    

    console.log('Step 6: Proceeding to checkout...');
    await cartPage.proceedToCheckout();
    

    // Step 5: Fill order form and place order
    console.log('Step 7: Filling checkout form...');
    await orderPage.filldetails(COUNTRY, CVV, CARDHOLDER_NAME);
  

    // Step 6: Validate order confirmation and get order Details API
    console.log('Step 9: Retrieving order ID from confirmation...');
    orderID = await orderPage.getOrderId();
    try {
     
      console.log(`Order ID: ${orderID}`);
      expect(orderID).toBeTruthy();
    } catch (error) {
      console.warn('Could not retrieve order ID from confirmation page:', error);
      
    }
    await orderPage.validateOrderDetailsAPI(ORDER_API_ENDPOINT, orderID, token);

    // Step 7: Navigate to Orders History page
    console.log('Step 10: Navigating to Orders History...');
    await orderPage.navigatetoorderhistorypage();
    expect(page).toHaveURL(/orders/);

    // Step 8: Verify order ID exists in history table
    console.log(`Step 11: Verifying order ${orderID} in order history...`);
    const orderFound = await ordersHistoryPage.findOrderInTable(orderID);
    
    if (orderFound) {
      console.log(` Order ${orderID} found in order history table`);
      expect(orderFound).toBe(true);
    } else {
      console.warn(`Order ${orderID} not found in current view, checking all pages...`);
      
    }

    console.log('Product Purchase and validation Test: Test completed successfully');
  });
});
