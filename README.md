# Tactile UI

A cross-platform tactile UI foundation with a Phase 2 surface engine. The name and npm scope are provisional. **Surface primitives are available; production controls and the component catalog remain deferred.**

## Start

Use Node 24 (see `.nvmrc`) and pnpm 10.34.8. Install pnpm using Corepack or your preferred package-manager installation method.

```sh
corepack enable
pnpm install
pnpm dev:docs
# In a second terminal
pnpm dev:native
```

Docs run at `http://localhost:3000`; open `/surface-lab` for interactive material calibration and reference comparison. The foundation remains at `/`. The native command opens Expo's development server; scan with a compatible Expo Go client or launch a simulator. `pnpm --filter @tactile-ui/showcase ios` / `android` opens the selected platform after packages are built. Metro uses Expo's default monorepo resolution, with pnpm's isolated dependency layout.

`pnpm dev` starts the package watchers and both apps together. The focused app commands build dependencies first. When using a focused command and editing library code, also run `pnpm build:packages` or use `pnpm dev` for continuous rebuilds.

## Workspace

| Path                    | Purpose                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `packages/tokens`       | Framework-free primitive tokens and token types                            |
| `packages/theme`        | Semantic light/dark themes, customization, rendering capability contract   |
| `packages/react`        | React DOM provider, hook, scoped CSS variable adapter                      |
| `packages/react-native` | Expo-independent provider, hook, native style adapter                      |
| `apps/docs`             | Next.js App Router documentation shell and interactive token/theme preview |
| `apps/showcase`         | Expo native foundation showcase with system/light/dark appearance          |
| `docs`                  | Architecture, decisions, contribution/release workflow, progress           |

## Verify

```sh
pnpm check                 # lint → types → tests → all production builds → packed package checks
pnpm format:check
pnpm --filter @tactile-ui/showcase run doctor
pnpm exec playwright install chromium
pnpm test:browser          # requires a completed docs production build
```

To use an already-installed Google Chrome locally, run `PLAYWRIGHT_CHANNEL=chrome pnpm test:browser` instead of downloading Chromium. CI uses the bundled Chromium installation. Browser checks always start a fresh production server on port 3100; set `PLAYWRIGHT_PORT` to choose another free port.

`pnpm build` compiles all four libraries, builds the Next.js site, and exports **both iOS and Android JavaScript bundles** through Metro. Expo export is not an Xcode/Gradle binary build or device validation. See [progress](docs/PROGRESS.md) for actual verification evidence and remaining platform checks.

## Use the foundation

```tsx
// Web
import { TactileProvider, createTheme } from '@tactile-ui/react';
const theme = createTheme({ colors: { accent: '#286143', focus: '#286143' } });
<TactileProvider theme={theme}>
  <App />
</TactileProvider>;

// Native: same theme factory, platform-specific provider
import { TactileProvider } from '@tactile-ui/react-native';
<TactileProvider preference="system">
  <App />
</TactileProvider>;
```

Web styles can use `var(--tactile-color-accent)` inside the provider. Native consumers can call `createNativeThemeStyles(useTactileTheme())`. Choose common color formats (for example hex) when sharing themes. Custom palettes must preserve contrast, including `onAccent` and `focus`.

## Distribution

Packages ship ESM, CommonJS, declarations, and source maps. React and React Native stay external peer dependencies. Changesets records package changes; publishing is manual and has not occurred. Confirm the final npm scope, ownership, and license before publishing. See [contributing](docs/CONTRIBUTING.md) and [architecture](docs/ARCHITECTURE.md).

Rename later with [the naming guide](docs/NAMING.md). Production control APIs, gestures, animation, haptics, and advanced renderer implementations remain deferred. See [Surface API and calibration](docs/SURFACES.md) for the deterministic recipe, DOM/native primitives, Labs, and visual limitations.
