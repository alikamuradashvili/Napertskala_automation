import { BasePage } from './BasePage.js';

export class ServicePage extends BasePage {
  static selectors = {
    phone: 'a[href^="tel:"]', whatsapp: 'a[href^="https://wa.me/"]',
    thumbnails: 'button[aria-label^="Photo "]', calculatorChoices: '#calculator button',
    galleryArrow: label => `button[aria-label="${label}"]`,
  };
  async contactLinks() {
    const hrefs = async css => Promise.all((await this.elements(css)).map(el => el.getAttribute('href')));
    return { phones: await hrefs(ServicePage.selectors.phone), chats: await hrefs(ServicePage.selectors.whatsapp) };
  }
  async galleryPhotoCount() { return (await this.elements(ServicePage.selectors.thumbnails)).length; }
  async selectPhoto(index) {
    const thumbnail = (await this.elements(ServicePage.selectors.thumbnails))[index];
    await this.clickElement(thumbnail);
    await this.driver.wait(async () => (await thumbnail.getAttribute('class')).includes('opacity-100'), this.timeout);
  }
  async moveGallery(direction) {
    if (!['previous', 'next'].includes(direction)) throw new Error(`Unknown direction: ${direction}`);
    await this.clickElement(await this.visible(ServicePage.selectors.galleryArrow(direction === 'next' ? 'Next photo' : 'Previous photo')));
  }
  async calculatorChoiceLabels() {
    const labels = await Promise.all((await this.elements(ServicePage.selectors.calculatorChoices)).map(el => el.getText()));
    return [...new Set(labels)];
  }
  async selectCalculatorChoice(label) {
    // Choices can disappear when their category changes. Re-query instead of retaining stale elements.
    for (const el of await this.elements(ServicePage.selectors.calculatorChoices)) {
      if (await el.getText() === label) { await this.clickElement(el); return true; }
    }
    return false;
  }
}
