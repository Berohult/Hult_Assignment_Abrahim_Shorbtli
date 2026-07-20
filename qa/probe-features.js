// Functional probe for the round-2 demo features:
// dietary filters, ramadan mode, text-size cycle, loyalty ribbon, window labels.
// usage: node probe-features.js [base-url]
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
  await page.evaluate(() => { localStorage.clear(); });
  await page.goto(base + '/demo.html?intro=0', { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 1. decaf filter hides caffeinated cards, keeps caffeine-free ones
  await page.click('.fchip[data-f="decaf"]');
  await page.waitForTimeout(200);
  const decaf = await page.evaluate(() => ({
    saffronHidden: document.querySelector('#menu .card[data-open="saffron-latte"]').classList.contains('fhide'),
    pomVisible: !document.querySelector('#menu .card[data-open="pom-rose"]').classList.contains('fhide'),
    visibleCount: document.querySelectorAll('#menu .card[data-open]:not(.fhide)').length,
  }));
  check('decaf filter hides caffeinated', decaf.saffronHidden && decaf.pomVisible, `${decaf.visibleCount} visible`);
  await page.click('.fchip[data-f="decaf"]');

  // 2. vegan filter excludes dairy/egg
  await page.click('.fchip[data-f="vegan"]');
  await page.waitForTimeout(200);
  const vegan = await page.evaluate(() => ({
    shakHidden: document.querySelector('#menu .card[data-open="shakshuka"]').classList.contains('fhide'),
    datesVisible: !document.querySelector('#menu .card[data-open="dateplate"]').classList.contains('fhide'),
  }));
  check('vegan filter', vegan.shakHidden && vegan.datesVisible);
  await page.click('.fchip[data-f="vegan"]');
  await page.waitForTimeout(200);
  const reset = await page.evaluate(() => document.querySelectorAll('#menu .card.fhide').length);
  check('filters reset restores all', reset === 0);

  // 3. ramadan mode: iftar chapter + chip appear first, greet swaps; toggling off removes
  await page.click('#rmBtn');
  await page.waitForTimeout(600);
  const rm = await page.evaluate(() => ({
    iftar: !!document.getElementById('ch-iftar'),
    firstChip: document.querySelector('.chip') && document.querySelector('.chip').dataset.chip,
    windowLabel: !!document.querySelector('#ch-iftar .origin'),
    persisted: localStorage.getItem('wasm-ramadan') === '1',
    btnOn: document.getElementById('rmBtn').classList.contains('on'),
  }));
  check('ramadan on: iftar chapter first + window labels + persisted',
    rm.iftar && rm.firstChip === 'iftar' && rm.windowLabel && rm.persisted && rm.btnOn);
  await page.click('#rmBtn');
  await page.waitForTimeout(500);
  const rmOff = await page.evaluate(() => ({
    iftar: !!document.getElementById('ch-iftar'),
    firstChip: document.querySelector('.chip').dataset.chip,
  }));
  check('ramadan off restores menu', !rmOff.iftar && rmOff.firstChip === 'sig');

  // 4. text-size cycle 0 -> 1 -> 2 -> 0
  const fs0 = await page.evaluate(() => getComputedStyle(document.body).fontSize);
  await page.click('#fsBtn'); await page.waitForTimeout(100);
  const fs1 = await page.evaluate(() => ({ a: document.documentElement.getAttribute('data-fs'), s: getComputedStyle(document.body).fontSize }));
  await page.click('#fsBtn'); await page.waitForTimeout(100);
  const fs2 = await page.evaluate(() => ({ a: document.documentElement.getAttribute('data-fs'), s: getComputedStyle(document.body).fontSize }));
  await page.click('#fsBtn'); await page.waitForTimeout(100);
  const fs3 = await page.evaluate(() => document.documentElement.getAttribute('data-fs'));
  check('text-size cycles', fs1.a === '1' && fs2.a === '2' && fs3 === null
    && parseFloat(fs1.s) > parseFloat(fs0) && parseFloat(fs2.s) > parseFloat(fs1.s),
    `${fs0} -> ${fs1.s} -> ${fs2.s}`);

  // 5. loyalty ribbon: 2 items -> 3-left message; 5 items -> unlocked
  await page.evaluate(() => {
    addToCart('espresso', [], 2);
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => { renderCart(); });
  const loyal2 = await page.evaluate(() => ({
    stamps: document.querySelectorAll('#cartSheetBody .stamp.f').length,
    text: document.querySelector('#cartSheetBody .loyal .lt').textContent,
  }));
  check('loyalty at 2 items', loyal2.stamps === 2, loyal2.text.slice(0, 40));
  await page.evaluate(() => { addToCart('latte', [], 3); renderCart(); });
  const loyal5 = await page.evaluate(() => ({
    stamps: document.querySelectorAll('#cartSheetBody .stamp.f').length,
    done: document.querySelector('#cartSheetBody .loyal .lt').textContent.length > 0,
    total: document.querySelector('.cart-total') && document.querySelector('.cart-total').textContent,
  }));
  check('loyalty unlocked at 5', loyal5.stamps === 5 && loyal5.done);

  // 6. seasonal chapter present with limited badge
  const season = await page.evaluate(() => ({
    ch: !!document.getElementById('ch-season'),
    badge: !!document.querySelector('#ch-season .ch-lim'),
    mango: !!document.querySelector('#menu .card[data-open="mango-yuzu"]'),
  }));
  check('seasonal chapter + badge + item', season.ch && season.badge && season.mango);

  // 7. EN pass over new features
  await page.evaluate(() => window.setLang('en'));
  await page.waitForTimeout(600);
  const en = await page.evaluate(() => ({
    dir: document.documentElement.dir,
    filterLabel: document.querySelector('#filters .fl').textContent,
    seasonTitle: document.querySelector('#ch-season .ch-title').textContent,
  }));
  check('EN re-render of new features', en.dir === 'ltr' && en.filterLabel === 'For you' && en.seasonTitle === 'Summer Season');

  await browser.close();
  console.log(results.join('\n'));
  if (errs.length) { console.log('\nERRORS:\n' + errs.join('\n')); process.exitCode = 1; }
  if (results.some(r => r.startsWith('FAIL'))) process.exitCode = 1;
})().catch(e => { console.error('HARNESS ERROR: ' + e.message); process.exit(2); });
