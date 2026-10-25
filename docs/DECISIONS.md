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
| No component catalog in Phase 1          | Stabilize dependency direction and tooling first                            | No Button, Input, Card, or primitive control exports yet                            |
| Manual Changesets release                | Final identity and ownership remain undecided                               | No unattended npm publication                                                       |
