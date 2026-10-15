# Napertskala Chrome automation

Selenium WebDriver tests for https://napertskala.ge. Tests live in this folder; the website source is not modified.

## Run

### IntelliJ: click the class to run

For JavaScript tests and breakpoints, select **Chrome Tests** in the top-right Run dropdown (replacing **Current File**). Click **Run ▶** or **Debug**. This Node.js configuration runs the test file directly with visible Chrome; debug uses the same process so breakpoints in `tests/site.test.js` and `pages/*.js` can be hit. Requires IntelliJ's Node.js plugin. Reopen the project if the new shared configuration has not appeared yet.

Open `src/NapertskalaTest.java`, then click the green arrow next to the class or `main` and choose **Run NapertskalaTest**. You can also select the shared **NapertskalaTest** Run configuration and press Run. Chrome opens and results appear in IntelliJ's Run panel.

This Java application class launches the existing JavaScript Selenium Page Object Model suite. It requires JDK 17+ and the Node.js dependencies described below. If IntelliJ asks for a Project SDK, select an installed JDK. Optional program arguments: `--smoke` for the homepage only, `--headless` to hide Chrome. A failed test produces a nonzero exit code.

This is a runnable Node.js package. With Node.js 20+ and Chrome installed:

```powershell
npm install
npm start
```

Package commands:

- `npm start` — full suite with visible Chrome.
- `npm test` — full suite, headless by default.
- `npm run test:visible` — full suite with visible Chrome.
- `npm run test:smoke` — quick homepage/language test.
- `npm run test:smoke:visible` — quick test with visible Chrome.

The same scripts work with pnpm. If npm is unavailable on this computer, use the double-click launcher below or `node app.js --visible`. The entry point works from any current directory. Run `node app.js --help` for options.

**On this computer:** double-click `Run Tests.cmd` in this folder. Chrome opens visibly, runs the suite, and the results window stays open. Dependencies are already installed. The launcher can find the bundled Node.js even when it is absent from your terminal's PATH.

Requires Node.js 20+ and Google Chrome. Install dependencies once with `pnpm install` (or `npm install`). Selenium Manager automatically obtains the ChromeDriver that matches Chrome; the first run needs internet access.

From PowerShell in this folder:

```powershell
.\run-tests.ps1
```

Watch Chrome perform the tests:

```powershell
.\run-tests.ps1 -Visible
```

Run only tests whose names match a phrase:

```powershell
.\run-tests.ps1 -Visible -TestName 'Homepage'
```

Test a development server:

```powershell
.\run-tests.ps1 -Visible -BaseUrl http://localhost:3000
```

The direct command is `node --test --test-concurrency=1 tests/site.test.js`. Set `HEADLESS=0` in the environment to show Chrome. The package scripts run headless unless that variable is set.

## Coverage

- Georgian/English language switching.
- Desktop navigation, logo, service chooser buttons, and mobile menu.
- Each of the six homepage service cards and its destination.
- Service phone/WhatsApp link formats, gallery thumbnails and previous/next controls when multiple photos exist.
- Available calculator option buttons.
- Privacy navigation and translated heading.
- Login inputs, empty-form validation, and Google sign-in URL.

This is a public frontend suite. It does not authenticate, create users, edit admin content, place phone calls, send WhatsApp messages, or complete Google sign-in. External map/social destinations are not clicked. Calculator choices are exercised, but price correctness and every category/subcategory combination are not yet covered. Hidden services intentionally cause the corresponding service-card test to fail so coverage changes are visible.

## Selectors and failures

The suite uses Page Object Model. Selectors and browser interactions live in page classes; test scenarios keep assertions and user flows. Prefer stable `aria-label`, field `name`, section IDs, and link destinations over styling classes. The source reference used was `C:\Users\alika\Desktop\Napertskala\Napertskala\site`.

```text
pages/
  BasePage.js       Shared waits, mouse interactions, language and navigation
  HomePage.js       Desktop/mobile menu and service cards
  ServicePage.js    Contact links, gallery and calculator
  PrivacyPage.js    Privacy heading and return navigation
  LoginPage.js      Login fields and validation
support/
  browser.js        Chrome creation and environment configuration
tests/
  site.test.js      All-pages Run/Debug entry point
```

To add a flow, put its selectors and actions in the relevant page class, then call those methods from a test. Page objects share one browser session per run. Selectors are exposed through each class's static `selectors` property; no selectors or direct DOM interactions belong in the scenarios.

Each page suite saves `artifacts/<timestamp>/<suite>/results.json`. Failed cases also save a Chrome screenshot and page HTML. A failing test returns a nonzero exit code. Artifacts are ignored by Git; keep screenshots/HTML private when extending this suite to authenticated pages.

Optional environment variables: `BASE_URL`, `HEADLESS`, `WAIT_MS` (default 20000), `CHROME_BINARY`, and `CHROMEDRIVER` (explicit driver path for offline/preinstalled setups).

## Initial live run — October 15, 2026

10 of 11 tests passed in Chrome. Desktop navigation failed because the floating green Services button covers the footer phone control at 1440 × 1000. The test deliberately uses a real mouse action and reports this obstruction. The other service, gallery, calculator, mobile, privacy, language, and login checks passed. Authenticated admin actions and external contact flows remain outside this suite.


## Separate page tests

Tests are split by page, with separately reported Test 1, Test 2, and so on:

- `tests/home.test.js`: 4 tests for language, navigation, service buttons, and mobile menu.
- `tests/login.test.js`: 2 tests for form validation and Google destination.
- `tests/privacy.test.js`: 2 tests for navigation and language switching.
- `tests/welding.test.js`, `electrical.test.js`, `laser-cutting.test.js`, `excavator.test.js`, `towing.test.js`, `diagnostics.test.js`: 4 tests per service for card navigation, contact links, gallery, and calculator choices.

There are 32 tests across nine page suites. Every test opens its required page; every suite owns its browser and report. Browser actions and selectors remain in `pages/`. Shared setup and reports live in `support/test-suite.js`, and shared service scenarios in `support/service-scenarios.js`.

In IntelliJ choose **Test - home**, **Test - login**, **Test - welding**, etc. in the Run dropdown, then click Run or Debug. Choose **Chrome Tests** or **NapertskalaTest** to run everything. Reopen the project if new configurations have not appeared.

Command examples: `npm run test:home`, `npm run test:login`, `npm run test:welding`. Each file can also run directly, for example `node --test tests/privacy.test.js`. Use only `tests/site.test.js` to run the whole suite; do not pass it alongside the individual files because it imports those files.
