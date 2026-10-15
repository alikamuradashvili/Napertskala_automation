import { By, until } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  static selectors = {
    navigation: 'header nav button', menu: 'button[aria-label="Open menu"]',
    mobileMenu: 'header > nav',
    choosers: '//button[contains(. ,"Choose a service") or @aria-label="Choose a service" or @aria-label="View services"]',
    service: slug => `#services a[href="/services/${slug}"]`,
  };
  open() { return this.load('/'); }
  resize(width, height) { return this.driver.manage().window().setRect({ width, height }); }
  async waitForEnglishIntro() {
    await this.driver.wait(until.elementLocated(By.xpath('//p[contains(text(),"Call or message us")]')), this.timeout);
  }
  async navigateTo(section) {
    const index = ['home', 'services', 'about', 'contact'].indexOf(section);
    if (index < 0) throw new Error(`Unknown section: ${section}`);
    await (await this.elements(HomePage.selectors.navigation))[index].click();
    await this.waitForSection(section);
  }
  async waitForSection(section) {
    await this.driver.wait(async () => this.driver.executeScript(
      'const r=document.getElementById(arguments[0]).getBoundingClientRect();return r.top<innerHeight && r.bottom>80', section), this.timeout);
  }
  async serviceChooserCount() {
    return (await this.driver.findElements(By.xpath(HomePage.selectors.choosers))).length;
  }
  async chooseServices(index) {
    const buttons = await this.driver.findElements(By.xpath(HomePage.selectors.choosers));
    await this.clickElement(buttons[index]);
    await this.waitForSection('services');
  }
  async scrollHome() {
    await this.click(BasePage.selectors.home);
    await this.driver.wait(async () => (await this.driver.executeScript('return scrollY')) < 100, this.timeout);
  }
  toggleMenu() { return this.click(HomePage.selectors.menu); }
  async mobileMenuIsOpen() { return (await this.elements(HomePage.selectors.mobileMenu)).length > 0; }
  async navigateMobile(label) {
    const labels = ['Home', 'Services', 'About', 'Contact'];
    if (!labels.includes(label)) throw new Error(`Unknown mobile item: ${label}`);
    await this.toggleMenu();
    const item = await this.driver.wait(until.elementLocated(By.xpath(`//header/nav//button[normalize-space(.)="${label}"]`)), this.timeout);
    await item.click();
    await this.driver.wait(async () => !await this.mobileMenuIsOpen(), this.timeout);
  }
  async openService(slug) {
    await this.clickElement(await this.visible(HomePage.selectors.service(slug)));
    await this.waitForPath(`/services/${slug}`);
  }
}
