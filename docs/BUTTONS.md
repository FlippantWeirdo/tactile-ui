# Button · Phase 3

Button composes the approved Surface materials into platform-native controls. The approved Phase 2.1 surface resolver and both renderers are unchanged. The name and npm scope remain provisional; packages have not been published.

## Installation and imports

Within this monorepo, declare `@tactile-ui/react` or `@tactile-ui/react-native` as a `workspace:*` dependency in your app. Library consumers can install locally packed archives together with the packed token/theme dependencies. Registry installation awaits a maintainer release. The tested baseline is React/React DOM 19.3 or React 19.3 with React Native 0.88; see each package manifest for peer requirements.

Web: import the stylesheet once at your application entry or Next.js root layout. It is explicitly exported and included in packed archives. Existing Surface-only applications still require no stylesheet.

```tsx
import { Button, TactileProvider } from '@tactile-ui/react';
import '@tactile-ui/react/styles.css';

export default function App() {
  return (
    <TactileProvider preference="system">
      <Button variant="polished" size="md" onClick={() => console.log('Continue')}>
        Continue
      </Button>
    </TactileProvider>
  );
}
```

Native: no stylesheet or Expo-specific setup is needed by the library.

```tsx
import { Button, TactileProvider } from '@tactile-ui/react-native';

export default function App() {
  return (
    <TactileProvider preference="system">
      <Button variant="porcelain" size="lg" onPress={() => console.log('Continue')}>
        Continue
      </Button>
    </TactileProvider>
  );
}
```

## Public API

Both packages export `Button`, `ButtonProps`, `ButtonSize`, and `ButtonVariant`. No `as`, forced visual state, or reference-specific accent prop is introduced.

| Prop                          | Type                        | Default / behavior                                                                                        |
| ----------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `variant`                     | `'polished' \| 'porcelain'` | `'polished'`; existing signature Surface materials                                                        |
| `size`                        | `'sm' \| 'md' \| 'lg'`      | `'md'`                                                                                                    |
| `disabled`                    | boolean                     | false; blocks activation and uses disabled Surface appearance                                             |
| `loading`                     | boolean                     | false; blocks activation, exposes busy state, overlays an indicator without removing content              |
| `fullWidth`                   | boolean                     | false; fills available parent width                                                                       |
| `leadingIcon`, `trailingIcon` | ReactNode                   | Optional decorative slots; no icon-library dependency                                                     |
| `children`                    | ReactNode                   | Label/content; keep it non-interactive                                                                    |
| `style`                       | Platform host style         | Applied last to the HTML button or native Pressable; native also accepts its pressed-state style callback |
| `className`                   | string, web                 | Added to the HTML button                                                                                  |
| `loadingLabel`                | string, web                 | `'Loading'`; localizable live-region announcement                                                         |
| `aria-label`                  | string, web                 | Name override, particularly for non-text content                                                          |
| `accessibilityLabel`          | string, native              | Platform name override; use it for non-text content                                                       |

Web `ButtonProps` extends `ButtonHTMLAttributes<HTMLButtonElement>`. It accepts `onClick`, pointer/keyboard/focus handlers, `name`, `value`, `form`, `formAction`, `formNoValidate`, `aria-*`, and native button attributes. `type` defaults to **`button`**, with `submit`/`reset` forwarded unchanged. The forwarded ref is an HTMLButtonElement. The semantic button is inside a non-interactive Surface div; sibling live status is visually hidden. Host sizing/class styles do not replace the Surface wrapper or its material styles.

Native `ButtonProps` extends `Omit<PressableProps, 'children'>`. It accepts `onPress`, `onLongPress`, `onPressIn`/`onPressOut`, hover/focus handlers, `hitSlop`, `pressRetentionOffset`, Android feedback configuration, and accessibility props. The forwarded ref is a React Native ViewInstance. `children` is content rather than a Pressable render function; `style` can still be the platform's pressed-state callback. Role is always button. Disabled/busy accessibility state is owned by Button; unrelated caller state such as `selected` is preserved.

## Shared geometry

`@tactile-ui/tokens` exports `buttonSizes` and `ButtonSize`. Values derive from existing space, typography, and accessibility tokens.

| Size | Minimum content/host height | Horizontal padding | Icon size | Text px / scalable native size | Gap |
| ---- | --------------------------- | ------------------ | --------- | ------------------------------ | --- |
| sm   | 48                          | 16                 | 16        | 14                             | 8   |
| md   | 56                          | 24                 | 20        | 17                             | 8   |
| lg   | 64                          | 32                 | 24        | 24                             | 12  |

The unchanged Surface border adds 3px/dp to the visual container dimensions. The semantic web target itself is at least 48px high; native Pressable wraps the whole surface. These are minimums, not fixed heights: wrapped text, custom icons, user font settings, and native font scaling can increase size. Both platforms use medium weight and the theme's full radius. Web text uses rem, native Text scales normally. Text and icons stay centered, and long labels wrap. Consumer overrides can invalidate target or contrast guarantees and should be rechecked.

## Icons and optional accents

Icons are decorative and hidden from assistive technology. The label supplies the name; use an explicit accessible label for icon-only content. Do not pass focusable controls into children or icon slots. SVG icons on web inherit currentColor and default to the size token. Native icons should set their own dimensions/color; arbitrary icon-library elements are supported without an imposed dependency.

```tsx
import { Button } from '@tactile-ui/react';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function Explore() {
  return (
    <Button trailingIcon={<ArrowIcon />} onClick={() => console.log('Explore')}>
      Explore
    </Button>
  );
}
```

The web Lab's `WarmAccent` is a 64px circular CSS gradient plus authored arrow in the trailing slot, with showcase-only sizing for the original 916 × 166 composition. Its native counterpart uses a 48dp circular View, eight fill bands, and an authored View-based arrow. Neither changes Button or Surface APIs. Native accent rendering is approximate, with no graphics runtime added. A consumer can supply a completely different trailing visual or omit it.

## Loading and disabled behavior

Keep a stable label and icons while toggling loading. The content remains in layout at zero opacity, preserving its space and accessible name; a centered, contrast-matched indicator overlays it. Both props block activation. Disabled alone uses the Surface's opacity/depth recipe; loading alone retains normal material contrast. Avoid swapping the label to a different-length string if exact width stability is required.

```tsx
import { useState } from 'react';
import { Button } from '@tactile-ui/react';

export function Save({ save }: { save: () => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  return (
    <Button
      loading={saving}
      loadingLabel="Saving project"
      onClick={async () => {
        setSaving(true);
        try {
          await save();
        } finally {
          setSaving(false);
        }
      }}
    >
      Save project
    </Button>
  );
}
```

Native uses the same controlled `loading` pattern with `onPress`; expose the action name through Text or `accessibilityLabel`. Native busy state is provided through accessibilityState, while the app owns success/error announcements. Web includes a polite status region for the localizable loadingLabel. Both platforms retain names and suppress repeated native activation while the loading prop is true. Button does not implement application request deduplication or infer loading from a returned promise; the application owns that state.

## Interaction, focus, forms, and motion

- Web uses the browser's actual click, Enter, Space, submit/reset, and disabled semantics. Pointer/keyboard input only updates the explicit Surface state. Press/hover callbacks are composed; a prevented keydown or pointerdown does not trigger the corresponding visual press. Pointer exit/cancel and blur clear the visual press. The browser retains normal drag-out cancellation.
- Keyboard focus uses a 2px outline with a 3px offset, colored by the nearest theme's focus role. It is separate from the material shadows. The stylesheet is required for the authored focus treatment, transitions, and spinner animation; native browser focus remains available without it.
- Native Pressable owns press cancellation and activation. Its pressed render state drives Surface; built-in Animated moves the surface using the resolver's translateY, suppressing the immediate Surface translation to avoid double movement. Focus adds a theme-driven native outline on the tested RN baseline. Device focus/assistive-technology behavior still requires runtime testing.
- Web material transitions are 120ms with the shared easing. Native uses the same duration/easing with useNativeDriver for translation. No mandatory Reanimated, Skia, gesture or haptics dependency was added.
- CSS prefers-reduced-motion removes transitions/spinner rotation. Native subscribes to AccessibilityInfo, starts conservatively with reduced motion until the initial query resolves, handles preference changes and stale-query races, and removes its subscription on unmount. Reduced motion uses immediate translation and a static ring instead of a rotating indicator.

```tsx
<form
  onSubmit={(event) => {
    event.preventDefault();
    console.log('Submitted');
  }}
>
  <input name="project" defaultValue="Tactile UI" />
  <Button type="submit" name="action" value="save">
    Submit
  </Button>
  <Button type="reset" variant="porcelain">
    Reset
  </Button>
</form>
```

## Theme integration

A TactileProvider is required. Theme `focus` and `radius.full` customize Button; surrounding UI can use `accent` and semantic colors as before. Signature material palettes stay fixed across light/dark, preserving the approved Surface identity. Changing `accent` alone does not recolor polished or porcelain. Native custom Text/icon elements own their explicit foreground colors, while plain string/number children receive the recipe foreground automatically. Web content inherits it. Recheck custom focus colors for contrast.

```tsx
const theme = createTheme({
  mode: 'dark',
  colors: { focus: '#a4d7b1', accent: '#a4d7b1' },
  radius: { full: 32 },
});
```

## Labs and verification boundaries

Open `/button-lab` in the existing Next.js docs. The Surface Lab remains available. Button Lab includes both materials and all sizes; real clicks and keyboard feedback; label/icon/full-width controls; loading and disabled controls; theme/focus customization; a timed save; copyable usage; native form submit/reset; and the optional reference-scale composition. Hover and pressed states are exercised through real input rather than a forced public state prop.

The Expo app is `apps/showcase` (the repository's existing path). Its Button Lab is inserted after Surface Lab and follows the shared system/light/dark controls. It includes size/material switches, disabled/loading/full width, actual press counts, a timed save, icons and the optional View-based accent.

Browser tests verify keyboard activation, actual click feedback, drag-out cancellation, disabled/busy state, accessible names, unchanged loading bounds, theme-driven focus outline, form submit/reset, long-label overflow, and reduced motion. Native unit tests use mocked hosts to verify prop/semantic mapping, callbacks, ref/style forwarding, animation configuration, motion subscription cleanup, and stale-query handling. These mocks do not establish native rendering, actual touch targets, or screen-reader behavior.

Native binary/device testing remains separate: an iPhone 18 Pro simulator was booted successfully for a host check, but no Expo Go app was installed; the simulator was restored to shutdown afterward. No Android device was connected. The Expo showcase was not run on a native host. Expo exports verify bundling, not on-device appearance, accessibility, large text, or animation quality. Surface's existing 24 fill bands, solid inset approximations, iOS shadows and OS-controlled Android elevation remain the rendering limitations. Bare React Native host compatibility is still a goal pending an external host/device check.

The Surface primitive owns material, depth, lighting, borders, and visual state. Components own content, layout, interaction semantics, and composition. Decorative accents are optional component-level compositions, not mandatory surface features.
