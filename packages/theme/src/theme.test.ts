import { describe, expect, expectTypeOf, it } from 'vitest';
import { createTheme, darkTheme, lightTheme, nativeRendering, resolveColorMode } from './index';
import type { ThemeColors } from './index';

function luminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((value) => {
      const normalized = parseInt(value, 16) / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}
function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light! + 0.05) / (dark! + 0.05);
}
describe('themes', () => {
  it('accepts typed partial overrides without changing presets or future themes', () => {
    const customized = createTheme({
      mode: 'dark',
      colors: { accent: '#a4d7b1' },
      radius: { md: 20 },
    });
    expect(customized.colors.accent).toBe('#a4d7b1');
    expect(customized.radius.md).toBe(20);
    expect(customized.colors.text).toBe(darkTheme.colors.text);
    expect(darkTheme.colors.accent).not.toBe('#a4d7b1');
    expect(createTheme().radius.md).toBe(12);
    expectTypeOf(customized.colors).toEqualTypeOf<Readonly<ThemeColors>>();
  });
  it.each([lightTheme, darkTheme])('provides contrast for the $mode built-in theme', (theme) => {
    for (const surface of [theme.colors.canvas, theme.colors.surface]) {
      expect(contrast(theme.colors.text, surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme.colors.textMuted, surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme.colors.accent, surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme.colors.focus, surface)).toBeGreaterThanOrEqual(3);
    }
    expect(contrast(theme.colors.onAccent, theme.colors.accent)).toBeGreaterThanOrEqual(4.5);
  });
  it('resolves system preference with a deterministic light fallback', () => {
    expect(resolveColorMode('system', null)).toBe('light');
    expect(resolveColorMode('system', 'dark')).toBe('dark');
    expect(resolveColorMode('light', 'dark')).toBe('light');
  });
  it('describes the baseline rendering honestly', () => {
    expect(nativeRendering).toEqual({
      engine: 'native',
      insetShadows: false,
      customMaterials: false,
    });
  });
});
