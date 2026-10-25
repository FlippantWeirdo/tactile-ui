import type { Theme } from './index';

export type SurfacePreset = 'polished' | 'porcelain';
export type SurfaceState = 'rest' | 'hovered' | 'pressed' | 'disabled';
export interface SurfaceOptions {
  preset?: SurfacePreset;
  /** Visual state only. The host owns interaction and disabled semantics. */
  state?: SurfaceState;
  radius?: keyof Theme['radius'] | number;
  /** Multiplier, clamped to 0–2. Zero removes depth, not the material. */
  depth?: number;
}
export interface SurfaceShadow {
  readonly offsetY: number;
  readonly blur: number;
  readonly opacity: number;
}
export interface SurfaceRecipe {
  readonly preset: SurfacePreset;
  readonly state: SurfaceState;
  readonly radius: number;
  readonly depth: number;
  readonly fill: Readonly<{ top: string; middle: string; bottom: string }>;
  readonly foreground: string;
  readonly edge: string;
  readonly highlight: string;
  readonly shade: string;
  readonly lip: number;
  readonly shadows: readonly SurfaceShadow[];
  readonly shadowColor: string;
  readonly elevation: number;
  readonly translateY: number;
  readonly opacity: number;
}

/** Reference materials retain their identity in either theme; they are not semantic canvas roles. */
export const surfacePresets = {
  polished: {
    fill: { top: '#3e3e3c', middle: '#2c2c2a', bottom: '#222220' },
    foreground: '#ffffff',
    edge: '#171715',
    highlight: '#858581',
    shade: '#111110',
    lip: 6,
  },
  porcelain: {
    fill: { top: '#fcfcfc', middle: '#fafafa', bottom: '#f8f8f8' },
    foreground: '#18191b',
    edge: '#eeeeec',
    highlight: '#ffffff',
    shade: '#ececea',
    lip: 7,
  },
} as const;

const finite = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
const round = (value: number) => Math.round(value * 1000) / 1000;

/** Pure, deterministic, platform-neutral. Returns fresh records; never mutates theme or presets. */
export function resolveSurfaceRecipe(theme: Theme, options: SurfaceOptions = {}): SurfaceRecipe {
  const preset = options.preset ?? 'polished';
  const state = options.state ?? 'rest';
  const material = surfacePresets[preset];
  const radius =
    typeof options.radius === 'number'
      ? finite(options.radius, theme.radius.full, 0, 9999)
      : finite(theme.radius[options.radius ?? 'full'], theme.radius.full, 0, 9999);
  const depth = finite(options.depth ?? 1, 1, 0, 2);
  const factor =
    depth *
    (state === 'pressed' ? 0.25 : state === 'hovered' ? 1.2 : state === 'disabled' ? 0.4 : 1);
  return {
    preset,
    state,
    radius,
    depth,
    fill: { ...material.fill },
    foreground: material.foreground,
    edge: material.edge,
    highlight: material.highlight,
    shade: material.shade,
    lip: round(material.lip * factor),
    shadows: [
      {
        offsetY: round(2 * factor),
        blur: round(4 * factor),
        opacity: factor === 0 ? 0 : preset === 'polished' ? 0.18 : 0.06,
      },
      {
        offsetY: round(5 * factor),
        blur: round(10 * factor),
        opacity: factor === 0 ? 0 : preset === 'polished' ? 0.14 : 0.07,
      },
    ],
    shadowColor: '#000000',
    elevation: round(4 * factor),
    translateY: state === 'pressed' ? round(2 * depth) : state === 'hovered' ? round(-depth) : 0,
    opacity: state === 'disabled' ? 0.5 : 1,
  };
}

/** A bounded native-view approximation of the same three-stop fill. No graphics runtime. */
export function surfaceFillBands(recipe: SurfaceRecipe): readonly string[] {
  const mix = (a: string, b: string, amount: number) =>
    '#' +
    [1, 3, 5]
      .map((offset) =>
        Math.round(
          parseInt(a.slice(offset, offset + 2), 16) * (1 - amount) +
            parseInt(b.slice(offset, offset + 2), 16) * amount,
        )
          .toString(16)
          .padStart(2, '0'),
      )
      .join('');
  return Array.from({ length: 24 }, (_, index) => {
    const position = index / 23;
    return position <= 0.55
      ? mix(recipe.fill.top, recipe.fill.middle, position / 0.55)
      : mix(recipe.fill.middle, recipe.fill.bottom, (position - 0.55) / 0.45);
  });
}
