// Viewport screenshots per section for design review.
// usage: node sections.js <url> <out-prefix> [lang]
const { chromium } = require('playwright-core');

(async () => {
  const [url, out, lang] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--disable-gpu'] });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(url, { waitUntil: 'load' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await page.waitForTimeout(900);
  if (lang) { await page.evaluate(l => window.setLang && window.setLang(l), lang); await page.waitForTimeout(900); }
  await page.evaluate(() => document.querySelectorAll('.r').forEach(e => e.classList.add('in')));

  const stops = await page.evaluate(() =>
    ['.hero', ...[...document.querySelectorAll('.chapter')].map(s => '#' + s.id)]);
  let i = 0;
  for (const sel of stops) {
    await page.evaluate(s => document.querySelector(s)?.scrollIntoView(), sel);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${out}-${String(i).padStart(2, '0')}${sel.replace(/[#.]/g, '-')}.png` });
    i++;
  }
  // open an item sheet
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector('[data-open="saffron-latte"]')?.click());
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}-sheet.png` });
  // add to cart, open cart
  await page.evaluate(() => document.getElementById('sheetAdd')?.click());
  await page.waitForTimeout(900);
  await page.evaluate(() => document.getElementById('obView')?.click());
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}-cart.png` });

  console.log(errs.length ? 'ISSUES:\n' + errs.join('\n') : 'CLEAN');
  await browser.close();
})().catch(e => { console.error('HARNESS ERROR: ' + e.message); process.exit(2); });
