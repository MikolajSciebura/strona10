const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to mobile
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('file://' + process.cwd() + '/skup-samochodow.html');

  const slider = await page.locator('#recent-buys-slider .slider-track');
  const initialTransform = await slider.evaluate(el => el.style.transform);
  console.log('Initial transform:', initialTransform);

  // Perform a swipe
  const box = await slider.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2, { steps: 10 });
  await page.mouse.up();

  // Wait for transition
  await page.waitForTimeout(500);

  const afterSwipeTransform = await slider.evaluate(el => el.style.transform);
  console.log('After swipe transform:', afterSwipeTransform);

  // Try to swipe again immediately
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2, { steps: 10 });
  await page.mouse.up();

  await page.waitForTimeout(500);

  const afterSecondSwipeTransform = await slider.evaluate(el => el.style.transform);
  console.log('After second swipe transform:', afterSecondSwipeTransform);

  await browser.close();
})();
