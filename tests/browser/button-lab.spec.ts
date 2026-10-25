import { test, expect } from '@playwright/test';

test('Button semantics, interaction, loading geometry, forms, focus, and responsive layout', async ({
  page,
}) => {
  if (page.viewportSize()!.width < 640) await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Button Lab', exact: true }).click();
  await expect(page).toHaveURL(/button-lab/);
  await page.goto('/button-lab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#button-main')).toBeFocused();
  const host = page.getByTestId('button-preview').getByRole('button');
  const surface = page.getByTestId('button-preview').locator('[data-tactile-surface]');
  await expect(host).toHaveAttribute('type', 'button');
  await expect(surface).toHaveAttribute('data-tactile-surface', 'polished');
  await host.click();
  await expect(page.getByText('Activated 1 time.', { exact: true })).toBeVisible();
  await host.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Activated 2 times.', { exact: true })).toBeVisible();
  await page.keyboard.down('Space');
  await expect(surface).toHaveAttribute('data-surface-state', 'pressed');
  await page.keyboard.up('Space');
  await expect(page.getByText('Activated 3 times.', { exact: true })).toBeVisible();
  await page.mouse.move(0, 0);
  await host.hover();
  await expect(surface).toHaveAttribute('data-surface-state', 'hovered');
  await page.mouse.down();
  await expect(surface).toHaveAttribute('data-surface-state', 'pressed');
  await page.mouse.move(1, 1);
  await page.mouse.up();
  await expect(surface).not.toHaveAttribute('data-surface-state', 'pressed');
  await expect(page.getByText('Activated 3 times.', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'Variant', exact: true }).selectOption('porcelain');
  await expect(surface).toHaveAttribute('data-tactile-surface', 'porcelain');
  for (const size of ['sm', 'md', 'lg']) {
    await page.getByRole('combobox', { name: 'Size', exact: true }).selectOption(size);
    // Chromium can report a few millionths below an integral CSS size.
    expect((await host.boundingBox())!.height).toBeGreaterThanOrEqual(47.99);
  }
  await page.getByRole('combobox', { name: 'Icon', exact: true }).selectOption('trailing');
  await expect(host.locator('[data-tactile-icon="trailing"]')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await page.getByLabel('Label', { exact: true }).fill('A customized action');
  await expect(host).toHaveAccessibleName('A customized action');
  await page.mouse.move(0, 0);
  const before = await host.boundingBox();
  await page.getByLabel('Loading', { exact: true }).check();
  await expect(host).toBeDisabled();
  await expect(host).toHaveAttribute('aria-busy', 'true');
  await expect(host).toHaveAccessibleName('A customized action');
  const after = await host.boundingBox();
  expect(after!.width).toBeCloseTo(before!.width, 1);
  expect(after!.height).toBeCloseTo(before!.height, 1);
  await expect(page.getByLabel('Button usage')).toContainText('loading');
  await expect(page.getByLabel('Button usage')).toContainText('function Icon()');
  await page.getByLabel('Loading', { exact: true }).uncheck();
  await page.getByLabel('Disabled', { exact: true }).check();
  await expect(host).toBeDisabled();
  await expect(surface).toHaveAttribute('data-surface-state', 'disabled');
  await page.getByLabel('Disabled', { exact: true }).uncheck();
  await page.getByLabel('Full width', { exact: true }).check();
  const full = await surface.boundingBox();
  const available = await page.getByTestId('button-preview').boundingBox();
  expect(full!.width).toBeCloseTo(available!.width, 0);
  await page.getByLabel('Label', { exact: true }).fill('A'.repeat(140));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(page.locator('[data-tactile-theme]')).toHaveAttribute('data-tactile-theme', 'dark');
  await page.getByLabel('Forest focus', { exact: true }).check();
  const focus = page.getByRole('button', { name: 'Keyboard focus example' });
  await focus.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(focus).toBeFocused();
  await expect(focus).toHaveCSS('outline-style', 'solid');
  await expect(focus).toHaveCSS('outline-color', 'rgb(164, 215, 177)');
  await expect(focus).toHaveCSS('outline-width', '2px');
  const input = page.getByLabel('Project name');
  await input.fill('A project');
  await page.getByRole('button', { name: 'Submit form', exact: true }).click();
  await expect(page.getByText('Submissions: 1 · Resets: 0')).toBeVisible();
  await page.getByRole('button', { name: 'Reset form', exact: true }).click();
  await expect(input).toHaveValue('Tactile UI');
  await expect(page.getByText('Submissions: 1 · Resets: 1')).toBeVisible();
  const save = page.getByRole('button', { name: 'Save changes', exact: true });
  await save.click();
  await expect(save).toBeDisabled();
  await expect(save).toHaveAttribute('aria-busy', 'true');
  await expect(save).toBeEnabled({ timeout: 4000 });
  await expect(page.getByText('Saved. Ready for another change.')).toBeVisible();
  expect(errors).toEqual([]);
});
test('Button respects reduced motion while retaining state and high-contrast loading', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/button-lab');
  const surface = page.getByTestId('button-preview').locator('[data-tactile-surface]');
  await expect(surface).toHaveCSS('transition-duration', '0s');
  await page.getByLabel('Loading', { exact: true }).check();
  const spinner = page.getByTestId('button-preview').locator('.tactile-button-spinner');
  await expect(spinner).toHaveCSS('animation-name', 'none');
  await expect(spinner).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
  await page.getByRole('combobox', { name: 'Variant', exact: true }).selectOption('porcelain');
  await expect(spinner).toHaveCSS('border-top-color', 'rgb(24, 25, 27)');
  await page.getByLabel('Loading', { exact: true }).uncheck();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(surface).toHaveCSS('transition-duration', '0.12s, 0.12s');
});
