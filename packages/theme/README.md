# @tactile-ui/theme

Framework-free semantic themes and customization.

```ts
import { createTheme, darkTheme } from '@tactile-ui/theme';
const forest = createTheme({
  mode: 'dark',
  colors: { accent: '#a4d7b1', onAccent: '#181c18', focus: '#a4d7b1' },
});
```

Exports `createTheme`, `lightTheme`, `darkTheme`, `resolveColorMode`, and the baseline `nativeRendering` capability descriptor. Public types include `Theme`, `ThemeColors`, `ThemeOptions`, `ColorMode`, `ThemePreference`, and `RenderingCapabilities`. Overrides are partial and do not mutate presets. Use shared platform-supported colors and check contrast for custom palettes. Advanced engines must be separate opt-in packages; this package loads none.

Name and npm scope are provisional. No package has been published.
