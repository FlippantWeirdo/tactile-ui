# Implementation progress

## Phase 1

## Scope delivered

- pnpm/Turborepo TypeScript monorepo with dependency-ordered builds and watchers.
- Four publishable packages: tokens, themes, React DOM foundation, React Native foundation.
- Shared primitive tokens, semantic light/dark themes, typed color/radius customization.
- Scoped SSR-safe web provider and CSS variables; context-only native provider and style mapping.
- Native-first rendering capability contract; advanced implementations reserved for separate opt-in packages.
- Next.js documentation shell with interactive themes/tokens and responsive navigation.
- Expo showcase with native views, system appearance, manual appearance, accent preview, safe areas.
- Vitest contract/adapter tests, browser smoke tests, ESLint, Prettier, CI, package archive validation.
- Changesets configuration and pending initial changeset; manual release workflow.
- Architecture, decisions, contributor/release workflow, provisional naming guide.

## Verification

Verified on 25 October 2026 with Node 24.21.0 and pnpm 10.34.8.

| Check                     | Result                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Frozen-lockfile install   | Passed; repeat offline install also passed                                                                                                  |
| ESLint                    | Passed with zero warnings                                                                                                                   |
| TypeScript                | All six packages/apps plus build/browser configuration and test files passed                                                                |
| Vitest                    | 17 tests passed: tokens 2, theme 5, React DOM 6, native adapter 4                                                                           |
| Library production builds | Four packages emitted ESM, CommonJS, declarations and maps                                                                                  |
| Next.js production build  | Passed; docs and not-found routes prerendered                                                                                               |
| Expo production export    | iOS and Android Hermes bundles generated successfully                                                                                       |
| Packed package checks     | Four archives unpacked; exports/types/README/boundaries checked; packed ESM/CJS token imports and React SSR passed                          |
| Browser checks            | Desktop and mobile Chrome smoke tests passed; keyboard navigation, themes, accent customization, no page errors or horizontal page overflow |
| Visual inspection         | Desktop 1440px and mobile 390px in light/dark; no clipping or layout defects found                                                          |
| Expo dependency matrix    | Online `expo install --check` passed                                                                                                        |
| Formatting                | Prettier check passed                                                                                                                       |
| Changesets                | Status, release plan, version bumps, and changelog generation passed in a disposable Git fixture                                            |

Phase 1 is recorded on `main` in four batches: workspace tooling, foundation packages, example apps, and verification/documentation. The annotated `v0.1.0-foundation` tag marks the completed foundation. Package versions remain 0.1.0 with the initial changeset pending; this Git milestone does not publish npm packages.

Dependency downloads were slow and intermittently reset. Large archives were resumed in chunks, validated against npm SHA-512 integrity values, then cached; the checked-in lockfile retains normal registry URLs/integrities. Download helpers and caches are local scratch files, excluded from source deliverables. Re-running from the complete cache succeeds offline.

## Deliberately deferred

No component catalog, reusable Button/Card/Input APIs, gestures, animation runtime, haptics, advanced renderer, CLI, native modules, website publication, or npm publication. Naming/scope and license remain undecided.

## Native validation boundary

Metro exports verify iOS/Android JavaScript bundle generation, not native binary compilation or runtime rendering. A bare React Native host, native accessibility, large font scales, appearance, safe areas, and platform shadow quality require native integration/device validation before claiming support. Simulator and Android service probes were unavailable in the sandbox; no native screenshot evidence is claimed.

## Phase 2 · Surface engine and visual calibration

Implemented on `feat/surface-engine`, preserving the Phase 1 foundation. Added a pure deterministic recipe resolver in `@tactile-ui/theme`, public non-interactive Surface containers in both platform adapters, polished/porcelain reference materials, Next.js `/surface-lab`, and an Expo Surface Lab within the existing showcase. Added resolver/adapter/browser/packed-consumer coverage and a pending minor Changeset for theme and both adapters. No production Button or advanced renderer was implemented; package versions and publication remain untouched.

Verified on 25 October 2026 with Node 24.21.0, pnpm 10.34.8, and installed Google Chrome.

| Check                                           | Exact result                                                                                                                                                                                              |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                                    | Passed (exit 0): lint, typecheck, unit tests, production builds and packed packages                                                                                                                       |
| ESLint                                          | Passed; zero warnings                                                                                                                                                                                     |
| TypeScript                                      | All six libraries/apps, tooling and test sources passed; native public declarations retain external RN types                                                                                              |
| Vitest                                          | 31/31 passed in seven files: tokens 2, theme 14, React DOM 9, native adapter 6; includes all 17 Phase 1 tests                                                                                             |
| Libraries                                       | Four ESM/CJS/declaration/source-map builds passed                                                                                                                                                         |
| Next.js                                         | Production build passed; `/`, `/_not-found`, `/surface-lab` prerendered                                                                                                                                   |
| Expo export                                     | iOS and Android Hermes JS bundles and reference asset exported successfully                                                                                                                               |
| Packed consumers                                | Four archives passed export/declaration/README/dependency checks; packed resolver + Surface SSR passed in ESM and CommonJS                                                                                |
| `PLAYWRIGHT_CHANNEL=chrome pnpm test:browser`   | 4/4 passed across desktop/mobile Chrome: original foundation and Surface Lab controls, keyboard skip link, slider keyboard input, reference loading, themes, reset, no page errors or horizontal overflow |
| `pnpm format:check`                             | Passed                                                                                                                                                                                                    |
| `pnpm --filter @tactile-ui/showcase run doctor` | Passed; dependencies are up to date                                                                                                                                                                       |
| Visual evidence                                 | Inspected 1440px desktop and 390px mobile, light/dark, and 916px original/reconstruction frames; no clipping/overflow in the captured layouts                                                             |
| Reference integrity                             | Original and docs public copy have identical SHA-256 `bec08c02bc10dfc96214304be2dcad196fb17f91e57fe48db1df9143d2eb41df`                                                                                   |
| Changesets                                      | `pnpm changeset status` passed; pending release plan only, no version/publish run                                                                                                                         |
| Native device validation                        | Not performed: no booted iOS simulator and no attached Android device. Exports are not native binary or runtime validation                                                                                |

Browser tests now use a fresh production server on port 3100 (`PLAYWRIGHT_PORT` overrides it) with server reuse disabled. This avoids stale Phase 1 servers or unrelated apps on port 3000. The initial stale-server run was invalid evidence; the final isolated run passed all four tests.

The static web design detector reported one font advisory for Arial in the reference reconstruction. That lab-only fallback is deliberate because the source font is unknown; the surrounding docs retain Newsreader and system text. The detector has no native visual verdict. See [Surface API and calibration](SURFACES.md) for detailed fidelity limits: glyph weight/width, medallion color field, bevel/antialiasing/shadow falloff, and native 24-band fills/solid rims/iOS versus Android shadows. No numeric pixel-match score or pixel-identical/native parity claim is made. Native accessibility, large font scaling, real device rendering, binary builds and a bare-host integration remain unverified.

The independent web finish review identified two material fixes: fit controls plus specimen in the mobile first viewport, and expose the radius endpoint as “Pill” to assistive technology. Both were scored resolved in the reviewer’s final `ship` verdict pass. This is approval of those two web fixes, not a native visual verdict. The final 390×844 captures place the live specimen at y=652.83 with height=66.58 (bottom=719.41); tests assert the first viewport from document top, spoken radius values, and atomic reference/reconstruction frame alignment. The documentation review found the APIs and evidence consistent with the implementation, with no blocking gap. Historical Phase 1 wording in PRODUCT.md was reported as pre-existing context drift and preserved.

## Phase 2.1 · Surface visual refinement

Implemented on `feat/surface-engine` on 25 October 2026, starting from clean `7bc12d2`. Both existing platform adapters consume restrained polished/porcelain recipes: narrower/lighter lower lips, softer shadow opacity with wider falloff, and lower Android elevation. The polished top highlight is softer; porcelain preserves its white upper highlight with subtler edges. Fixture typography is lighter and vertically centered. Public APIs, token/theme customization, package exports, state/depth behavior, accessibility boundaries, and dependencies remain unchanged. No production Button, renderer, package publication, push, or merge was performed.

Captured pre-edit recipes and screenshots before changes; visually inspected the original, baseline, and refined 916 × 166 frames plus desktop/mobile light/dark, tablet dark, four-size geometry, pressed/radius-16 samples and overlay. The lab now exposes those three comparison generations and standalone responsive size fixtures; its existing controls remain covered. See [the full calibration record and Phase 3 recommendation](phase-2.1/CALIBRATION.md).

| Check                          | Phase 2.1 result                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| Full `pnpm check`              | Exit 0: lint, types, tests, app/library builds, packed consumers                              |
| ESLint / TypeScript            | Zero lint warnings; all six apps/packages plus tooling/tests passed                           |
| Unit tests                     | 35/35 in 7 files: tokens 2, theme 16, DOM 9, native 8                                         |
| Libraries / Next.js            | Four ESM/CJS/type builds; docs routes `/`, `/_not-found`, `/surface-lab` prerendered          |
| Expo export                    | iOS and Android Hermes bundles and canonical reference asset exported                         |
| Packed consumers               | All four archives and ESM/CJS theme + DOM SSR passed                                          |
| Browser                        | 4/4 desktop/mobile Chrome tests passed in 6.0s                                                |
| Expo dependencies / Changesets | Both checks exit 0; existing pending release plan only                                        |
| Visual inspection              | Web evidence reviewed at 1440, 768, and 390px widths; no page overflow/errors                 |
| Design detector                | One existing Arial reference-fixture advisory; retained intentionally                         |
| Native runtime                 | No booted iOS simulator or Android device; no native binary/runtime/visual acceptance claimed |

Validation used Node 24.21.0 and pnpm 10.34.8. The default pnpm 11.25.0 failed the engine guard before validation; a temporary local shim routed nested commands to the cached pinned version without repository toolchain changes. Builds emitted harmless NO_COLOR/FORCE_COLOR environment warnings.

Final `pnpm format:check` and `git diff --check` both passed (exit 0).

Implementation and web review are ready for user approval. Phase 3 has not begun and must wait for refined-surface approval. Native views still approximate continuous gradients/inset shadows; Android OS elevation differs from iOS/web. Native phone/tablet screenshots, font scaling, screen readers, binary builds, and an external bare-host test remain outstanding. No further engine architecture is required to start Button composition after approval.
