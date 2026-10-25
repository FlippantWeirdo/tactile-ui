# @tactile-ui/react

React DOM theme foundation; no component catalog. Requires React and React DOM 19.3.

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
