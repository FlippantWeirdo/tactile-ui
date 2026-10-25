# Architecture decisions

| Decision                                 | Rationale                                                                   | Consequence                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Separate DOM and native packages         | Preserve platform semantics and avoid a web abstraction leaking into native | Shared design contracts, separate rendering implementations                         |
| Expo-first app, Expo-independent library | Quick native development with a path to bare React Native                   | No Expo imports in the base native package; bare integration still needs validation |
| Framework-free tokens and theme factory  | Design decisions should work outside React and on the server                | No hooks, browser APIs, platform dimensions, or CSS strings in shared data          |
| Compiled npm packages first              | Validate what external consumers will install                               | Real exports/declarations and archive checks rather than source aliases             |
| Native rendering baseline                | Avoid heavy mandatory engines and preserve accessibility                    | Approximate platform depth; optional engines must remain separate packages          |
| pnpm isolated install and standard Metro | Detect undeclared dependencies without monorepo resolver patches            | All workspace imports must be declared                                              |
| Separate docs and showcase               | Exercise platform adapters in their real bundlers                           | No React Native Web dependency or universal UI aliasing                             |
| No component catalog in Phase 1          | Stabilize dependency direction and tooling first                            | Controls were deferred then; Phase 3 introduces Button                              |
| Manual Changesets release                | Final identity and ownership remain undecided                               | No unattended npm publication                                                       |

## Phase 2 decisions

- Keep the deterministic surface recipe in the existing pure theme package; both adapters consume it without adding a fifth package or renderer dependency.
- Fix polished/porcelain material colors to the supplied reference in both appearances. Theme mode governs the surrounding UI; named radius still supports theme customization.
- Make Surface state visual and explicit. Surface remains a div/View container; Phase 2 deferred interaction semantics to future controls, now introduced by Phase 3 Button.
- Use CSS continuous gradients/inset shadows on web; use 24 clipped solid native fill strips, solid rim layers and platform depth on native. The baseline capability descriptor stays honest about missing native inset blur.
- Preserve Phase 1 routes, theme APIs, tests and release boundaries. Add labs and package-consumer tests without publishing or versioning packages.

## Phase 3 decisions

- Compose Button with the existing public Surface on both platforms. Keep material rendering and the approved Phase 2.1 recipe unchanged; Button owns layout, content, interaction, focus, and motion.
- Keep the API small: polished/porcelain, three shared token sizes, disabled/loading/full width, and decorative icon slots. Forward native platform control props and refs; provide no forced visual-state or reference-specific accent prop.
- Use a real HTML button and React Native Pressable. Default web type to button while retaining submit/reset and ordinary form attributes. Loading blocks activation, keeps stable content in layout, and exposes busy state.
- Export an explicit web stylesheet for focus, transitions, icon sizing, and loading behavior. Preserve Surface-only usage without a stylesheet. Ship the CSS artifact in packed archives.
- Use CSS and built-in React Native Animated with shared motion tokens; respect platform reduced-motion preferences without adding a mandatory runtime. Future engine/gesture/haptics adapters remain opt-in.
- Keep the warm arrow medallion in the labs as optional trailing-slot composition. Retain the docs shell, foundation, and Surface Lab rather than introduce a new visual system.
- Distinguish browser and mocked-host evidence from device acceptance. Native appearance, screen readers, large text, focus, animation, and bare-host integration still need runtime validation. Publication, pushing, and merging remain explicit maintainer actions.

See [the Button contract](BUTTONS.md) for the public API and [progress](PROGRESS.md) for verification evidence.
