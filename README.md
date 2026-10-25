# Tactile UI

A cross-platform tactile UI foundation with a shared Surface engine and the first interactive component, **Button**, for React DOM and React Native. The name and npm scope are provisional. Additional controls remain deferred.

## Start

Use Node 24 (see `.nvmrc`) and pnpm 10.34.8. Install pnpm using Corepack or your preferred package-manager installation method.

```sh
corepack enable
pnpm install
pnpm dev:docs
# In a second terminal
pnpm dev:native
```

Docs run at `http://localhost:3000`; open `/button-lab` for interactive controls or `/surface-lab` for material calibration and reference comparison. The foundation remains at `/`. The native command opens Expo's development server; scan with a compatible Expo Go client or launch a simulator. `pnpm --filter @tactile-ui/showcase ios` / `android` opens the selected platform after packages are built. Metro uses Expo's default monorepo resolution, with pnpm's isolated dependency layout.

`pnpm dev` starts the package watchers and both apps together. The focused app commands build dependencies first. When using a focused command and editing library code, also run `pnpm build:packages` or use `pnpm dev` for continuous rebuilds.

## Workspace

| Path                    | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `packages/tokens`       | Framework-free primitive tokens, shared Button sizes, and token types    |
| `packages/theme`        | Semantic light/dark themes, customization, rendering capability contract |
| `packages/react`        | React DOM provider, CSS variable adapter, Surface, and Button            |
| `packages/react-native` | Expo-independent provider, native style adapter, Surface, and Button     |
| `apps/docs`             | Next.js foundations, Surface Lab, and interactive Button Lab             |
| `apps/showcase`         | Expo foundations, Surface Lab, and Button Lab with appearance controls   |
| `docs`                  | Architecture, decisions, contribution/release workflow, progress         |

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

## Use Button

Declare the platform package as a `workspace:*` app dependency in this monorepo. External consumers can install locally packed archives with the packed token/theme dependencies; registry installation awaits a maintainer release.

Web requires the exported stylesheet once at the app entry or Next.js root layout:

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

For native, import `Button` and `TactileProvider` from `@tactile-ui/react-native` and use `onPress`. The native library requires no stylesheet or Expo-specific setup. Existing web Surface-only usage still requires no stylesheet.

Both adapters export `ButtonProps`, `ButtonSize`, and `ButtonVariant`. Button supports polished/porcelain materials, sm/md/lg sizes, decorative icon slots, disabled/loading states, and full width. It uses platform control semantics and built-in motion that respects reduced motion. Theme focus and full radius are customizable; signature material colors remain fixed. See [Button installation, API, examples, and platform limits](docs/BUTTONS.md), plus the [web](packages/react/README.md) and [native](packages/react-native/README.md) quick starts. Native appearance, accessibility, large text, and animation still require device validation.

## Distribution

Packages ship ESM, CommonJS, declarations, and source maps. React and React Native stay external peer dependencies. Changesets records package changes; publishing is manual and has not occurred. Confirm the final npm scope, ownership, and license before publishing. See [contributing](docs/CONTRIBUTING.md) and [architecture](docs/ARCHITECTURE.md).

Rename later with [the naming guide](docs/NAMING.md). Additional controls, gesture/haptics adapters, and advanced renderer implementations remain deferred. Button uses CSS transitions on web and React Native Animated without a third-party animation dependency. See [Surface API and calibration](docs/SURFACES.md) for the deterministic recipe, DOM/native primitives, Labs, and visual limitations.
