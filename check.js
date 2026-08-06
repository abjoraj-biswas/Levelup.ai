const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) console.log('RESPONSE ERROR:', response.url(), response.status());
  });

  await page.goto('https://levelup-ai-tawny.vercel.app/', { waitUntil: 'networkidle0' });
  
  const title = await page.title();
  console.log('PAGE TITLE:', title);
  
  const bodyHtml = await page.evaluate(() => document.body.innerHTML);
  require('fs').writeFileSync('puppeteer_body.html', bodyHtml);
  
  await page.screenshot({ path: 'puppeteer_screenshot.png' });
  
  await browser.close();
})();
