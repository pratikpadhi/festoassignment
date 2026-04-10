import { Locator, Page } from '@playwright/test';

export class CartPage {

  private checkoutButton : Locator
  constructor(private page: Page) {
this.checkoutButton = this.page.getByRole('button', { name: /Checkout/i });

  }

  async proceedToCheckout() {
    // Click Checkout button
    await this.checkoutButton.click();
    await this.page.waitForURL('**/dashboard/order**');
    await this.page.waitForLoadState('load');
  }
}
