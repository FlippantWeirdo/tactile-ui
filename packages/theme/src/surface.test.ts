import { describe, expect, it } from 'vitest';
import { createTheme, resolveSurfaceRecipe, surfaceFillBands, surfacePresets } from './index';

describe('surface recipe contract', () => {
  it('is deterministic, fresh, serializable, and leaves frozen inputs untouched', () => {
    const theme = createTheme();
    Object.freeze(theme.radius);
    Object.freeze(theme);
    const options = Object.freeze({
      preset: 'porcelain' as const,
      radius: 'md' as const,
      depth: 1.25,
    });
    const first = resolveSurfaceRecipe(theme, options);
    const second = resolveSurfaceRecipe(theme, options);
    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(first.fill).not.toBe(second.fill);
    expect(first.shadows).not.toBe(second.shadows);
    expect(JSON.parse(JSON.stringify(first))).toEqual(first);
    expect(first.radius).toBe(theme.radius.md);
    expect(first.fill).toEqual(surfacePresets.porcelain.fill);
    expect(first.fill).not.toBe(surfacePresets.porcelain.fill);
  });
  it('retains calibrated material identity across themes while resolving theme radius', () => {
    const custom = createTheme({ mode: 'dark', radius: { lg: 28 } });
    expect(resolveSurfaceRecipe(custom).fill).toEqual(resolveSurfaceRecipe(createTheme()).fill);
    expect(resolveSurfaceRecipe(custom, { radius: 'lg' }).radius).toBe(28);
    expect(resolveSurfaceRecipe(custom, { preset: 'porcelain' }).foreground).toBe('#18191b');
  });
  it('compresses depth on press, lifts on hover, and fades only the disabled visual state', () => {
    const theme = createTheme();
    const rest = resolveSurfaceRecipe(theme);
    const pressed = resolveSurfaceRecipe(theme, { state: 'pressed' });
    const hovered = resolveSurfaceRecipe(theme, { state: 'hovered' });
    const disabled = resolveSurfaceRecipe(theme, { state: 'disabled' });
    expect(pressed.lip).toBeLessThan(rest.lip);
    expect(pressed.shadows[1]!.blur).toBeLessThan(rest.shadows[1]!.blur);
    expect(pressed.translateY).toBeGreaterThan(0);
    expect(hovered.translateY).toBeLessThan(0);
    expect(hovered.elevation).toBeGreaterThan(rest.elevation);
    expect(disabled.opacity).toBe(0.5);
    expect(disabled.foreground).toBe(rest.foreground);
  });
  it.each([NaN, Infinity, -Infinity])('normalizes non-finite numeric input %s', (value) => {
    const recipe = resolveSurfaceRecipe(createTheme(), { depth: value, radius: value });
    expect(recipe.depth).toBe(1);
    expect(recipe.radius).toBe(9999);
    expect(JSON.stringify(recipe)).not.toMatch(/null/);
  });
  it('bounds dimensions and removes lip, shadow, lift and elevation at zero depth', () => {
    const theme = createTheme();
    expect(resolveSurfaceRecipe(theme, { depth: 99, radius: 20000 }).depth).toBe(2);
    expect(resolveSurfaceRecipe(theme, { radius: -1 }).radius).toBe(0);
    const flat = resolveSurfaceRecipe(theme, { depth: -4, state: 'pressed' });
    expect(flat.lip).toBe(0);
    expect(flat.elevation).toBe(0);
    expect(flat.translateY).toBe(0);
    expect(flat.shadows.every((shadow) => shadow.opacity === 0 && shadow.blur === 0)).toBe(true);
  });
  it.each(['polished', 'porcelain'] as const)(
    'provides bounded native fill bands and readable foreground for %s',
    (preset) => {
      const recipe = resolveSurfaceRecipe(createTheme(), { preset });
      const bands = surfaceFillBands(recipe);
      expect(bands).toHaveLength(24);
      expect(bands[0]).toBe(recipe.fill.top);
      expect(bands[23]).toBe(recipe.fill.bottom);
      const luminance = (hex: string) =>
        [1, 3, 5]
          .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
          .map((channel) =>
            channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
          )
          .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index]!, 0);
      for (const color of bands) {
        expect(color).toMatch(/^#[a-f0-9]{6}$/);
        const a = luminance(color),
          b = luminance(recipe.foreground);
        expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(4.5);
      }
    },
  );
});
