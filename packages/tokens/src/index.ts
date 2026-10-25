/** Numeric dimensions are density-independent units: CSS px on web, dp on native. */
export const tokens = {
  color: {
    paper: '#f6f3ed',
    white: '#ffffff',
    ink: '#252820',
    mutedInk: '#606257',
    line: '#d1d1c5',
    accent: '#a33d24',
    accentLight: '#ffae94',
    night: '#181c18',
    raisedNight: '#252b25',
    nightText: '#eff0e7',
    nightMuted: '#b2b9a9',
    nightLine: '#4d584b',
    positive: '#286143',
    negative: '#a12430',
  },
  space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 },
  radius: { none: 0, sm: 6, md: 12, lg: 16, full: 9999 },
  typography: {
    size: { caption: 12, label: 14, body: 17, title: 24, heading: 32, display: 48 },
    lineHeight: { tight: 1.15, normal: 1.5, relaxed: 1.7 },
    weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  },
  depth: {
    flat: { offsetY: 0, blur: 0, opacity: 0, elevation: 0 },
    raised: { offsetY: 4, blur: 12, opacity: 0.12, elevation: 3 },
    floating: { offsetY: 8, blur: 24, opacity: 0.18, elevation: 6 },
    pressed: { offsetY: 1, blur: 2, opacity: 0.08, elevation: 1 },
  },
  motion: { duration: { instant: 0, quick: 120, normal: 220 }, easing: [0.16, 1, 0.3, 1] },
  accessibility: { minTouchTarget: 48, focusRing: 2, focusOffset: 3 },
} as const;

export type Tokens = typeof tokens;
export type SpaceToken = keyof Tokens['space'];
export type RadiusToken = keyof Tokens['radius'];
export type DepthToken = keyof Tokens['depth'];
