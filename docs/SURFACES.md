# Surface engine · Phase 2

Surface is a non-interactive material container, not a Button. Phase 1 tokens, theme factory, providers, scoped CSS variables, native theme styles, foundation page and native foundation sections remain available. No packages are published by this work.

## Shared recipe

```ts
import { createTheme, resolveSurfaceRecipe } from '@tactile-ui/theme';
const recipe = resolveSurfaceRecipe(createTheme(), {
  preset: 'polished',
  state: 'rest',
  radius: 'full',
  depth: 1,
});
```

`resolveSurfaceRecipe(theme, options?)` is framework-free and SSR-safe. It reads no clock, random value, browser, native platform, device size or system appearance. Equal inputs produce equal JSON; every result has fresh fill and shadow records. Readonly inputs/presets are never modified. Options are statically typed; callers receiving untrusted strings should validate the preset/state names before calling.

| Option   | Values                                                              | Default    |
| -------- | ------------------------------------------------------------------- | ---------- |
| `preset` | `polished`, `porcelain`                                             | `polished` |
| `state`  | `rest`, `hovered`, `pressed`, `disabled`                            | `rest`     |
| `radius` | Theme radius key or number in px/dp; numeric values clamp to 0–9999 | `full`     |
| `depth`  | Finite number clamped to 0–2                                        | `1`        |

Non-finite numeric inputs use default depth/radius. Theme radius overrides are honored for named keys. The recipe contains three fill stops, foreground, edge, highlight, lower shade/lip, two contact/ambient shadows, Android elevation, vertical translation and opacity. Dimensions are px on web and dp on native. Blurs are shared numeric values; iOS maps blur to `shadowRadius = blur / 2`.

Press reduces depth to one quarter and moves the surface down by `2 × depth`; hover increases depth by 20% and moves it up by `depth`. Disabled uses 40% depth and 0.5 opacity. Zero depth removes the lower lip, cast shadows, elevation and translation; the material's fill, edge and upper highlight remain. These are explicit visual inputs. Surface does not subscribe to pointer events, animate, disable a host, add a role/tab stop, or manage focus. There is no reduced-motion burden because it introduces no animation.

The material palettes are deliberately fixed across light and dark appearance to retain the supplied reference identity. Theme mode changes the lab surroundings, while named radius reads the nearest provider's theme. Semantic theme colors remain available for surrounding UI. Custom surface palettes are outside this initial contract; ordinary platform style overrides are escape hatches and may break calibration.

## React DOM

```tsx
import { Surface, TactileProvider } from '@tactile-ui/react';
<TactileProvider preference="light">
  <Surface preset="porcelain" radius="lg" style={{ padding: 24 }}>
    Your content
  </Surface>
</TactileProvider>;
```

`SurfaceProps` combines `SurfaceOptions` with div attributes and a forwarded div ref. A provider is required. Content inherits the recipe foreground. Style overrides are applied last. `data-tactile-surface` and `data-surface-state` expose the resolved material/state. `surfaceToCSS(recipe)` is the pure adapter for consumers who own a different host. It uses a CSS linear gradient, border, two inset effects and two external shadows; no stylesheet import or style injection is required. Use the pure theme package for server-side recipe calculations; the React package retains its client boundary.

## React Native

```tsx
import { Text } from 'react-native';
import {
  Surface,
  TactileProvider,
  useTactileTheme,
  resolveSurfaceRecipe,
} from '@tactile-ui/react-native';
function Study() {
  const theme = useTactileTheme();
  const recipe = resolveSurfaceRecipe(theme, { preset: 'porcelain' });
  return (
    <Surface preset="porcelain" style={{ margin: 16 }}>
      <Text style={{ color: recipe.foreground, padding: 24 }}>Your content</Text>
    </Surface>
  );
}
<TactileProvider>
  <Study />
</TactileProvider>;
```

Native `SurfaceProps` combines `SurfaceOptions` and View props with a forwarded `ViewInstance` ref. `style` applies to the outer shadow/layout wrapper; put content padding/layout on children. Text colors are not inherited through Views, so explicitly use the recipe foreground. Internal face clipping does not clip the outer shadows. Decoration layers ignore pointer events and are hidden from assistive technology; children remain outside that hidden subtree. The host owns any accessibility role/label and interaction semantics.

`surfaceToNativeStyles(recipe, 'ios' | 'android')` returns explicit `NativeSurfaceStyles` records for outer, ambient and face. iOS uses two View shadow layers; Android uses one elevation shadow, whose appearance depends on the OS. `surfaceFillBands(recipe)` from the theme package provides 24 deterministic colors for clipped fill strips. A solid upper rim and lower lip approximate inset lighting. Neither adapter imports Expo, a graphics engine, SVG, animation, or haptics. The Phase 1 `nativeRendering.insetShadows` capability remains false: rim layers are not true inset blur. Optional advanced renderers still belong in a separate explicit opt-in package.

## Surface Labs

- Next.js: run `pnpm dev:docs`, open `/surface-lab`; `/` retains the foundation. Select a material and visual state, adjust depth/radius, inspect live usage/recipe JSON, reset, and switch theme. The specimen is intentionally non-interactive.
- Reference comparison: stacked and alpha-overlay views place the original and a reconstruction in matching 916:166 frames. State/depth/radius affect both reconstructed materials; the material selector affects only the live specimen. Overlay opacity affects only the reference image. At small sizes, text/geometry scale while pixel-based border/shadow values remain physical CSS units; compare at the reference's original width for calibration.
- Expo: run `pnpm dev:native`. The Surface Lab is inserted into the existing foundation screen. Native switches/buttons select material, pill/rounded radius, explicit visual state and quarter-step depth. Reset restores the reference defaults. The original image and native studies are shown below the live specimen.

## Calibration evidence and limits

`references/primary-button-reference.png` is the supplied visual authority (916 × 166); the docs public copy is byte-identical and exists only to serve that original in the lab. Charcoal geometry follows the approximate x=48, y=34, w=436, h=100 pill; porcelain follows x=534, y=36, w=302, h=98. Fill, upper highlight, rim, lower lip and contact/ambient shadows are encoded in `surfacePresets` and the resolver, not application-only Surface styles. The warm arrow medallion and labels are lab-only composition, not reusable button APIs.

This is visual calibration, not a measured pixel-identical match. The source font is unknown; the web reconstruction uses Arial/Helvetica with tuned sizing/spacing, so glyph width and weight can differ. The medallion's CSS color field approximates the reference; native studies omit that decoration. Exact edge antialiasing, bevel lighting and shadow falloff differ. No image-difference score or pixel-parity claim is made. Native fill strips and solid rims cannot reproduce a continuous CSS gradient or blurred inset shading; Android elevation further differs from iOS shadows. Disabled alpha reduces contrast intentionally and is only a state study, not an accessible control specification.

Unit tests verify deterministic recipes, bounds, fresh inputs/outputs, theme isolation, normal foreground contrast, DOM SSR/refs/attributes, and native layer/shadow mappings. Mocked native Views do not validate device appearance or accessibility. Browser tests exercise the lab controls, reference asset, both appearances, skip link and responsive overflow alongside the original foundation tests. Production builds and packed-consumer checks validate actual bundling/export boundaries. Native binary, simulator/device appearance, font scaling, screen reader and bare-host validation remain separate work. See the Phase 2 section in `docs/PROGRESS.md` for exact results.

## Deferred

Production Button (including semantics, keyboard/gesture behavior, focus, loading and disabled interaction), component catalog, gestures, haptics, animation adapters, advanced rendering, package publication and scope/license decisions remain deferred.

## Phase 2.1 refinement

The shared material recipes now use a 5px polished lip and 5.5px porcelain lip at rest, lower shadow opacity, slightly wider blur, and elevation 3.5. The polished highlight/edge and porcelain lower-edge contrast are softened without changing the Surface contract or geometry. See [recorded before/after values and visual evidence](phase-2.1/CALIBRATION.md).

The web lab's stacked comparison includes the canonical original, fixed previous implementation at rest/depth 1/pill, and current refined study. The overlay remains original over refined. Standalone four-size studies in both labs expose geometry independently of labels/icons; requested widths shrink to available space. Native minimum-height samples allow text scaling. Historical screenshots are evaluation assets only, never package dependencies.

The Surface primitive owns material, depth, lighting, borders, and visual state. Components own content, layout, interaction semantics, and composition. Decorative accents are optional component-level compositions, not mandatory surface features.
