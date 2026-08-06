const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://levelup-ai-tawny.vercel.app/', { waitUntil: 'networkidle0' });
  
  // Force dashboard to show
  await page.evaluate(() => {
    document.getElementById('app-login').style.display = 'none';
    document.getElementById('app-dashboard').style.display = 'block';
  });
  
  await page.screenshot({ path: 'puppeteer_dashboard.png' });
  await browser.close();
})();
