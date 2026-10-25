import { describe, expect, it } from 'vitest';
import { tokens } from './index';
describe('platform-neutral token contract', () => {
  it('keeps dimensions numeric, with a shared accessible touch target', () => {
    for (const dimension of [...Object.values(tokens.space), ...Object.values(tokens.radius)])
      expect(typeof dimension).toBe('number');
    expect(tokens.accessibility.minTouchTarget).toBeGreaterThanOrEqual(48);
    const spaces = Object.values(tokens.space);
    expect(spaces).toEqual([...spaces].sort((a, b) => a - b));
  });
  it('keeps depth independent from CSS and native styles', () => {
    expect(tokens.depth.raised.offsetY).toBeGreaterThan(0);
    expect(tokens.depth.raised.blur).toBeGreaterThan(0);
    expect(tokens.depth.pressed.elevation).toBeLessThan(tokens.depth.raised.elevation);
    expect(tokens.motion.duration.instant).toBe(0);
  });
});
