import assert from 'node:assert/strict';
import { pageSuite } from './test-suite.js';

export function serviceSuite(slug) {
  const openService = async ({ home, service }) => {
    await home.open(); await home.setLanguage('en');
    await home.openService(slug);
    await service.ready(); await service.setLanguage('en');
  };
  pageSuite(`Service-${slug}`, check => {
    check('Test 1 - Service card destination and return home', async context => {
      await openService(context);
      assert.ok((await context.service.headingText()).trim());
      await context.service.returnHome();
    });
    check('Test 2 - Phone and WhatsApp links', async context => {
      await openService(context);
      const { phones, chats } = await context.service.contactLinks();
      assert.ok(phones.length > 0); assert.ok(chats.length > 0);
      for (const phone of phones) assert.match(phone.replace(/[\s()-]/g, ''), /^tel:\+?\d{7,15}$/);
      for (const chat of chats) assert.match(chat, /^https:\/\/wa\.me\/\d+/);
    });
    check('Test 3 - Gallery thumbnails and arrows', async context => {
      await openService(context);
      const count = await context.service.galleryPhotoCount();
      for (let index = 0; index < count; index++) await context.service.selectPhoto(index);
      if (count > 1) {
        await context.service.moveGallery('previous');
        await context.service.moveGallery('next');
      }
    });
    check('Test 4 - Available calculator choices', async context => {
      await openService(context);
      for (const label of await context.service.calculatorChoiceLabels()) await context.service.selectCalculatorChoice(label);
    });
  });
}
