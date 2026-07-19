// QA harness: screenshots + console/pageerror/overflow checks.
// usage: node shoot.js <file-or-url> <out-prefix> [--dark] [--js="code run before shot"] [--mobile-only]
const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  const target = args[0];
  const out = args[1] || 'shot';
  const dark = args.includes('--dark');
  const mobileOnly = args.includes('--mobile-only');
  const jsArg = args.find(a => a.startsWith('--js='));
  const preJs = jsArg ? jsArg.slice(5) : null;

  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const issues = [];
  const configs = [
    { name: 'iphone13', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    { name: 'desktop', viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 },
  ].filter(c => !mobileOnly || c.isMobile);

  for (const cfg of configs) {
    const ctx = await browser.newContext({
      viewport: cfg.viewport,
      deviceScaleFactor: cfg.deviceScaleFactor,
      isMobile: !!cfg.isMobile,
      hasTouch: !!cfg.hasTouch,
      colorScheme: dark ? 'dark' : 'light',
    });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') issues.push(`${cfg.name} console: ${m.text()}`); });
    page.on('pageerror', e => issues.push(`${cfg.name} PAGEERROR: ${e.message}`));
    page.on('requestfailed', r => issues.push(`${cfg.name} reqfail: ${r.url().slice(0, 120)}`));

    const url = /^https?:/.test(target) ? target : 'file://' + path.resolve(target);
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(700);
    if (preJs) { await page.evaluate(preJs); await page.waitForTimeout(700); }
    await page.screenshot({ path: `${out}-${cfg.name}.png`, fullPage: true });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (overflow > 1) issues.push(`${cfg.name}: horizontal overflow ${overflow}px`);
    await ctx.close();
  }

  await browser.close();
  if (issues.length) { console.log('ISSUES:\n' + issues.join('\n')); process.exitCode = 1; }
  else console.log('CLEAN');
})().catch(e => { console.error('HARNESS ERROR: ' + e.message); process.exit(2); });
