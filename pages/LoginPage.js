import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  static selectors = {
    email: 'input[name="email"]', password: 'input[name="password"]',
    submit: 'form button[type="submit"]', google: 'a[href="/api/auth/google/start"]',
  };
  open() { return this.load('/login'); }
  async waitForFields() {
    await this.visible(LoginPage.selectors.email);
    await this.visible(LoginPage.selectors.password);
  }
  async googleDestination() { return (await this.visible(LoginPage.selectors.google)).getAttribute('href'); }
  submit() { return this.click(LoginPage.selectors.submit); }
  formIsValid() { return this.driver.executeScript('return document.querySelector("form").checkValidity()'); }
  async isOpen() { return new URL(await this.driver.getCurrentUrl()).pathname === '/login'; }
}
