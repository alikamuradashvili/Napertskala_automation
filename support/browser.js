import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export const browserConfig = {
  baseUrl: process.env.BASE_URL || 'https://napertskala.ge',
  timeout: Number(process.env.WAIT_MS || 20000),
};

export async function createBrowser() {
  const options = new chrome.Options();
  if (process.env.HEADLESS !== '0') options.addArguments('--headless=new');
  options.addArguments('--window-size=1440,1000', '--disable-notifications');
  if (process.env.CHROME_BINARY) options.setChromeBinaryPath(process.env.CHROME_BINARY);
  let builder = new Builder().forBrowser('chrome').setChromeOptions(options);
  if (process.env.CHROMEDRIVER) builder = builder.setChromeService(new chrome.ServiceBuilder(process.env.CHROMEDRIVER));
  const driver = await builder.build();
  await driver.manage().setTimeouts({ pageLoad: 60000, script: browserConfig.timeout });
  return driver;
}
