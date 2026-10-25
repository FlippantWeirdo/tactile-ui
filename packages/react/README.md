# @tactile-ui/react

React DOM theme foundation, Surface, and Button. Requires React and React DOM 19.3.

```tsx
import { TactileProvider, useTactileTheme } from '@tactile-ui/react';
<TactileProvider preference="system">
  <App />
</TactileProvider>;
```

The provider renders a scoped div with `data-tactile-theme`, CSS variables, and `color-scheme`. `useTactileTheme()` requires a provider. `themeToCSSVariables(theme)` is a pure adapter for custom scopes. Example variables: `--tactile-color-text`, `--tactile-color-on-accent`, `--tactile-space-4`, `--tactile-radius-md`.

Use `theme` for explicit customization; it takes priority over `preference`. `initialMode` controls SSR and first hydration output (light by default). System preference takes effect after mount and updates live. Providers can be nested. The package preserves its Next.js client boundary; import `@tactile-ui/theme` for server-only theme calculations. Themes are not persisted automatically.

Name and npm scope are provisional. No package has been published.

## Surface

```tsx
import { Surface } from '@tactile-ui/react';
// Inside a TactileProvider:
<Surface preset="porcelain" state="rest" radius="lg" depth={1} style={{ padding: 24 }}>
  Your content
</Surface>;
```

Surface is a non-interactive div with a forwarded ref and ordinary div attributes. It adds material styles with CSS; no global stylesheet is needed. Style overrides apply last; text inherits the material foreground. It adds no focus stop, role, interaction or animation. Explicit state changes visuals only. Presets are `polished`/`porcelain`, states are `rest`/`hovered`/`pressed`/`disabled`, radius accepts a theme key or number, and depth clamps to 0–2. `surfaceToCSS(recipe)` supports custom hosts. The resolver, presets and surface types are also re-exported. Reference calibration and platform differences are documented in the repository's `docs/SURFACES.md`.

## Button

Use a `workspace:*` dependency inside this monorepo, or install locally packed archives with their token/theme dependencies. Registry packages have not been published. Import the exported CSS once at your app entry or Next.js root layout:

```tsx
import { Button, TactileProvider } from '@tactile-ui/react';
import '@tactile-ui/react/styles.css';

export default function App() {
  return (
    <TactileProvider preference="system">
      <Button variant="porcelain" size="lg" onClick={() => console.log('Continue')}>
        Continue
      </Button>
    </TactileProvider>
  );
}
```

The CSS supplies authored focus styling, Surface transitions, icon sizing, loading status hiding, and spinner animation. Surface-only applications still need no stylesheet.

`ButtonProps` extends `ButtonHTMLAttributes<HTMLButtonElement>`. The package also exports `ButtonSize` and `ButtonVariant`.

| Prop                          | Values / behavior                                                         |
| ----------------------------- | ------------------------------------------------------------------------- |
| `variant`                     | `polished` (default) or `porcelain`                                       |
| `size`                        | `sm`, `md` (default), or `lg`; shared minimum heights 48/56/64px          |
| `disabled`, `loading`         | Block activation; loading preserves content space and exposes busy status |
| `loadingLabel`                | Localizable polite status text; defaults to `Loading`                     |
| `fullWidth`                   | Fill available parent width                                               |
| `leadingIcon`, `trailingIcon` | Decorative ReactNode slots; no required icon library                      |
| `type`                        | `button` by default; `submit` and `reset` preserve native form behavior   |

`children`, `onClick`, HTML attributes, `aria-*`, `className`, and `style` reach the semantic button; its ref is `HTMLButtonElement`. Host style overrides apply last. The public Surface wraps the host and owns material rendering. Keep children and icons non-interactive; use `aria-label` for icon-only content. Keep a stable label while toggling controlled `loading`; Button does not infer loading from a returned promise.

Theme `focus` and `radius.full` customize the control. The polished/porcelain palettes remain fixed in both modes. Web inherits control typography from the app, uses scalable rem sizes, and wraps long labels. CSS respects `prefers-reduced-motion` by removing transitions and spinner rotation. Custom styles, colors, and icons need their own target/contrast checks.

See [the full Button guide](../../docs/BUTTONS.md) for icon/loading/form examples, optional showcase accent composition, accessibility behavior, and verification limits. The repository's `/button-lab` exercises real pointer, keyboard, and form input.
