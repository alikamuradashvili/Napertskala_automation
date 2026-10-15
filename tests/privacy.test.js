import assert from 'node:assert/strict';
import { pageSuite } from '../support/test-suite.js';

pageSuite('PrivacyPage', check => {
  check('Test 1 - Open privacy from homepage and return', async ({ home, privacy }) => {
    await home.open(); await home.openPrivacy();
    assert.ok(await privacy.headingText());
    await privacy.returnHome();
  });
  check('Test 2 - Privacy language switching', async ({ privacy }) => {
    await privacy.open(); await privacy.setLanguage('ka');
    const original = await privacy.headingText();
    await privacy.setLanguage('en');
    await privacy.waitForHeadingChange(original);
  });
});
