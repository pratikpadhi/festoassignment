import { Page , Locator, expect,request} from '@playwright/test';

export class OrderPage {
  private countryField : Locator
  private countryvalueField : Locator
  private cvvField : Locator
  private nameOnCardField : Locator
  private placeOrderButton : Locator
  private orderid : Locator
  private orderhistorypage : Locator
  constructor(private page: Page) {
    this.countryField = this.page.locator('input[placeholder="Select Country"]');
    this.countryvalueField = this.page.locator("//span[ text()=' India']/parent::button");
    this.cvvField = this.page.locator("//div[text()='CVV Code ']/following-sibling::input");
    this.nameOnCardField = this.page.locator("//div[text()='Name on Card ']/following-sibling::input");
    this.placeOrderButton = this.page.getByText("Place Order ");
    this.orderid = this.page.locator("//td[contains(text(),'You can see')]/parent::tr/following-sibling::tr/td/label");
    this.orderhistorypage = this.page.getByText(" Orders History Page ");
  }

  async filldetails(countryName: string , cvv : string , nameOnCard : string) {
    await this.countryField.pressSequentially(countryName);
    await expect(this.countryvalueField).toBeVisible();
    await this.countryvalueField.click({force:true});
    await this.cvvField.fill(cvv);
    await this.nameOnCardField.fill(nameOnCard);
    await this.page.waitForTimeout(4000);
    await this.placeOrderButton.click({force:true});
    await this.page.waitForLoadState('load');
  }



  async getOrderId(): Promise<string> {
    const orderIdText = await this.orderid
    await expect(orderIdText).toBeVisible({ timeout: 5000 });
   const textContent = await orderIdText.textContent();
    if (orderIdText) {
      if(textContent)
      {
      console.log(`Order ID found: ${textContent}`);
        return textContent?.replaceAll('|', '').trim() ;
      }
    }else
    throw new Error('Order ID not found after placing order');
    return '';
  }

  async navigatetoorderhistorypage() {
    await this.orderhistorypage.click();
    await this.page.waitForLoadState('load');
  }

   async validateOrderDetailsAPI(orderApiEndpoint: string, orderId: string , token : string) {
   const apiContext = await request.newContext();
     const response = await apiContext.get(orderApiEndpoint.concat(orderId), {
      headers: {
        'Content-Type': 'application/json' ,
        'authorization': token
      },
      data: {
        id: orderId,
      }
    });
    if (response.status() !== 200) {
      throw new Error(`API call failed with status: ${response.status()}`);
    } else {
      console.log(`API call successful with status: ${response.status()}`);
    }
    const responseBody = await response.json();
    console.log('API Response:', responseBody);
  }
}
