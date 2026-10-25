# Contributing

## Daily workflow

Use the Node/pnpm versions declared at the root, install dependencies, and run `pnpm dev` for app servers and package watchers. `pnpm dev:docs` and `pnpm dev:native` build package dependencies then start one app; rebuild packages when using those focused commands after library edits.

Before submitting changes run `pnpm format:check`, `pnpm check`, and, for browser changes, `pnpm test:browser` after installing Playwright Chromium. To update formatting run `pnpm format`.

## Adding code later

- Keep primitive data in tokens and semantic resolution in theme.
- Keep web semantics in the DOM adapter and native views in the native adapter.
- Declare every import's dependency explicitly. Platform runtimes are peer dependencies in published adapters and normal dependencies in apps.
- Keep advanced engines out of base packages and their re-exports.
- Test public behavior and meaningful boundaries. Future components need keyboard/screen-reader, touch-target, reduced-motion, and platform checks.
- Do not broaden native peer ranges until a consumer on that version has been verified.

## Release process

1. Run `pnpm changeset`, select affected packages, and describe the user-visible change.
2. Review the changeset with code and tests.
3. From a clean release checkout, run `pnpm version-packages`; commit version updates and changelogs. Changesets updates internal semver relationships.
4. Resolve the final name/npm scope, ownership, license and package metadata. Verify publication permissions. No license is assumed by this scaffold.
5. Run `pnpm check` and `pnpm format:check`. Review packed contents; `pnpm --filter @tactile-ui/react pack --pack-destination work/releases` can create an archive for manual inspection.
6. A maintainer runs `pnpm release` with authorized npm credentials. The script builds packages, checks archives, then publishes through Changesets.

CI only verifies. It does not version or publish packages. The initial changeset is pending; the checked-in 0.1.0 versions have not been released. `baseBranch` is `main`. The annotated `v0.1.0-foundation` tag records the completed Phase 1 foundation; npm versioning and publication remain separate maintainer actions.

## Native verification

`pnpm build` exports iOS and Android bundles. To build a binary, install the target platform toolchain and use Expo's `run:ios` / `run:android` locally, or configure an authorized EAS project. Generated native projects are ignored. Validate light/dark appearance, system-following, safe areas, large font scale, screen readers, and real-device shadows separately. Add a bare React Native consumer before claiming that environment is supported.
