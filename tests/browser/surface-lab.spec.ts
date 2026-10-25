import { test, expect } from '@playwright/test';
test('Surface Lab controls, comparison, keyboard access, and responsive layout', async ({
  page,
}) => {
  // Match the 390×844 viewport used by the mobile visual review.
  if (page.viewportSize()!.width < 640) await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Surface Lab', exact: true }).click();
  await expect(page).toHaveURL(/surface-lab/);
  await page.goto('/surface-lab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#lab-main')).toBeFocused();
  const specimen = page.locator('.live-specimen');
  await expect(specimen).toHaveAttribute('data-tactile-surface', 'polished');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const initialSpecimen = await specimen.boundingBox();
  expect(initialSpecimen).not.toBeNull();
  expect(initialSpecimen!.y + initialSpecimen!.height).toBeLessThanOrEqual(
    page.viewportSize()!.height,
  );
  await expect(page.getByRole('slider', { name: 'Radius', exact: true })).toHaveAttribute(
    'aria-valuetext',
    'Pill',
  );
  const previous = page.locator('.previous-frame img');
  expect(
    await previous.evaluate(
      (image: HTMLImageElement) => image.complete && image.naturalWidth === 916,
    ),
  ).toBe(true);
  await expect(page.locator('.geometry-surface')).toHaveCount(8);
  const geometry = await page.locator('.geometry-surface').evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
        requestedWidth: parseFloat((node as HTMLElement).style.width),
        requestedHeight: parseFloat((node as HTMLElement).style.height),
        radius: style.borderRadius,
        available: node.parentElement!.getBoundingClientRect().width,
      };
    }),
  );
  for (const sample of geometry) {
    expect(sample.width).toBeCloseTo(Math.min(sample.requestedWidth, sample.available), 0);
    expect(sample.height).toBeCloseTo(sample.requestedHeight, 0);
    expect(sample.radius).toBe('9999px');
  }
  await page.getByRole('combobox', { name: 'Material', exact: true }).selectOption('porcelain');
  await expect(specimen).toHaveAttribute('data-tactile-surface', 'porcelain');
  await page.getByRole('combobox', { name: 'Visual state', exact: true }).selectOption('pressed');
  await expect(specimen).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 2)');
  await expect(page.locator('.geometry-surface').first()).toHaveCSS(
    'transform',
    'matrix(1, 0, 0, 1, 0, 2)',
  );
  await expect(previous).toHaveAttribute('src', '/references/surface-phase-2-baseline.png');
  await page.getByRole('combobox', { name: 'Visual state', exact: true }).selectOption('disabled');
  await expect(specimen).toHaveCSS('opacity', '0.5');
  await expect(specimen).not.toHaveAttribute('role', 'button');
  await page.getByRole('slider', { name: 'Depth', exact: true }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByLabel('Resolved surface recipe')).toContainText('"elevation": 0');
  await page.getByRole('slider', { name: 'Radius', exact: true }).focus();
  await page.keyboard.press('Home');
  for (let index = 0; index < 16; index++) await page.keyboard.press('ArrowRight');
  await expect(specimen).toHaveCSS('border-radius', '16px');
  await expect(page.getByRole('slider', { name: 'Radius', exact: true })).toHaveAttribute(
    'aria-valuetext',
    '16 pixels',
  );
  await page.getByRole('combobox', { name: 'Comparison', exact: true }).selectOption('overlay');
  await page.getByRole('slider', { name: 'Reference opacity', exact: true }).focus();
  await page.keyboard.press('Home');
  for (let index = 0; index < 75; index++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('.reference-frame')).toHaveCSS('opacity', '0.75');
  // Read both frames atomically while focus-driven smooth scrolling may still be settling.
  const overlayOffsets = await page.locator('.comparison-board').evaluate((board) => {
    const reference = board.querySelector('.reference-frame')!.getBoundingClientRect();
    const reconstruction = board.querySelector('.reconstruction-frame')!.getBoundingClientRect();
    return (['x', 'y', 'width', 'height'] as const).map(
      (dimension) => reference[dimension] - reconstruction[dimension],
    );
  });
  for (const offset of overlayOffsets) expect(offset).toBeCloseTo(0, 0);
  const image = page.getByRole('img', { name: /^Original reference:/ });
  expect(
    await image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth === 916),
  ).toBe(true);
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(page.locator('[data-tactile-theme]')).toHaveAttribute('data-tactile-theme', 'dark');
  await page.getByRole('button', { name: 'Reset calibration' }).click();
  await expect(specimen).toHaveAttribute('data-surface-state', 'rest');
  await expect(specimen).toHaveAttribute('data-tactile-surface', 'polished');
  await expect(specimen).toHaveCSS('border-radius', '9999px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});
