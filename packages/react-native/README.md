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

## Surface

```tsx
import { Text } from 'react-native';
import { Surface, resolveSurfaceRecipe, useTactileTheme } from '@tactile-ui/react-native';
// Inside a TactileProvider-backed component:
const recipe = resolveSurfaceRecipe(useTactileTheme(), { preset: 'porcelain' });
<Surface preset="porcelain" radius="lg" style={{ margin: 16 }}>
  <Text style={{ color: recipe.foreground, padding: 24 }}>Your content</Text>
</Surface>;
```

Surface is a non-interactive View container with a `ViewInstance` ref. `style` belongs to the outer layout/shadow wrapper; put content padding on children. Text must explicitly use the recipe foreground. Presets, explicit visual state, radius and depth match web. Decoration ignores input and is hidden from accessibility; children remain available. The primitive does not implement Button semantics, disable interaction or animate. `surfaceToNativeStyles(recipe, platform)` returns `NativeSurfaceStyles`. Native uses 24 clipped color strips, solid rims, two iOS shadow layers or Android elevation. These approximate the reference; true gradients/inset blur and device parity are not claimed. No optional engine is loaded. See `docs/SURFACES.md` in the repository.
