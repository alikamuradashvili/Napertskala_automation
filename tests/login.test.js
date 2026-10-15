import assert from 'node:assert/strict';
import { pageSuite } from '../support/test-suite.js';

pageSuite('LoginPage', check => {
  check('Test 1 - Login fields and empty form validation', async ({ login }) => {
    await login.open(); await login.setLanguage('en');
    await login.waitForFields();
    await login.submit();
    assert.equal(await login.formIsValid(), false);
    assert.equal(await login.isOpen(), true);
  });
  check('Test 2 - Google sign in destination', async ({ login, config }) => {
    await login.open();
    assert.equal(await login.googleDestination(), new URL('/api/auth/google/start', config.baseUrl).href);
  });
});
