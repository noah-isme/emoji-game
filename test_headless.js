const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });

  const failedRequests = [];
  const badResponses = [];

  page.on('requestfailed', req => {
    const f = req.failure && req.failure();
    failedRequests.push({ url: req.url(), errorText: f ? f.errorText : 'unknown' });
  });

  page.on('response', res => {
    try {
      const status = res.status();
      if (status >= 400) badResponses.push({ url: res.url(), status, statusText: res.statusText() });
    } catch (e) {
      // ignore
    }
  });

  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  try {
    await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    console.log('GOTO ERROR:', e.toString());
  }

  // wait a bit for the game to start and audio unlocking prompt
  await new Promise(r => setTimeout(r, 6000));

  await page.screenshot({ path: 'test-screenshot.png', fullPage: true });

  console.log('Failed requests:', failedRequests);
  console.log('Bad responses:', badResponses);

  await browser.close();

  if (failedRequests.length > 0 || badResponses.length > 0) process.exit(2);
  else process.exit(0);
})();
