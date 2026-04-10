import { Page, Locator,expect} from '@playwright/test';



export class ProductsPage {
    private addtocart : Locator
  constructor(private page: Page) {
    this.addtocart = this.page.locator('.btn.btn-custom');
  }

  async addProductToCart(productName: string) {
    // Find product card by searching for text containing product name
    // Then locate the Add to Cart button within that same card
    try {
      // First check if product exists on the page
      console.log(`Looking for product: ${productName}`);
       await expect(await this.page.locator(`text=${productName}`)).toBeVisible();
       const productExists = await this.page.locator(`text=${productName}`).count() > 0;
      if (!productExists) {
        throw new Error(`Product "${productName}" not found`);
      }else
      {
       const addToCartButton = this.page.locator(`//b[text()='${productName}']/parent::h5/following-sibling::button`).nth(1);
        await addToCartButton.click();
     
      }
      // Wait for cart to update  
      await this.page.waitForLoadState('load');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  }

  async goToCart() {
    // Click on Cart button in navigation
    await this.addtocart.nth(2).click();
    await this.page.waitForURL('**/dashboard/cart');
    await this.page.waitForLoadState('load');
  }
}
