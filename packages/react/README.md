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
