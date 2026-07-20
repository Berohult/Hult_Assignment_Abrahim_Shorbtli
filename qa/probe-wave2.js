// Functional probe for wave-2 features: smart suggest swap, memory suite,
// post-order rating, Owner Mode, sheet close buttons.
// usage: node probe-wave2.js [base-url]
const { chromium } = require('playwright-core');

(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:8321';
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

  const results = [];
  const check = (name, ok, extra) =>
    results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);

  await page.goto(base + '/demo.html?intro=0', { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.goto(base + '/demo.html?intro=0', { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 1. sheet close button dismisses the item sheet
  await page.evaluate(() => document.querySelector('[data-open="saffron-latte"]').click());
  await page.waitForTimeout(600);
  const sheetOpen = await page.evaluate(() => document.getElementById('itemSheet').classList.contains('show'));
  await page.evaluate(() => document.querySelector('#itemSheet .sheet-x').click());
  await page.waitForTimeout(600);
  const sheetClosed = await page.evaluate(() => !document.getElementById('itemSheet').classList.contains('show'));
  check('sheet-x closes item sheet', sheetOpen && sheetClosed);

  // 2. smart suggest: V60 + cake -> swap line with real savings; swap works
  await page.evaluate(() => { addToCart('ethiopia', [], 1); addToCart('saffron-cake', [], 1); renderCart(); });
  const swap = await page.evaluate(() => {
    const el = document.querySelector('#cartSheetBody [data-swap]');
    return { present: !!el, text: el ? el.parentElement.textContent : '' };
  });
  check('swap suggestion appears with savings', swap.present && /[٧7]/.test(swap.text), swap.text.slice(0, 60));
  await page.evaluate(() => document.querySelector('#cartSheetBody [data-swap]').click());
  await page.waitForTimeout(700);
  const afterSwap = await page.evaluate(() => ({
    ids: cart.map(l => l.id).join(','),
    total: cartTotal(),
  }));
  check('swap replaces pair with afternoon set', afterSwap.ids === 'afternoon' && afterSwap.total === 45, afterSwap.ids + ' @ ' + afterSwap.total);

  // 3. drinks-without-food rule
  await page.evaluate(() => { cart.length = 0; addToCart('espresso', [], 3); renderCart(); });
  const noFood = await page.evaluate(() => {
    const b = document.querySelector('#cartSheetBody [data-sug]');
    return b ? b.dataset.sug : null;
  });
  check('3 drinks + no food suggests date plate', noFood === 'dateplate');

  // 4. post-order stars: 5 stars -> simulated Google toast (no place id set)
  await page.evaluate(() => { renderCart(); });
  await page.evaluate(() => { logEv('order'); saveLastOrder(); document.getElementById('orderStatus').classList.add('show'); });
  await page.evaluate(() => document.querySelector('#cartSheetBody [data-star="5"]').click());
  await page.waitForTimeout(300);
  const starState = await page.evaluate(() => ({
    lit: document.querySelectorAll('#cartSheetBody .stars5 .lit').length,
    toast: document.getElementById('toast').textContent,
  }));
  check('5-star lights all + simulated Google toast', starState.lit === 5 && starState.toast.length > 5, starState.toast.slice(0, 40));

  // 5. memory: reload with empty cart -> usual strip; "Again" rehydrates
  await page.evaluate(() => { cart.length = 0; saveCart(); });
  await page.goto(base + '/demo.html?intro=0', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  const usual = await page.evaluate(() => ({
    strip: !!document.querySelector('#usualHost .usual'),
    text: (document.querySelector('#usualHost .u-t') || {}).textContent || '',
  }));
  check('your-usual strip appears after an order', usual.strip, usual.text.slice(0, 50));
  await page.evaluate(() => document.getElementById('usualGo').click());
  await page.waitForTimeout(400);
  const rehydrated = await page.evaluate(() => ({
    n: cartCount(), gone: !document.querySelector('#usualHost .usual'),
  }));
  check('Again rehydrates cart + strip clears', rehydrated.n === 3 && rehydrated.gone, rehydrated.n + ' items');

  // 6. Owner Mode: triple-tap wordmark opens cockpit with populated panels
  await page.evaluate(() => {
    const wm = document.querySelector('.wordmark-sm');
    wm.click(); wm.click(); wm.click();
  });
  await page.waitForTimeout(700);
  const om = await page.evaluate(() => ({
    open: document.getElementById('ownerView').classList.contains('show'),
    bars: document.querySelectorAll('#ownerView .om-bar').length,
    dots: document.querySelectorAll('#ownerView .om-dot').length,
    cards: document.querySelectorAll('#ownerView .om-card').length,
    taps: document.querySelector('#ownerView .om-live b').textContent,
  }));
  check('owner mode opens: 6 bars, 12 dots, 3 insights, live taps',
    om.open && om.bars === 6 && om.dots === 12 && om.cards === 3 && om.taps.length > 0,
    `taps=${om.taps}`);
  await page.evaluate(() => document.getElementById('omClose').click());
  await page.waitForTimeout(600);
  const omClosed = await page.evaluate(() => !document.getElementById('ownerView').classList.contains('show'));
  check('owner mode closes', omClosed);

  // 7. ?owner=1 boots straight into the cockpit; EN render works there too
  await page.goto(base + '/demo.html?intro=0&owner=1', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const omBoot = await page.evaluate(() => document.getElementById('ownerView').classList.contains('show'));
  check('?owner=1 opens cockpit at boot', omBoot);

  await browser.close();
  console.log(results.join('\n'));
  if (errs.length) { console.log('\nERRORS:\n' + errs.join('\n')); process.exitCode = 1; }
  if (results.some(r => r.startsWith('FAIL'))) process.exitCode = 1;
})().catch(e => { console.error('HARNESS ERROR: ' + e.message); process.exit(2); });
