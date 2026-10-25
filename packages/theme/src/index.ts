import { tokens } from '@tactile-ui/tokens';

export type ColorMode = 'light' | 'dark';
export type ThemePreference = ColorMode | 'system';
export interface ThemeColors {
  canvas: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  onAccent: string;
  focus: string;
  shadow: string;
  positive: string;
  negative: string;
}
export interface Theme {
  readonly mode: ColorMode;
  readonly colors: Readonly<ThemeColors>;
  readonly space: typeof tokens.space;
  readonly radius: Readonly<Record<keyof typeof tokens.radius, number>>;
  readonly typography: typeof tokens.typography;
  readonly depth: typeof tokens.depth;
  readonly motion: typeof tokens.motion;
  readonly accessibility: typeof tokens.accessibility;
}
export interface ThemeOptions {
  mode?: ColorMode;
  colors?: Partial<ThemeColors>;
  radius?: Partial<Record<keyof typeof tokens.radius, number>>;
}

const palettes: Record<ColorMode, ThemeColors> = {
  light: {
    canvas: tokens.color.paper,
    surface: tokens.color.white,
    text: tokens.color.ink,
    textMuted: tokens.color.mutedInk,
    border: tokens.color.line,
    accent: tokens.color.accent,
    onAccent: tokens.color.white,
    focus: tokens.color.accent,
    shadow: '#141b12',
    positive: tokens.color.positive,
    negative: tokens.color.negative,
  },
  dark: {
    canvas: tokens.color.night,
    surface: tokens.color.raisedNight,
    text: tokens.color.nightText,
    textMuted: tokens.color.nightMuted,
    border: tokens.color.nightLine,
    accent: tokens.color.accentLight,
    onAccent: tokens.color.night,
    focus: tokens.color.accentLight,
    shadow: '#000000',
    positive: '#8bdaaa',
    negative: '#ffadb2',
  },
};

/** Creates a fresh theme; overrides never mutate a shared preset. Colors must work on both platforms. */
export function createTheme(options: ThemeOptions = {}): Theme {
  const mode = options.mode ?? 'light';
  return {
    mode,
    colors: { ...palettes[mode], ...options.colors },
    space: tokens.space,
    radius: { ...tokens.radius, ...options.radius },
    typography: tokens.typography,
    depth: tokens.depth,
    motion: tokens.motion,
    accessibility: tokens.accessibility,
  };
}
export const lightTheme = createTheme();
export const darkTheme = createTheme({ mode: 'dark' });
export function resolveColorMode(preference: ThemePreference, system: ColorMode | null): ColorMode {
  return preference === 'system' ? (system ?? 'light') : preference;
}

/** Advanced engines implement this in a separate opt-in package, never in the base adapters. */
export interface RenderingCapabilities {
  readonly engine: 'native' | 'advanced';
  readonly insetShadows: boolean;
  readonly customMaterials: boolean;
}
export const nativeRendering: RenderingCapabilities = {
  engine: 'native',
  insetShadows: false,
  customMaterials: false,
};

export { resolveSurfaceRecipe, surfacePresets, surfaceFillBands } from './surface';
export type {
  SurfaceOptions,
  SurfacePreset,
  SurfaceState,
  SurfaceRecipe,
  SurfaceShadow,
} from './surface';
