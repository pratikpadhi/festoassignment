import { Locator, Page ,request} from '@playwright/test';

export class LoginPage {
private usernameInput : Locator
private passwordInput : Locator
private loginButton : Locator
  constructor(private page: Page) { 
this.usernameInput  =  this.page.locator('input[placeholder="email@example.com"]')
this.passwordInput  =  this.page.locator('input[placeholder="enter your passsword"]')
this.loginButton = this.page.getByRole('button', { name: 'Login' })

}
 async navigate(url : string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('load');
  }

  async login(email: string, password: string) {
    // Fill email field
    await this.usernameInput.fill(email);

    // Fill password field
    await this.passwordInput.fill(password);

    // Click Login button
    await this.loginButton.click();
    
   
  }

   async waitfordashboardnavigation() {
    // Wait for navigation to dashboard
    await this.page.waitForURL('**/dashboard/dash');
    await this.page.waitForLoadState('load');
   }

    async validateLoginAPI(endpoint: string, email: string, password: string) {
    // Wait for navigation to dashboard
    const apiContext = await request.newContext();
    const response = await apiContext.post(endpoint, {
      data: {
        userEmail: email,
        userPassword: password
      }
    });
    if (response.status() !== 200) {
      throw new Error(`API login failed with status: ${response.status()}`);
    } else{
      console.log(`API login successful with status: ${response.status()}`);
    }
    const responseBody = await response.json();
    console.log('API Response:', responseBody);
    return responseBody.token; // Return token for further use
   }
}
