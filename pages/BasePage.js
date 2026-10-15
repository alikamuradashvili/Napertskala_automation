import { By, until } from 'selenium-webdriver';

export class BasePage {
  static selectors = {
    heading: 'h1', language: 'button[aria-label="Change language"]',
    home: '[aria-label="Napertskala home"]', privacy: 'a[href="/privacy"]',
  };

  constructor(driver, { baseUrl, timeout = 20000 }) {
    this.driver = driver;
    this.baseUrl = new URL(baseUrl);
    this.timeout = timeout;
  }

  async visible(css) {
    const el = await this.driver.wait(until.elementLocated(By.css(css)), this.timeout);
    await this.driver.wait(until.elementIsVisible(el), this.timeout);
    return el;
  }
  elements(css) { return this.driver.findElements(By.css(css)); }
  async click(css) { await (await this.visible(css)).click(); }
  async load(path) {
    await this.driver.get(new URL(path, this.baseUrl).href);
    await this.ready();
  }
  async ready() {
    await this.visible(BasePage.selectors.heading);
    await this.driver.wait(async () => (await this.visible(BasePage.selectors.language)).isEnabled(), this.timeout);
  }
  async headingText() { return (await this.visible(BasePage.selectors.heading)).getText(); }
  async setLanguage(language) {
    if (!['ka', 'en'].includes(language)) throw new Error(`Unsupported language: ${language}`);
    const button = await this.visible(BasePage.selectors.language);
    const matches = async () => /^en/i.test((await button.getText()).trim()) === (language === 'ka');
    if (!await matches()) await button.click();
    await this.driver.wait(matches, this.timeout);
  }
  async clickElement(el) {
    await this.driver.executeScript('arguments[0].scrollIntoView({block:"center",behavior:"instant"})', el);
    const point = await this.driver.wait(async () => this.driver.executeScript(`
      const e=arguments[0],r=e.getBoundingClientRect();
      for(const y of [.5,.2,.8]) for(const x of [.5,.2,.8]) {
        const px=r.left+r.width*x,py=r.top+r.height*y;
        const hit=document.elementFromPoint(px,py);
        if(hit && (e===hit || e.contains(hit))) return {x:Math.round(px),y:Math.round(py)};
      }
      return false;`, el), this.timeout, `Control covered: ${await el.getAttribute('outerHTML')}`);
    await this.driver.actions().move({ x: point.x, y: point.y }).click().perform();
  }
  async waitForPath(path) {
    await this.driver.wait(until.urlIs(new URL(path, this.baseUrl).href), this.timeout);
  }
  async returnHome() {
    await this.click(BasePage.selectors.home);
    await this.waitForPath('/');
  }
  async openPrivacy() {
    await this.clickElement(await this.visible(BasePage.selectors.privacy));
    await this.waitForPath('/privacy');
    await this.ready();
  }
}
