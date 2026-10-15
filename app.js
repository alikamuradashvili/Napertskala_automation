#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const allowed = new Set(['--visible', '--smoke', '--help']);
const unknown = args.filter(arg => !allowed.has(arg));
if (unknown.length) {
  console.error(`Unknown option: ${unknown.join(', ')}. Run node app.js --help.`);
  process.exitCode = 2;
} else if (args.includes('--help')) {
  console.log(`Napertskala Chrome tests

node app.js [--visible] [--smoke]

--visible  Show Chrome while tests run
--smoke    Run only the homepage and language test

Environment: BASE_URL, WAIT_MS, HEADLESS, CHROME_BINARY, CHROMEDRIVER
Reports: artifacts/<timestamp>/results.json`);
} else {
  const testArgs = ['--test', '--test-concurrency=1'];
  if (args.includes('--smoke')) testArgs.push('--test-name-pattern=Homepage');
  testArgs.push('tests/site.test.js');
  console.log(`Testing ${process.env.BASE_URL || 'https://napertskala.ge'}`);
  const child = spawn(process.execPath, testArgs, {
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    env: { ...process.env, ...(args.includes('--visible') ? { HEADLESS: '0' } : {}) },
    stdio: 'inherit',
  });
  child.on('error', error => {
    console.error(`Unable to start tests: ${error.message}`);
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (signal) console.error(`Tests stopped: ${signal}`);
    process.exitCode = code ?? 1;
  });
}
