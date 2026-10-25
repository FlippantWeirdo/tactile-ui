# Tactile UI

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

User specified pnpm, Turborepo, TypeScript, separate React DOM and React Native packages, Next.js documentation, and an Expo native showcase.

## Users and Purpose

Developers building tactile interfaces for web and React Native. Phase 1 provides the shared foundation and development workflow, without a component catalog.

## Capabilities and Constraints

Expo-first showcase; bare React Native compatibility is an architectural goal. Use native views first. Advanced rendering must remain optional and isolated. Distribute npm packages first. Provide shared, customizable tokens and light/dark themes, tests, lint, builds, Changesets, and architecture/progress documentation.

## Brand Commitments

The user confirmed that naming is undecided and should be easy to change. “Tactile UI” and `@tactile-ui` are provisional identifiers. No published brand, logo, npm scope ownership, or prior visual specification is available.

## Evidence on Hand

The referenced conversation exposes user decisions, but earlier assistant messages are unavailable content references. The current user request is the implementation contract. Workspace inspection found an empty directory and no existing code or Git repository.

## Product Principles

- Share design decisions; preserve each platform's rendering and accessibility conventions.
- Keep the base installation free of advanced rendering dependencies.
- Make packages usable outside this monorepo.
- Document verified behavior and unresolved platform validation explicitly.

## Open Decisions

Final name, npm scope, ownership, license, component APIs, and advanced renderer implementations remain undecided. Shell styling is a provisional implementation choice, not a final brand decision.
