# @tactile-ui/react-native

Expo-independent native theme foundation; no component catalog. Tested baseline: React 19.3 and React Native 0.88. Bare React Native remains a compatibility goal pending host-app/device validation.

```tsx
import {
  TactileProvider,
  createNativeThemeStyles,
  useTactileTheme,
} from '@tactile-ui/react-native';
<TactileProvider preference="system">
  <App />
</TactileProvider>;
// Inside App:
const styles = createNativeThemeStyles(useTactileTheme());
```

The provider adds no wrapper View. `theme` overrides appearance preference; system appearance uses `useColorScheme`. `createNativeThemeStyles` maps semantic roles to canvas, surface, text, textMuted, and raised styles. Shadows use native shadow props and Android elevation. No Expo runtime, native module, Skia, SVG, gesture, animation, or haptics dependency is required. The package exports compiled JS/declarations, including the React Native export condition.

Name and npm scope are provisional. No package has been published.
