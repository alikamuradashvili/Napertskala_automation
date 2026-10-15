import { describe, test, before, after } from 'node:test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createBrowser, browserConfig } from './browser.js';
import { HomePage } from '../pages/HomePage.js';
import { ServicePage } from '../pages/ServicePage.js';
import { PrivacyPage } from '../pages/PrivacyPage.js';
import { LoginPage } from '../pages/LoginPage.js';

// Each page suite owns its browser, hooks and report, including when run alone.
export function pageSuite(name, scenarios) {
  describe(name, { concurrency: false }, () => {
    const context = { config: browserConfig };
    const results = [];
    const output = `artifacts/${new Date().toISOString().replace(/[:.]/g, '-')}/${name}`;
    before(async () => {
      await mkdir(output, { recursive: true });
      context.driver = await createBrowser();
      for (const [key, Page] of Object.entries({ home: HomePage, service: ServicePage, privacy: PrivacyPage, login: LoginPage })) {
        context[key] = new Page(context.driver, browserConfig);
      }
    });
    after(async () => {
      try { await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2)); }
      finally { if (context.driver) await context.driver.quit(); }
    });
    const check = (title, scenario) => test(title, async () => {
      try {
        await scenario(context);
        results.push({ name: title, status: 'passed' });
      } catch (error) {
        const filename = title.replace(/[^a-z0-9]+/gi, '-');
        if (context.driver) {
          await writeFile(`${output}/${filename}.png`, await context.driver.takeScreenshot(), 'base64').catch(() => {});
          await writeFile(`${output}/${filename}.html`, await context.driver.getPageSource()).catch(() => {});
        }
        results.push({ name: title, status: 'failed', error: String(error) });
        throw error;
      }
    });
    scenarios(check);
  });
}
