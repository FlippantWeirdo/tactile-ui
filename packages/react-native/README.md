# @tactile-ui/react-native

Expo-independent native theme foundation, Surface, and Button. Tested baseline: React 19.3 and React Native 0.88. Bare React Native remains a compatibility goal pending host-app/device validation.

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

The provider adds no wrapper View. `theme` overrides appearance preference; system appearance uses `useColorScheme`. `createNativeThemeStyles` maps semantic roles to canvas, surface, text, textMuted, and raised styles. Shadows use native shadow props and Android elevation. No Expo runtime, native module, Skia, SVG, gesture, third-party animation, or haptics dependency is required. The package exports compiled JS/declarations, including the React Native export condition.

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

## Button

Use a `workspace:*` dependency inside this monorepo, or install locally packed archives with their token/theme dependencies. Registry packages have not been published. No stylesheet or Expo-specific library setup is required.

```tsx
import { Button, TactileProvider } from '@tactile-ui/react-native';

export default function App() {
  return (
    <TactileProvider preference="system">
      <Button variant="polished" size="md" onPress={() => console.log('Continue')}>
        Continue
      </Button>
    </TactileProvider>
  );
}
```

`ButtonProps` extends `Omit<PressableProps, 'children'>`. The package also exports `ButtonSize` and `ButtonVariant`.

| Prop                          | Values / behavior                                                        |
| ----------------------------- | ------------------------------------------------------------------------ |
| `variant`                     | `polished` (default) or `porcelain`                                      |
| `size`                        | `sm`, `md` (default), or `lg`; shared minimum content heights 48/56/64dp |
| `disabled`, `loading`         | Block activation and expose disabled/busy accessibility state            |
| `fullWidth`                   | Fill available parent width                                              |
| `leadingIcon`, `trailingIcon` | Decorative ReactNode slots; custom icons own their dimensions/color      |
| `children`                    | Content; plain strings/numbers receive themed Text automatically         |

Button forwards a `ViewInstance` ref to Pressable and accepts `onPress`, `onLongPress`, press/hover/focus handlers, `hitSlop`, `pressRetentionOffset`, platform feedback, and accessibility props. `style` applies last to Pressable and accepts the pressed-state callback. Children are content, not a Pressable render function. The button role and disabled/busy state are owned by Button; unrelated caller accessibility state is preserved.

Keep children and icon slots non-interactive. Use `accessibilityLabel` for non-text content; custom Text elements need an explicit foreground color. Loading retains the label/icons in layout under an indicator, preserving dimensions when content is stable. The app controls loading and success/error announcements. Theme `focus` and `radius.full` customize the control; signature material palettes remain fixed across modes. Text scales normally and labels can wrap.

Pressable drives the public Surface state. React Native Animated handles restrained translation with shared motion tokens; AccessibilityInfo reduced-motion preferences use immediate movement and a static loading ring. No additional animation runtime is required.

See [the full Button guide](../../docs/BUTTONS.md) and `apps/showcase` Button Lab for composition examples and platform differences. Unit tests use mocked native hosts and Expo exports verify bundling. Native appearance, actual touch targets, screen readers, focus, large text, and animation remain unverified on a simulator/device. Surface's fill-band, inset, shadow, and elevation approximations remain unchanged; bare-host compatibility still needs external validation.
