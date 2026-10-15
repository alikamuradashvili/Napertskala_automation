import { BasePage } from './BasePage.js';

export class PrivacyPage extends BasePage {
  static selectors = { backHome: 'a[href="/"]' };
  open() { return this.load('/privacy'); }
  async waitForHeadingChange(original) {
    await this.driver.wait(async () => await this.headingText() !== original, this.timeout);
  }
  async returnHome() {
    await this.clickElement(await this.visible(PrivacyPage.selectors.backHome));
    await this.waitForPath('/');
  }
}
