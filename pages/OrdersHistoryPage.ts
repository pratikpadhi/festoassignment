import { Page,Locator } from '@playwright/test';

export class OrdersHistoryPage {
  private orderidlist : Locator
  constructor(private page: Page) {
    this.orderidlist = this.page.locator('.table-hover.ng-star-inserted tbody tr th')
  }

 

  async findOrderInTable(orderID: string): Promise<boolean> {
   let found = false;
   for (let i = 0; i < await this.orderidlist.count(); i++) {
     const textContent = await this.orderidlist.nth(i).textContent();
     if (textContent?.includes(orderID)) {
       found = true;
       break;
     }
   }
   return found;
 }
}
