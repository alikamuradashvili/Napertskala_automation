import assert from 'node:assert/strict';
import { pageSuite } from '../support/test-suite.js';

pageSuite('HomePage', check => {
  check('Test 1 - Homepage and language round trip', async ({ home }) => {
    await home.open();
    assert.ok(await home.headingText());
    await home.setLanguage('en');
    await home.waitForEnglishIntro();
    await home.setLanguage('ka');
  });
  check('Test 2 - Desktop section navigation and logo', async ({ home }) => {
    await home.resize(1440, 1000);
    await home.open(); await home.setLanguage('en');
    for (const section of ['home', 'services', 'about', 'contact']) await home.navigateTo(section);
    await home.scrollHome();
  });
  check('Test 3 - Every service chooser button', async ({ home }) => {
    await home.open(); await home.setLanguage('en');
    const count = await home.serviceChooserCount();
    assert.ok(count >= 4);
    for (let index = 0; index < count; index++) await home.chooseServices(index);
  });
  check('Test 4 - Mobile menu navigation and toggle', async ({ home }) => {
    await home.resize(390, 844);
    try {
      await home.open(); await home.setLanguage('en');
      for (const label of ['Home', 'Services', 'About', 'Contact']) await home.navigateMobile(label);
      await home.toggleMenu(); await home.toggleMenu();
      assert.equal(await home.mobileMenuIsOpen(), false);
    } finally { await home.resize(1440, 1000); }
  });
});
