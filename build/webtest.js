const { chromium } = require('playwright');
const pages = ['index','t1','t2','t3','t4','t5','t6','practicas','resueltos','examenes','autoevaluacion','formulario','glosario','plan','bibliografia'];
(async () => {
  const browser = await chromium.launch();
  const base = 'http://localhost:8765/';
  for (const pg of pages) {
    for (const vp of [{width:1280,height:900},{width:390,height:844}]) {
      const page = await browser.newPage({ viewport: vp });
      const errs = [];
      page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
      page.on('console', m => { if (m.type()==='error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push(m.text()); });
      await page.goto(base + pg + '.html', { waitUntil: 'load' });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (sw > 0 || errs.length) console.log(pg, vp.width, 'scrollExtra=', sw, errs.slice(0,3));
      await page.close();
    }
  }
  // búsqueda
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(base + 'index.html', { waitUntil: 'load' });
  await p.fill('#q-global', 'splines');
  await p.waitForTimeout(800);
  const hits = await p.$$eval('#q-res a', els => els.map(e => e.getAttribute('href')));
  console.log('búsqueda "splines":', hits.length, hits.slice(0,4));
  // enlaces internos rotos
  const broken = [];
  for (const pg of pages) {
    await p.goto(base + pg + '.html', { waitUntil: 'load' });
    const links = await p.$$eval('a[href]', els => els.map(e => e.getAttribute('href')));
    for (const l of links) {
      if (l.startsWith('#')) { const id = l.slice(1); const ok = await p.evaluate(i => !!document.getElementById(i), id); if (!ok) broken.push(pg+': '+l); }
      else if (l.endsWith('.html') || l.includes('.html#')) {
        const [file, hash] = l.split('#');
        const r = await p.evaluate(async f => (await fetch(f, {method:'HEAD'})).status, file);
        if (r !== 200) broken.push(pg+': '+l+' ('+r+')');
        if (hash) { await p.goto(base+file, {waitUntil:'load'}); const ok = await p.evaluate(i => !!document.getElementById(i), hash); if(!ok) broken.push(pg+': '+l+' (ancla)'); }
      }
    }
  }
  console.log('enlaces rotos:', broken.length, broken.slice(0,10));
  // simulador en t4
  await p.goto(base + 't4.html', { waitUntil: 'load' });
  const before = await p.textContent('#out-fk');
  await p.fill('#s-t1', '60'); await p.dispatchEvent('#s-t1','input');
  const after = await p.textContent('#out-fk');
  console.log('simulador:', before.replace(/\n/g,' | '), '=>', after.replace(/\n/g,' | '));
  // comprobar el registro del service worker (sólo en http)
  const sw = await p.evaluate(async () => { try { const r = await navigator.serviceWorker.getRegistration(); return !!r; } catch(e) { return 'err ' + e.message; } });
  console.log('service worker registrado:', sw);
  
  await browser.close();
})();
