const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const path = require('path');
  const RAIZ = path.resolve(__dirname, '..');
  const src = 'file://' + path.join(RAIZ, 'descargas', 'Guia_estudio_Sistemas_Robotizados.html');
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 1 });
  const errs=[]; page.on('pageerror', e => errs.push(e.message));
  await page.goto(src, { waitUntil: 'load' });
  // comprobación de desplazamiento a 390 px
  await page.setViewportSize({ width: 390, height: 844 });
  const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('scroll extra movil px =', sw, 'errores JS =', errs);
  await page.setViewportSize({ width: 900, height: 1200 });
  // abrir todo para imprimir
  await page.evaluate(() => { document.querySelectorAll('details').forEach(d => d.open = true); document.querySelectorAll('details.yr').forEach(d=>d.hidden=false); document.querySelectorAll('.exb').forEach(e=>e.hidden=false); });
  await page.pdf({ path: path.join(RAIZ,'descargas','Guia_completa_Sistemas_Robotizados.pdf'), format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
  // PDF de ejercicios resueltos
  const html = await page.evaluate(() => {
    const css = Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('\n');
    const sec = document.getElementById('resueltos');
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Ejercicios resueltos</title><style>' + css + '</style></head><body style="padding:0 12mm"><h1>Sistemas Robotizados · Ejercicios resueltos</h1>' + sec.outerHTML + '</body></html>';
  });
  fs.writeFileSync(path.join(RAIZ,'build','_resueltos.html'), html);
  const p2 = await browser.newPage();
  await p2.goto('file://' + path.join(RAIZ,'build','_resueltos.html'), { waitUntil: 'load' });
  await p2.evaluate(() => { document.querySelectorAll('details').forEach(d => d.open = true); });
  await p2.pdf({ path: path.join(RAIZ,'descargas','Ejercicios_resueltos_Sistemas_Robotizados.pdf'), format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
  await browser.close();
  console.log('PDF listos');
})();
